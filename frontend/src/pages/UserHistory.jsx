


import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserHistory } from "../store/currentVideoSlice";
import videoService from "../AserverAuth/config";
import { FaEllipsisV } from "react-icons/fa"; // Import three-dot menu icon
import { lazy, Suspense } from "react";

const VideoDetails = lazy(() => import("./VideoDetails"));

// Default thumbnail URL (from your backend)
const DEFAULT_THUMBNAIL = "https://havecamerawilltravel.com/wp-content/uploads/2020/01/youtube-thumbnails-size-header-1-800x450.png";

const CACHE_EXPIRY = 30 * 1000; // 30 seconds

const UserHistory = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(null); // Store open menu videoId
    const [deletingVideoId, setDeletingVideoId] = useState(null); // Track which video is being deleted
    const [fetchAttempts, setFetchAttempts] = useState(0);
    const [fetchError, setFetchError] = useState(false);

    const dispatch = useDispatch();
    const userHistory = useSelector((state) => state.currentVideo.userHistory || []);

    const fetchHistory = useCallback(async (forceRefresh = false) => {
        if (isLoading) return; // Prevent multiple requests

        setIsLoading(true);
        setFetchError(false); // Reset error state
        let attempts = 0;

        try {
            const cachedHistory = localStorage.getItem("watchHistory");
            const lastFetched = parseInt(localStorage.getItem("lastFetched"), 10);

            if (!forceRefresh && cachedHistory && lastFetched && Date.now() - lastFetched < CACHE_EXPIRY) {
                dispatch(setUserHistory(JSON.parse(cachedHistory)));
                setIsLoading(false);
                return;
            }

            while (attempts < 3) {
                try {
                    const response = await videoService.getUserHistory();
                    if (response.data && Array.isArray(response.data)) {
                        dispatch(setUserHistory(response.data));
                        localStorage.setItem("watchHistory", JSON.stringify(response.data));
                        localStorage.setItem("lastFetched", Date.now().toString());
                        break; // Exit loop on success
                    }
                } catch (error) {
                    console.error(`Attempt ${attempts + 1} failed:`, error);
                    attempts++;
                    setFetchAttempts((prev) => prev + 1); // Use function form to prevent unnecessary renders
                }
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            setFetchError(true);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, isLoading]); // Add `isLoading` to dependencies to prevent race conditions

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]); // Only run on mount and when `fetchHistory` changes

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
        <div className="p-4 bg-white rounded-lg shadow-lg h-screen flex flex-col">
            {/* Button Group */}
            <div className="flex justify-center gap-4 flex-wrap mb-4">
                <button
                    onClick={() => fetchHistory(true)}
                    className={`px-4 py-2 text-white rounded-xl transition-all text-sm sm:text-base ${
                        isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : fetchError
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : fetchError ? "❌ Failed! Retry" : "🔄 Reload History"}
                </button>
    
                {selectedVideo && (
                    <button
                        onClick={() => setSelectedVideo(null)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm sm:text-base"
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
                <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50 p-3 mb-6 rounded-lg shadow-md auto-rows-min">
                    {userHistory.length > 0 ? (
                        userHistory.map((video) => (
                            <div
                                key={video._id}
                                className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 border border-gray-200 min-h-[200px] flex flex-col"
                            >
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
                                                disabled={deletingVideoId === video._id}
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
    
                                <div className="flex justify-center items-center mb-3 flex-grow">
                                    {video.thumbnailUrl === DEFAULT_THUMBNAIL ? (
                                        <video
                                            src={video.videoUrl}
                                            className="w-full h-36 object-cover rounded-md shadow-md cursor-pointer"
                                            controls
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img
                                            src={video.thumbnailUrl}
                                            alt="Video Thumbnail"
                                            className="w-full h-36 object-cover rounded-md shadow-md cursor-pointer"
                                            loading="lazy"
                                            onClick={() => window.open(video.videoUrl, "_blank")}
                                        />
                                    )}
                                </div>
    
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setSelectedVideo(video)}
                                        className="px-4 py-2 text-white   rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all text-sm sm:text-base"
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