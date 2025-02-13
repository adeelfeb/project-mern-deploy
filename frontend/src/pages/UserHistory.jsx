import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserHistory } from "../store/currentVideoSlice";
import videoService from "../AserverAuth/config";

// Lazy load VideoDetails component
const VideoDetails = lazy(() => import("./VideoDetails"));

const CACHE_EXPIRY = 30 * 1000; // 30 seconds

const UserHistory = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const userHistory = useSelector((state) => state.currentVideo.userHistory || []);

    const fetchHistory = useCallback(async (forceRefresh = false) => {
        if (isLoading) return; // Prevent duplicate requests
        setIsLoading(true);

        try {
            const cachedHistory = localStorage.getItem("watchHistory");
            const lastFetched = parseInt(localStorage.getItem("lastFetched"), 10);

            if (!forceRefresh && cachedHistory && lastFetched && Date.now() - lastFetched < CACHE_EXPIRY) {
                dispatch(setUserHistory(JSON.parse(cachedHistory)));
                setIsLoading(false);
                return;
            }

            const response = await videoService.getUserHistory();
            if (response.data && Array.isArray(response.data)) {
                dispatch(setUserHistory(response.data));
                localStorage.setItem("watchHistory", JSON.stringify(response.data));
                localStorage.setItem("lastFetched", Date.now().toString());
            }
        } catch (error) {
            console.error("Error fetching user history:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, isLoading]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const memoizedHistory = useMemo(() => userHistory, [userHistory]);

    return (
        <div className="p-2 bg-white rounded-lg shadow-lg h-screen flex flex-col">
            {/* Button Group */}
            <div className="flex justify-center gap-4 flex-wrap mb-4">
                <button
                    onClick={() => fetchHistory(true)}
                    className={`px-4 py-2 text-white rounded-lg transition-all text-sm sm:text-base ${
                        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "🔄 Reload History"}
                </button>

                {selectedVideo && (
                    <button
                        onClick={() => setSelectedVideo(null)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base"
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
                <div className="flex-1 overflow-y-auto mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-50 p-4 mb-8 rounded-lg shadow-md">
                    {memoizedHistory.length > 0 ? (
                        memoizedHistory.map((videoData, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:bg-gray-100 border-2 border-gray-200"
                            >
                                <h4 className="font-semibold text-lg text-gray-800 truncate">{videoData.title}</h4>
                                <p className="text-sm text-gray-600 mt-2 truncate">Duration: {videoData.duration}</p>
                                <p className="text-sm text-gray-600 mb-2 truncate">
                                    Watched: {new Date(videoData.createdAt).toLocaleString()}
                                </p>

                                <div className="flex justify-center items-center mb-4">
                                    {videoData.thumbnailUrl ? (
                                        <img
                                            src={videoData.thumbnailUrl}
                                            alt="Video Thumbnail"
                                            className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
                                            loading="lazy"
                                            onClick={() => window.open(videoData.videoUrl, "_blank")}
                                        />
                                    ) : (
                                        <p className="text-gray-500">No thumbnail available</p>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setSelectedVideo(videoData)}
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




















// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setUserHistory } from "../store/currentVideoSlice";
// import videoService from "../AserverAuth/config";
// import VideoDetails from "./VideoDetails";

// const UserHistory = () => {
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const dispatch = useDispatch();
//   const userHistory = useSelector((state) => state.currentVideo.userHistory || []); // Get history from Redux


// const fetchHistory = async (forceRefresh = false) => {
//     if (isLoading) return; // Prevent multiple requests at once
//     setIsLoading(true);

//     try {
//         const cachedHistory = localStorage.getItem("watchHistory");
//         const lastFetched = localStorage.getItem("lastFetched");

//         // Skip cache if forceRefresh is true (i.e., when reload button is clicked)
//         if (!forceRefresh && cachedHistory && lastFetched && Date.now() - lastFetched < 1/2 * 60 * 1000) {
//             dispatch(setUserHistory(JSON.parse(cachedHistory)));
//             setIsLoading(false);
//             return;
//         }

//         const response = await videoService.getUserHistory();
//         if (response.data && Array.isArray(response.data)) {
//             dispatch(setUserHistory(response.data));
//             localStorage.setItem("watchHistory", JSON.stringify(response.data));
//             localStorage.setItem("lastFetched", Date.now());
//         }
//     } catch (error) {
//         console.error("Error fetching user history:", error);
//     } finally {
//         setIsLoading(false);
//     }
// };



//   // Fetch history on mount
//   useEffect(() => {
//     fetchHistory();
//   }, []);


// return (
//     <div className="p-2 bg-white rounded-lg shadow-lg h-screen flex flex-col">
//       {/* Button Group - Centered & Responsive */}
//       <div className="flex justify-center gap-4 flex-wrap mb-4">
//         {/* Reload Button */}
//         <button
//     onClick={() => fetchHistory(true)} // Force refresh
//     className={`px-4 py-2 text-white rounded-lg transition-all ease-in-out text-sm sm:text-base ${
//         isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
//     }`}
//     disabled={isLoading}
// >
//     {isLoading ? "Loading..." : "🔄 Reload History"}
// </button>

  
//         {/* Back Button (Only show if there's a selected video) */}
//         {selectedVideo && (
//           <button
//             onClick={() => setSelectedVideo(null)}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all ease-in-out text-sm sm:text-base"
//           >
//             &lt; Back
//           </button>
//         )}
//       </div>
  
//       {selectedVideo ? (
//         <VideoDetails data={selectedVideo} />
//       ) : (
//         <div className="flex-1 overflow-y-auto mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-50 p-4 mb-8 rounded-lg shadow-md">
//           {userHistory.length > 0 ? (
//             userHistory.map((videoData, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all ease-in-out transform hover:scale-105 hover:bg-gray-100 border-2 border-gray-200"
//               >
//                 <h4 className="font-semibold text-lg text-gray-800 truncate">{videoData.title}</h4>
//                 <p className="text-sm text-gray-600 mt-2 truncate">Duration: {videoData.duration}</p>
//                 <p className="text-sm text-gray-600 mb-2 truncate">
//                   Watched: {new Date(videoData.createdAt).toLocaleString()}
//                 </p>
  
//                 <div className="flex justify-center items-center mb-4">
//                   {videoData.thumbnailUrl ? (
//                     <img
//                       src={videoData.thumbnailUrl}
//                       alt="Video Thumbnail"
//                       className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
//                       onClick={() => window.open(videoData.videoUrl, "_blank")}
//                     />
//                   ) : (
//                     <p className="text-gray-500">No thumbnail available</p>
//                   )}
//                 </div>
  
//                 <div className="flex justify-center">
//                   <button
//                     onClick={() => setSelectedVideo(videoData)}
//                     className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all ease-in-out text-sm sm:text-base"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center w-full">No history available</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
  
// };

// export default UserHistory;
