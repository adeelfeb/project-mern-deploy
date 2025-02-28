import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserHistory } from "../store/currentVideoSlice";
import videoService from "../AserverAuth/config";
import { FaEllipsisV } from "react-icons/fa"; // Import three-dot menu icon
import { clearTranscript } from "../store/currentVideoSlice";

const VideoDetails = lazy(() => import("./VideoDetails"));

const CACHE_EXPIRY = 30 * 1000; // 30 seconds





const UserHistory = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(null); // Store open menu videoId

    const dispatch = useDispatch();
    const userHistory = useSelector((state) => state.currentVideo.userHistory || []);

    const [fetchAttempts, setFetchAttempts] = useState(0);
    const [fetchError, setFetchError] = useState(false);

const fetchHistory = useCallback(async (forceRefresh = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setFetchError(false); // Reset error state on new fetch attempt
    let attempts = 0;

    while (attempts < 3) {
        try {
            const cachedHistory = localStorage.getItem("watchHistory");
            const lastFetched = parseInt(localStorage.getItem("lastFetched"), 10);

            if (!forceRefresh && cachedHistory && lastFetched && Date.now() - lastFetched < CACHE_EXPIRY) {
                dispatch(setUserHistory(JSON.parse(cachedHistory)));
                setIsLoading(false);
                return;
            }

            const response = await videoService.getUserHistory();
            // console.log("the video history response is;", response)
            if (response.data && Array.isArray(response.data)) {
                dispatch(setUserHistory(response.data));
                localStorage.setItem("watchHistory", JSON.stringify(response.data));
                localStorage.setItem("lastFetched", Date.now().toString());
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error(`Attempt ${attempts + 1} failed:`, error);
            attempts++;
            setFetchAttempts(attempts);
        }
    }

    // If all 3 attempts fail, set error state
    setFetchError(true);
    setIsLoading(false);
}, [dispatch, isLoading]);

useEffect(() => {
    fetchHistory();
}, [fetchHistory]);


    const [deletingVideoId, setDeletingVideoId] = useState(null); // Track which video is being deleted

const handleDelete = async (videoId) => {
    setDeletingVideoId(videoId); // Set loading state
    try {
        await videoService.deleteFromHistory(videoId);
        dispatch(setUserHistory(userHistory.filter(video => video._id !== videoId)));
        setOpenMenu(null);
    } catch (error) {
        console.error("Error deleting video:", error);
    } finally {
        setDeletingVideoId(null); // Reset loading state
    }
};


    return (
        <div className="p-2 bg-white rounded-lg shadow-lg h-screen flex flex-col">
            {/* Button Group */}
            <div className="flex justify-center gap-4 flex-wrap mb-4">
            <button
                onClick={() => fetchHistory(true)}
                className={`px-4 py-2 text-white rounded-3xl transition-all text-sm sm:text-base ${
                    isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : fetchError
                        ? "bg-red-500 hover:bg-red-600" // Show red if there was an error
                        : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : fetchError ? "❌ Failed! Retry" : "🔄 Reload History"}
            </button>

                {selectedVideo && (
                    <button
                        
                        onClick={() => setSelectedVideo(null)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition-all text-sm sm:text-base"
                    >
                        &lt; Back
                    </button>
                )}
            </div>

            {selectedVideo ? (
                <Suspense fallback={<p className="text-center">Loading details...</p>}>
                    <VideoDetails data={selectedVideo} />
                </Suspense>
            ) : (
                <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-50 p-4 mb-8 rounded-lg shadow-md">
                    {userHistory.length > 0 ? (
                        userHistory.map((video) => (
                            <div key={video._id} className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:bg-gray-100 border-2 border-gray-200">
                                {/* Three-dot menu */}
                                <div className="absolute top-2 right-2">
                                    <button onClick={() => setOpenMenu(openMenu === video._id ? null : video._id)}>
                                        <FaEllipsisV className="text-gray-600 hover:text-gray-800 cursor-pointer" />
                                    </button>
                                    {openMenu === video._id && (
                                        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2 border">
                                   <button
                                        onClick={() => handleDelete(video._id)}
                                        className="text-red-500 px-4 py-1 text-sm hover:bg-red-100 rounded-md w-full disabled:opacity-50"
                                        disabled={deletingVideoId === video._id} // Disable button while deleting
                                    >
                                        {deletingVideoId === video._id ? "Deleting..." : "Delete"}
                                    </button>

                                        </div>
                                    )}
                                </div>

                                <h4 className="font-semibold text-lg text-gray-800 truncate">{video.title}</h4>
                                <p className="text-sm text-gray-600 mt-2 truncate">Duration: {video.duration}</p>
                                <p className="text-sm text-gray-600 mb-2 truncate">
                                    Watched: {new Date(video.createdAt).toLocaleString()}
                                </p>

                                <div className="flex justify-center items-center mb-4">
                                    {video.thumbnailUrl ? (
                                        <img
                                            src={video.thumbnailUrl}
                                            alt="Video Thumbnail"
                                            className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
                                            loading="lazy"
                                            onClick={() => window.open(video.videoUrl, "_blank")}
                                        />
                                    ) : (
                                        <p className="text-gray-500">No thumbnail available</p>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setSelectedVideo(video)}
                                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center w-full">No history available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserHistory;
