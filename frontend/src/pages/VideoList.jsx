import React, { useEffect, useState, lazy, Suspense, useCallback } from "react"; // Added useCallback
import videoService from "../AserverAuth/config"; // Adjust path if needed
import { FiMoreVertical, FiRefreshCw, FiTrash2, FiEye, FiFilter, FiXCircle, FiVideo, FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Added Chevron icons
import { ImSpinner8 } from "react-icons/im"; // Loading spinner

const VideoDetails = lazy(() => import("./VideoDetails")); // Adjust path if needed
const PLACEHOLDER_THUMBNAIL = 'https://via.placeholder.com/320x180.png?text=Video';
const DEFAULT_LIMIT = 20; // Match backend or set desired default

const VideoList = () => {
    // --- Existing State ---
    const [videos, setVideos] = useState([]); // Will hold only the videos for the current page
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [loading, setLoading] = useState(true); // For initial load and page changes
    const [deleting, setDeleting] = useState(false);
    const [showNAOnly, setShowNAOnly] = useState(false); // Keep filter state if needed locally
    const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);
    const [error, setError] = useState(null);

    // --- New Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);
    const [limit, setLimit] = useState(DEFAULT_LIMIT); // Or sync with a UI element later
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    // --- Fetch function updated for pagination ---
    // Use useCallback to memoize the function if needed, especially if passed down
    const fetchVideos = useCallback(async (pageToFetch = currentPage, showLoader = true) => {
        // Prevent fetching if already deleting (optional, depends on desired UX)
        // if (deleting) return;

        if (showLoader) setLoading(true);
        setError(null);
        // Clear selections when changing page or reloading list
        setSelectedVideos([]);
        setMenuOpen(null);

        try {
            // Call the updated service function
            const paginatedData = await videoService.getAllVideos(pageToFetch, limit);
            // console.log(paginatedData)

            if (paginatedData) {
                // Update state with data from the specific page and pagination metadata
                setVideos(paginatedData.docs || []); // Use 'docs' array
                setTotalPages(paginatedData.totalPages || 1);
                setTotalDocs(paginatedData.totalDocs || 0);
                setCurrentPage(paginatedData.page || 1); // Ensure current page state matches response
                setHasNextPage(paginatedData.hasNextPage || false);
                setHasPrevPage(paginatedData.hasPrevPage || false);
            } else {
                // Handle case where service returns null/undefined unexpectedly
                throw new Error("No data received from video service.");
            }
        } catch (err) {
            console.error(`Error fetching videos for page ${pageToFetch}:`, err);
            setError(err.message || `Failed to fetch page ${pageToFetch}. Please try again.`);
             // Optionally reset videos if fetch fails
             setVideos([]);
             setTotalPages(1);
             setTotalDocs(0);
        } finally {
            if (showLoader) setLoading(false);
        }
    // Include limit and currentPage in dependencies if fetchVideos should re-run when they change outside of direct calls
    // }, [limit, currentPage]); // Or }, [limit]) if currentPage changes trigger direct calls
    }, [limit]); // Memoize based on limit


    // Fetch initial data on component mount
    useEffect(() => {
        fetchVideos(1); // Fetch page 1 initially
    }, [fetchVideos]); // Rerun if fetchVideos function itself changes (due to `limit` dependency)

    // --- Handler Functions (Delete, Selection, etc. - Mostly unchanged) ---
    const handleDelete = async (videoId) => {
        if (window.confirm("Are you sure you want to permanently delete this video and its data?")) {
            setDeleting(true);
            try {
                await videoService.deleteVideo(videoId);
                // Refetch the current page to get updated list and potentially update total counts
                // OR just remove locally if total count doesn't matter immediately
                 setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
                 setTotalDocs(prev => prev - 1); // Adjust total count locally
                 // Note: This local removal might make the page have fewer items than 'limit' until refresh/page change
                 // Consider refetching `fetchVideos(currentPage, false)` for accuracy, but it's an extra API call
                setMenuOpen(null);
            } catch (err) {
                console.error("Error deleting video:", err);
                alert("Failed to delete video: " + (err.message || "Unknown error"));
            } finally {
                setDeleting(false);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedVideos.length === 0) return;
        if (window.confirm(`Are you sure you want to permanently delete ${selectedVideos.length} selected video(s)?`)) {
            setDeleting(true);
            try {
                await videoService.deleteVideos(selectedVideos);
                 // Refetch the current page after bulk delete for accurate data
                 fetchVideos(currentPage, false); // Don't show main loader for this refresh
            } catch (err) {
                console.error("Error deleting videos:", err);
                alert("Failed to delete videos: " + (err.message || "Unknown error"));
                 setDeleting(false); // Ensure deleting state is reset on error
            } finally {
                 // setLoading(false) is handled by fetchVideos now if it was called
                 // Reset deleting state only if fetch wasn't called on success
                 if (!deleting) setDeleting(false); // Should be redundant now
            }
        }
    };

    const toggleVideoSelection = (videoId) => {
        setSelectedVideos((prevSelected) =>
            prevSelected.includes(videoId)
                ? prevSelected.filter((id) => id !== videoId)
                : [...prevSelected, videoId]
        );
    };

    // Select All now only selects videos on the CURRENT page
    const toggleSelectAll = (displayedVideoIds) => {
        // Get IDs of only the videos currently displayed (already filtered if applicable)
         const currentVideoIds = displayedVideos.map(v => v._id); // Use the already computed displayedVideos

        if (selectedVideos.length === currentVideoIds.length && currentVideoIds.length > 0) {
             // Deselect only the videos on the current page if all are selected
            setSelectedVideos(prevSelected => prevSelected.filter(id => !currentVideoIds.includes(id)));
        } else {
             // Select all unique videos on the current page, merging with any selections from other pages
            setSelectedVideos(prevSelected => [...new Set([...prevSelected, ...currentVideoIds])]);
        }
    };


    const isAvailable = (data) => {
        if (data === null || typeof data === 'undefined') return false;
        if (typeof data === "string") return data.trim() !== "" && data.trim().toUpperCase() !== "NA";
        if (Array.isArray(data)) return data.length > 0;
        if (typeof data === "object") return Object.keys(data).length > 0;
        if (typeof data === 'number') return true;
        if (typeof data === 'boolean') return true;
        return false;
    };

    // Filter logic now applies only to the current page's videos in state
    const getDisplayedVideos = () => {
        const filtered = showNAOnly
            ? videos.filter( // Filter the 'videos' state (current page)
                (video) => !isAvailable(video.transcript?.english) && !isAvailable(video.transcript?.original)
            )
            : videos; // Use the 'videos' state (current page)
        return filtered;
    };

    const displayedVideos = getDisplayedVideos(); // This is now the filtered list for the current page
    const displayedVideoIds = displayedVideos.map((v) => v._id); // IDs on the current page


    // --- Pagination Handlers ---
    const handleNextPage = () => {
        if (hasNextPage) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage); // Optimistic update (optional)
            fetchVideos(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (hasPrevPage) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage); // Optimistic update (optional)
            fetchVideos(prevPage);
        }
    };

    // --- Loading State UI (Unchanged) ---
    if (loading && videos.length === 0) { // Show full screen loader only on initial load
        return ( <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50 text-center"> <ImSpinner8 className="animate-spin text-5xl text-blue-600 mb-4" /> <p className="text-lg text-gray-700">Loading Video Library...</p> </div> );
    }

    // --- Error State UI (Unchanged) ---
    if (error && !loading && videos.length === 0) { // Show full screen error only if loading failed completely
        return ( <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-red-50 text-center"> <FiXCircle className="text-5xl text-red-500 mb-4"/> <p className="text-xl font-semibold text-red-700 mb-2">Error Loading Videos</p> <p className="text-gray-700 mb-6 max-w-md">{error}</p> <button onClick={() => fetchVideos(1)} className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"> <FiRefreshCw className="mr-2" /> Retry Loading </button> </div> );
    }

     // --- Main Enhanced UI ---
     return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
          {/* Container with padding */}
          <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">

              {/* Header Area */}
              <div className={`flex-shrink-0 mb-6 ${selectedVideoDetails ? 'flex justify-end' : 'block'}`}>
                  {/* Show title/controls only when list is visible */}
                  {!selectedVideoDetails && (
                      <>
                          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5">Video Management</h1>
                          {/* Top Controls - Enhanced Layout */}
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 bg-white rounded-lg shadow border border-gray-200">
                              {/* Left Controls (Bulk Actions/Filter) */}
                              <div className="flex flex-wrap items-center gap-3">
                                  {/* Delete Button */}
                                  <button
                                      onClick={handleBulkDelete}
                                      disabled={selectedVideos.length === 0 || deleting}
                                      className={`flex items-center text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm ${
                                          selectedVideos.length > 0 && !deleting
                                              ? 'bg-red-600 hover:bg-red-700'
                                              : 'bg-red-300 cursor-not-allowed'
                                      }`}
                                  >
                                      <FiTrash2 size={16} className="mr-1.5" />
                                      {deleting ? 'Deleting...' : `Delete (${selectedVideos.length})`}
                                  </button>

                                  {/* Select All Checkbox */}
                                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                                      <input
                                          type="checkbox"
                                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
                                          checked={selectedVideos.length === displayedVideoIds.length && displayedVideoIds.length > 0}
                                          onChange={() => toggleSelectAll(displayedVideoIds)}
                                          disabled={displayedVideos.length === 0}
                                      />
                                      <span className="text-sm font-medium text-gray-700">Select All (Page)</span> {/* Updated label */}
                                  </label>

                                  {/* Filter Button */}
                                  <button
                                      onClick={() => setShowNAOnly(!showNAOnly)}
                                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm border ${
                                          showNAOnly
                                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                      }`}
                                  >
                                      <FiFilter size={16} className={`mr-1.5 ${showNAOnly ? 'text-blue-600' : 'text-gray-500'}`}/>
                                      {showNAOnly ? "Showing NA Transcripts" : "Filter NA Transcripts"}
                                  </button>
                                   {showNAOnly && (
                                      <button onClick={() => setShowNAOnly(false)} className="text-xs text-gray-500 hover:text-red-600 ml-1">(Clear)</button>
                                   )}
                              </div>

                              {/* Right Controls (Reload) */}
                              <div className="flex justify-end mt-3 md:mt-0">
                                  <button
                                      onClick={() => fetchVideos(currentPage)} // Fetch current page on reload
                                      disabled={loading || deleting}
                                      className="flex items-center bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                      {/* Show subtle spinner only when loading subsequent pages/reloading */}
                                      <FiRefreshCw size={16} className={`mr-1.5 ${loading && videos.length > 0 ? "animate-spin" : ""}`} />
                                      Reload List
                                  </button>
                              </div>
                          </div>
                      </>
                  )}

                  {/* Back Button */}
                  {selectedVideoDetails && (
                      <button
                          onClick={() => setSelectedVideoDetails(null)}
                          className="flex items-center bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                          </svg>
                          Back to List
                      </button>
                  )}
              </div>


              {/* Conditional Rendering: Details or List */}
              {selectedVideoDetails ? (
                  // --- Details View ---
                  <div className="flex-grow overflow-y-auto bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                      <Suspense fallback={
                          <div className="flex justify-center items-center h-64">
                              <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
                          </div>
                      }>
                          <VideoDetails data={selectedVideoDetails} />
                      </Suspense>
                  </div>
              ) : (
                   // --- List View Wrapper --- includes List and Pagination ---
                  <div className="flex flex-col flex-grow overflow-hidden"> {/* Allow inner scroll */}

                      {/* --- List View Grid Area --- */}
                      {/* Add relative positioning for the subtle loader */}
                      <div className="relative flex-grow overflow-y-auto -mx-2 sm:-mx-3 mb-4">
                          {/* Subtle loading overlay */}
                          {loading && videos.length > 0 && (
                              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-20 rounded-lg">
                                   <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
                              </div>
                          )}
                          {displayedVideos.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 px-2 sm:px-3">
                                  {displayedVideos.map((video) => (
                                      // Enhanced Card - Restored Classes
                                      <div key={video._id} className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col overflow-hidden min-h-[380px]"> {/* Adjusted min-height */}
                                          {/* Checkbox - Restored Classes */}
                                          <div className="absolute top-3 left-3 z-10">
                                              <label className="block bg-white/70 backdrop-blur-sm p-1 rounded-sm shadow cursor-pointer">
                                                  <input
                                                      type="checkbox"
                                                      className="h-4 w-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
                                                      checked={selectedVideos.includes(video._id)}
                                                      onChange={() => toggleVideoSelection(video._id)}
                                                  />
                                              </label>
                                          </div>
                                          {/* Menu Button - Restored Classes */}
                                          <div className="absolute top-3 right-3 z-10">
                                              <button onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)} className="p-1.5 rounded-full bg-white/70 backdrop-blur-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 shadow transition-colors">
                                                  <FiMoreVertical size={18}/>
                                              </button>
                                              {/* Menu Dropdown - Restored Classes */}
                                              {menuOpen === video._id && (
                                                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-xl rounded-md py-1 z-20">
                                                      <button onClick={() => handleDelete(video._id)} disabled={deleting} className="flex items-center w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors">
                                                          <FiTrash2 size={14} className="mr-2"/> Delete Video
                                                      </button>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Thumbnail Area - Restored Classes */}
                                          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden relative">
                                              <img
                                                  src={video.thumbnailUrl || PLACEHOLDER_THUMBNAIL}
                                                  alt={video.title || 'Video thumbnail'}
                                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                  loading="lazy"
                                              />
                                              {/* Play Icon Overlay */}
                                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity duration-300">
                                                  <FiVideo size={32} className="text-white opacity-0 group-hover:opacity-80 transform scale-75 group-hover:scale-100 transition-all duration-300"/>
                                              </div>
                                          </a>

                                          {/* Content Area - Restored Classes */}
                                          <div className="p-4 flex flex-col flex-grow">
                                              <h2 className="font-semibold text-gray-800 text-base mb-1 leading-tight line-clamp-2 h-12" title={video.title}>
                                                  {video.title || "Untitled Video"}
                                              </h2>
                                              <p className="text-xs text-gray-500 mb-3">
                                                  Duration: {video.duration || "N/A"}
                                              </p>
                                              {/* Status Indicators - Restored Classes */}
                                              <div className="space-y-1.5 text-xs mb-4 flex-grow">
                                                  <p className="flex items-center">
                                                      <span className={`w-2 h-2 rounded-full mr-1.5 ${isAvailable(video.transcript?.english) || isAvailable(video.transcript?.original) ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                                                      <span className="font-medium text-gray-600 w-20 shrink-0">Transcript:</span>
                                                      <span className="text-gray-800">{isAvailable(video.transcript?.english) || isAvailable(video.transcript?.original) ? "Available" : "Not Available"}</span>
                                                  </p>
                                                  <p className="flex items-center">
                                                      <span className={`w-2 h-2 rounded-full mr-1.5 ${isAvailable(video.summary?.english) || isAvailable(video.summary?.original) ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                                                      <span className="font-medium text-gray-600 w-20 shrink-0">Summary:</span>
                                                      <span className="text-gray-800">{isAvailable(video.summary?.english) || isAvailable(video.summary?.original) ? "Available" : "Not Available"}</span>
                                                  </p>
                                              </div>

                                              {/* Details Button - Restored Classes */}
                                              <div className="mt-auto">
                                                  <button
                                                      onClick={() => setSelectedVideoDetails(video)}
                                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150 flex items-center justify-center shadow-sm"
                                                  >
                                                      <FiEye size={16} className="mr-1.5"/> View Details
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                               // --- Enhanced No Videos Message --- Restored Classes
                              <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-lg shadow border border-gray-200 mt-4"> {/* Added mt-4 for spacing */}
                                   <FiVideo size={48} className="text-gray-400 mb-4"/>
                                   <h3 className="text-xl font-semibold text-gray-700 mb-2">No Videos Found</h3>
                                   <p className="text-gray-500 max-w-sm">
                                       {showNAOnly
                                           ? "There are no videos with 'Not Available' transcripts matching the current filter."
                                           : "Your video library is currently empty or no videos match the filter."}
                                   </p>
                                   {showNAOnly && (
                                       <button onClick={() => setShowNAOnly(false)} className="mt-4 text-sm text-blue-600 hover:underline">
                                           Show All Videos
                                       </button>
                                   )}
                               </div>
                          )}
                      </div>

                      {/* --- Pagination Controls --- Restored Classes */}
                      { totalDocs > 0 && totalPages > 1 && (
                          <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-gray-200 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-2 rounded-b-lg"> {/* Adjusted background/padding/rounding */}
                               <span className="text-sm text-gray-600">
                                   Page <span className="font-medium text-gray-900">{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span> ({totalDocs} videos)
                               </span>
                              <div className="flex items-center gap-2">
                                  <button
                                      onClick={handlePrevPage}
                                      disabled={!hasPrevPage || loading}
                                      className="flex items-center justify-center p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      aria-label="Previous Page"
                                  >
                                      <FiChevronLeft size={20} />
                                  </button>
                                  <button
                                      onClick={handleNextPage}
                                      disabled={!hasNextPage || loading}
                                      className="flex items-center justify-center p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      aria-label="Next Page"
                                  >
                                      <FiChevronRight size={20} />
                                  </button>
                              </div>
                          </div>
                      )}
                  </div> // End List View Wrapper
              )} {/* End Conditional Rendering */}
          </div> {/* End Container */}
      </div> // End Main Div
  );
    // --- Main Enhanced UI ---
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
                {/* Header Area (Unchanged) */}
                <div className={`flex-shrink-0 mb-6 ${selectedVideoDetails ? 'flex justify-end' : 'block'}`}>
                    {/* ... existing header code ... */}
                     {!selectedVideoDetails && (
                        <>
                            {/* ... Title and controls ... */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5">Video Management</h1>
                             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 bg-white rounded-lg shadow border border-gray-200">
                                {/* ... Left controls ... */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <button onClick={handleBulkDelete} disabled={selectedVideos.length === 0 || deleting} className={`...`}> <FiTrash2 size={16} className="mr-1.5" /> {deleting ? 'Deleting...' : `Delete (${selectedVideos.length})`} </button>
                                    <label className="flex items-center gap-2 cursor-pointer ..."> <input type="checkbox" className="..." checked={selectedVideos.length === displayedVideoIds.length && displayedVideoIds.length > 0} onChange={() => toggleSelectAll(displayedVideoIds)} disabled={displayedVideos.length === 0} /> <span className="text-sm ...">Select All (Page)</span> </label> {/* Updated label */}
                                    <button onClick={() => setShowNAOnly(!showNAOnly)} className={`...`}> <FiFilter size={16} className={`...`}/> {showNAOnly ? "Showing NA Transcripts" : "Filter NA Transcripts"} </button>
                                    {showNAOnly && ( <button onClick={() => setShowNAOnly(false)} className="..."> (Clear) </button> )}
                                 </div>
                                {/* ... Right controls ... */}
                                <div className="flex justify-end mt-3 md:mt-0">
                                     <button onClick={() => fetchVideos(currentPage)} disabled={loading || deleting} className="..."> <FiRefreshCw size={16} className={`mr-1.5 ${loading && videos.length > 0 ? "animate-spin" : ""}`} /> Reload List </button> {/* Subtle loader on reload */}
                                 </div>
                            </div>
                        </>
                    )}
                    {selectedVideoDetails && ( <button onClick={() => setSelectedVideoDetails(null)} className="..."> {'< Back to List'} </button> )}
                </div>

                {/* Conditional Rendering: Details or List */}
                {selectedVideoDetails ? (
                    <div className="flex-grow overflow-y-auto ..."> {/* Details View (Unchanged) */}
                        <Suspense > <VideoDetails data={selectedVideoDetails} /> </Suspense>
                    </div>
                ) : (
                     // --- List View Wrapper --- includes List and Pagination ---
                    <div className="flex flex-col flex-grow overflow-hidden"> {/* Allow inner scroll */}

                        {/* --- List View Grid Area --- */}
                        <div className="flex-grow overflow-y-auto -mx-2 sm:-mx-3 mb-4"> {/* Scrollable grid */}
                            {loading && videos.length > 0 && ( /* Show subtle loading overlay when changing pages */
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center z-20">
                                     <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
                                </div>
                            )}
                            {displayedVideos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 px-2 sm:px-3">
                                    {displayedVideos.map((video) => (
                                        <div key={video._id} className="group relative ..."> {/* Video Card (Unchanged) */}
                                            {/* ... card content ... */}
                                             {/* Checkbox */}
                                             <div className="absolute top-3 left-3 z-10"> <label className="..."> <input type="checkbox" className="..." checked={selectedVideos.includes(video._id)} onChange={() => toggleVideoSelection(video._id)} /> </label> </div>
                                             {/* Menu */}
                                             <div className="absolute top-3 right-3 z-10"> <button onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)} className="..."> <FiMoreVertical size={18}/> </button> {menuOpen === video._id && ( <div className="..."> <button onClick={() => handleDelete(video._id)} disabled={deleting} className="..."> <FiTrash2 size={14} className="mr-2"/> Delete Video </button> </div> )} </div>
                                             {/* Thumbnail */}
                                             <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="..."> <img src={video.thumbnailUrl || PLACEHOLDER_THUMBNAIL} alt={video.title || 'Video thumbnail'} className="..." loading="lazy" /> <div className="..."> <FiVideo size={32} className="..."/> </div> </a>
                                             {/* Content */}
                                             <div className="p-4 flex flex-col flex-grow"> <h2 className="..." title={video.title}> {video.title || "Untitled Video"} </h2> <p className="..."> Duration: {video.duration || "N/A"} </p> <div className="..."> {/* Status Indicators */} </div> <div className="mt-auto"> <button onClick={() => setSelectedVideoDetails(video)} className="..."> <FiEye size={16} className="mr-1.5"/> View Details </button> </div> </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                 <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-lg shadow border border-gray-200"> {/* No Videos Message (Unchanged) */}
                                     <FiVideo size={48} className="text-gray-400 mb-4"/> <h3 className="text-xl font-semibold text-gray-700 mb-2">No Videos Found</h3> <p className="..."> {showNAOnly ? "..." : "..."} </p> {showNAOnly && ( <button onClick={() => setShowNAOnly(false)} className="..."> Show All Videos </button> )}
                                 </div>
                            )}
                        </div>

                        {/* --- Pagination Controls --- */}
                        { totalDocs > 0 && totalPages > 1 && ( // Only show pagination if there's more than one page
                            <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-gray-200 bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-2">
                                 <span className="text-sm text-gray-600">
                                     Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> ({totalDocs} videos)
                                 </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={!hasPrevPage || loading}
                                        className="flex items-center justify-center p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Previous Page"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={!hasNextPage || loading}
                                        className="flex items-center justify-center p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Next Page"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div> // End List View Wrapper
                )} {/* End Conditional Rendering */}
            </div> {/* End Container */}
        </div> // End Main Div
    );
};

export default VideoList;









// import React, { useEffect, useState, lazy, Suspense } from "react";
// import videoService from "../AserverAuth/config"; // Adjust path if needed
// import { FiMoreVertical, FiRefreshCw, FiTrash2, FiEye, FiFilter, FiXCircle, FiCheckSquare, FiSquare, FiVideo } from "react-icons/fi"; // Added more icons
// import { ImSpinner8 } from "react-icons/im"; // Loading spinner

// // Lazy load the VideoDetails component
// const VideoDetails = lazy(() => import("./VideoDetails")); // Adjust path if needed

// // Placeholder for thumbnails if needed
// const PLACEHOLDER_THUMBNAIL = 'https://via.placeholder.com/320x180.png?text=Video';

// const VideoList = () => {
//     // --- State declarations (keep as they are) ---
//     const [videos, setVideos] = useState([]);
//     const [menuOpen, setMenuOpen] = useState(null);
//     const [selectedVideos, setSelectedVideos] = useState([]);
//     const [loading, setLoading] = useState(true); // Start true for initial load
//     const [deleting, setDeleting] = useState(false);
//     const [showNAOnly, setShowNAOnly] = useState(false);
//     const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);
//     const [error, setError] = useState(null);

//     // --- Helper Functions (fetchVideos, handleDelete, handleBulkDelete, etc. - keep as they are) ---
//     const fetchVideos = async (showLoader = true) => {
//         if (showLoader) setLoading(true);
//         setError(null);
//         try {
//             const response = await videoService.getAllVideos();
//             console.log("done with fetching all videos")
//             if (response?.data && Array.isArray(response.data)) {
//                 setVideos(response.data);
//             } else {
//                  console.warn("Received unexpected data format:", response);
//                  setVideos([]);
//                  throw new Error("Received invalid data format from server.");
//             }
//         } catch (err) {
//             console.error("Error fetching videos:", err);
//             setError(err.message || "Failed to fetch videos. Please try again.");
//         } finally {
//             if (showLoader) setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchVideos();
//     }, []);

//     const handleDelete = async (videoId) => {
//         if (window.confirm("Are you sure you want to permanently delete this video and its data?")) {
//             setDeleting(true);
//             try {
//                 await videoService.deleteVideo(videoId);
//                 setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
//                 setMenuOpen(null);
//             } catch (err) {
//                 console.error("Error deleting video:", err);
//                 alert("Failed to delete video: " + (err.message || "Unknown error"));
//             } finally {
//                 setDeleting(false);
//             }
//         }
//     };

//     const handleBulkDelete = async () => {
//         if (selectedVideos.length === 0) return;
//         if (window.confirm(`Are you sure you want to permanently delete ${selectedVideos.length} selected video(s)?`)) {
//             setDeleting(true);
//             try {
//                 await videoService.deleteVideos(selectedVideos);
//                 setVideos((prevVideos) => prevVideos.filter((video) => !selectedVideos.includes(video._id)));
//                 setSelectedVideos([]);
//             } catch (err) {
//                 console.error("Error deleting videos:", err);
//                 alert("Failed to delete videos: " + (err.message || "Unknown error"));
//             } finally {
//                 setDeleting(false);
//             }
//         }
//     };

//     const toggleVideoSelection = (videoId) => {
//         setSelectedVideos((prevSelected) =>
//             prevSelected.includes(videoId)
//                 ? prevSelected.filter((id) => id !== videoId)
//                 : [...prevSelected, videoId]
//         );
//     };

//     const toggleSelectAll = (displayedVideoIds) => {
//         if (selectedVideos.length === displayedVideoIds.length && displayedVideoIds.length > 0) {
//             setSelectedVideos([]);
//         } else {
//             setSelectedVideos(displayedVideoIds);
//         }
//     };

//     const isAvailable = (data) => {
//         if (data === null || typeof data === 'undefined') return false;
//         if (typeof data === "string") return data.trim() !== "" && data.trim().toUpperCase() !== "NA";
//         if (Array.isArray(data)) return data.length > 0;
//         if (typeof data === "object") return Object.keys(data).length > 0;
//         if (typeof data === 'number') return true;
//         if (typeof data === 'boolean') return true;
//         return false;
//     };

//     const getDisplayedVideos = () => {
//         const filtered = showNAOnly
//             ? videos.filter(
//                 (video) => !isAvailable(video.transcript?.english) && !isAvailable(video.transcript?.original)
//             )
//             : videos;
//         return filtered;
//     };

//     const displayedVideos = getDisplayedVideos();
//     const displayedVideoIds = displayedVideos.map((v) => v._id);

//     // --- Loading State ---
//     if (loading) {
//         return (
//             <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50 text-center">
//                 <ImSpinner8 className="animate-spin text-5xl text-blue-600 mb-4" />
//                 <p className="text-lg text-gray-700">Loading Video Library...</p>
//             </div>
//         );
//     }

//     // --- Error State ---
//      if (error && !loading) {
//         return (
//              <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-red-50 text-center">
//                  <FiXCircle className="text-5xl text-red-500 mb-4"/>
//                  <p className="text-xl font-semibold text-red-700 mb-2">Error Loading Videos</p>
//                  <p className="text-gray-700 mb-6 max-w-md">{error}</p>
//                  <button
//                      onClick={() => fetchVideos()}
//                      className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
//                  >
//                      <FiRefreshCw className="mr-2" />
//                      Retry Loading
//                  </button>
//              </div>
//          );
//      }

//     // --- Main Enhanced UI ---
    
//     return (
//         <div className="min-h-screen bg-gray-100 flex flex-col">
//             {/* Container with padding */}
//             <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">

//                 {/* Header Area */}
//                 <div className={`flex-shrink-0 mb-6 ${selectedVideoDetails ? 'flex justify-end' : 'block'}`}>
//                     {/* Show title/controls only when list is visible */}
//                     {!selectedVideoDetails && (
//                         <>
//                             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5">Video Management</h1>
//                             {/* Top Controls - Enhanced Layout */}
//                             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 bg-white rounded-lg shadow border border-gray-200">
//                                 {/* Left Controls (Bulk Actions/Filter) */}
//                                 <div className="flex flex-wrap items-center gap-3">
//                                     <button
//                                         onClick={handleBulkDelete}
//                                         disabled={selectedVideos.length === 0 || deleting}
//                                         className={`flex items-center text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm ${
//                                             selectedVideos.length > 0 && !deleting
//                                                 ? 'bg-red-600 hover:bg-red-700'
//                                                 : 'bg-red-300 cursor-not-allowed'
//                                         }`}
//                                     >
//                                         <FiTrash2 size={16} className="mr-1.5" />
//                                         {deleting ? 'Deleting...' : `Delete (${selectedVideos.length})`}
//                                     </button>

//                                     {/* Select All Checkbox */}
//                                     <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
//                                         <input
//                                             type="checkbox"
//                                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
//                                             checked={selectedVideos.length === displayedVideoIds.length && displayedVideoIds.length > 0}
//                                             onChange={() => toggleSelectAll(displayedVideoIds)}
//                                             disabled={displayedVideos.length === 0}
//                                         />
//                                         <span className="text-sm font-medium text-gray-700">Select All</span>
//                                     </label>

//                                     {/* Filter Button */}
//                                     <button
//                                         onClick={() => setShowNAOnly(!showNAOnly)}
//                                         className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm border ${
//                                             showNAOnly
//                                                 ? 'bg-blue-100 text-blue-700 border-blue-300'
//                                                 : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                                         }`}
//                                     >
//                                         <FiFilter size={16} className={`mr-1.5 ${showNAOnly ? 'text-blue-600' : 'text-gray-500'}`}/>
//                                         {showNAOnly ? "Showing NA Transcripts" : "Filter NA Transcripts"}
//                                     </button>
//                                      {showNAOnly && (
//                                         <button onClick={() => setShowNAOnly(false)} className="text-xs text-gray-500 hover:text-red-600 ml-1">(Clear)</button>
//                                      )}
//                                 </div>

//                                 {/* Right Controls (Reload) */}
//                                 <div className="flex justify-end mt-3 md:mt-0">
//                                     <button
//                                         onClick={() => fetchVideos()}
//                                         disabled={loading || deleting}
//                                         className="flex items-center bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
//                                     >
//                                         <FiRefreshCw size={16} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} />
//                                         Reload List
//                                     </button>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {/* Back Button */}
//                     {selectedVideoDetails && (
//                         <button
//                             onClick={() => setSelectedVideoDetails(null)}
//                             className="flex items-center bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
//                             </svg>
//                             Back to List
//                         </button>
//                     )}
//                 </div>


//                 {/* Conditional Rendering: Details or List */}
//                 {selectedVideoDetails ? (
//                     // --- Details View ---
//                     <div className="flex-grow overflow-y-auto bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
//                         <Suspense fallback={
//                             <div className="flex justify-center items-center h-64">
//                                 <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
//                             </div>
//                         }>
//                             <VideoDetails data={selectedVideoDetails} />
//                         </Suspense>
//                     </div>
//                 ) : (
//                     // --- List View ---
//                     // Use flex-grow to make this area expand and scroll
//                     <div className="flex-grow overflow-y-auto -mx-2 sm:-mx-3"> {/* Negative margin to counteract card padding */}
//                         {displayedVideos.length > 0 ? (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 px-2 sm:px-3"> {/* Added padding to counter negative margin */}
//                                 {displayedVideos.map((video) => (
//                                     // Enhanced Card
//                                     <div key={video._id} className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col overflow-hidden">
//                                         {/* Checkbox - Improved styling */}
//                                         <div className="absolute top-3 left-3 z-10">
//                                             <label className="block bg-white/70 backdrop-blur-sm p-1 rounded-sm shadow cursor-pointer">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="h-4 w-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
//                                                     checked={selectedVideos.includes(video._id)}
//                                                     onChange={() => toggleVideoSelection(video._id)}
//                                                 />
//                                             </label>
//                                         </div>
//                                         {/* Menu Button - Improved styling */}
//                                         <div className="absolute top-3 right-3 z-10">
//                                             <button onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)} className="p-1.5 rounded-full bg-white/70 backdrop-blur-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 shadow transition-colors">
//                                                 <FiMoreVertical size={18}/>
//                                             </button>
//                                             {/* Menu Dropdown - Enhanced styling */}
//                                             {menuOpen === video._id && (
//                                                 <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-xl rounded-md py-1 z-20">
//                                                     <button onClick={() => handleDelete(video._id)} disabled={deleting} className="flex items-center w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors">
//                                                         <FiTrash2 size={14} className="mr-2"/> Delete Video
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Thumbnail Area */}
//                                         <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden relative">
//                                              <img
//                                                  src={video.thumbnailUrl || PLACEHOLDER_THUMBNAIL}
//                                                  alt={video.title || 'Video thumbnail'}
//                                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                                                  loading="lazy"
//                                              />
//                                              {/* Play Icon Overlay (Optional) */}
//                                               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity duration-300">
//                                                   <FiVideo size={32} className="text-white opacity-0 group-hover:opacity-80 transform scale-75 group-hover:scale-100 transition-all duration-300"/>
//                                               </div>
//                                          </a>

//                                         {/* Content Area */}
//                                         <div className="p-4 flex flex-col flex-grow">
//                                             <h2 className="font-semibold text-gray-800 text-base mb-1 leading-tight line-clamp-2 h-12" title={video.title}>
//                                                 {video.title || "Untitled Video"}
//                                             </h2>
//                                             <p className="text-xs text-gray-500 mb-3">
//                                                 Duration: {video.duration || "N/A"}
//                                             </p>
//                                             {/* Status Indicators */}
//                                             <div className="space-y-1.5 text-xs mb-4 flex-grow">
//                                                 <p className="flex items-center">
//                                                     <span className={`w-2 h-2 rounded-full mr-1.5 ${isAvailable(video.transcript?.english) || isAvailable(video.transcript?.original) ? 'bg-green-500' : 'bg-orange-400'}`}></span>
//                                                     <span className="font-medium text-gray-600 w-20 shrink-0">Transcript:</span>
//                                                     <span className="text-gray-800">{isAvailable(video.transcript?.english) || isAvailable(video.transcript?.original) ? "Available" : "Not Available"}</span>
//                                                 </p>
//                                                 <p className="flex items-center">
//                                                      <span className={`w-2 h-2 rounded-full mr-1.5 ${isAvailable(video.summary?.english) || isAvailable(video.summary?.original) ? 'bg-green-500' : 'bg-orange-400'}`}></span>
//                                                      <span className="font-medium text-gray-600 w-20 shrink-0">Summary:</span>
//                                                      <span className="text-gray-800">{isAvailable(video.summary?.english) || isAvailable(video.summary?.original) ? "Available" : "Not Available"}</span>
//                                                  </p>
//                                             </div>

//                                             {/* Details Button */}
//                                             <div className="mt-auto">
//                                                 <button
//                                                     onClick={() => setSelectedVideoDetails(video)}
//                                                     className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150 flex items-center justify-center shadow-sm"
//                                                 >
//                                                     <FiEye size={16} className="mr-1.5"/> View Details
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             // --- Enhanced No Videos Message ---
//                             <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-lg shadow border border-gray-200">
//                                  <FiVideo size={48} className="text-gray-400 mb-4"/>
//                                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Videos Found</h3>
//                                  <p className="text-gray-500 max-w-sm">
//                                      {showNAOnly
//                                          ? "There are no videos with 'Not Available' transcripts matching the current filter."
//                                          : "Your video library is currently empty or no videos match the filter."}
//                                  </p>
//                                  {showNAOnly && (
//                                      <button onClick={() => setShowNAOnly(false)} className="mt-4 text-sm text-blue-600 hover:underline">
//                                          Show All Videos
//                                      </button>
//                                  )}
//                              </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default VideoList;
