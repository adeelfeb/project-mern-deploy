import React, { useEffect, useState } from "react";
import videoService from "../AserverAuth/config";
import { FiMoreVertical, FiRefreshCw } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // Track which video menu is open
  const [selectedVideos, setSelectedVideos] = useState([]); // Track selected videos
  const [loading, setLoading] = useState(false); // Track loading state
  const [showNAOnly, setShowNAOnly] = useState(false); // Track whether to show only videos with transcript as "NA"

  // Fetch videos when component mounts
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await videoService.getAllVideos();
      // console.log("data of videos is:", response.data);
      if (response?.data) {
        setVideos(response.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle video deletion
  const handleDelete = async (videoId) => {
    try {
      await videoService.deleteVideo(videoId);
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
      setMenuOpen(null); // Close the menu after deleting
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    try {
      await videoService.deleteVideos(selectedVideos);
      setVideos((prevVideos) => prevVideos.filter((video) => !selectedVideos.includes(video._id)));
      setSelectedVideos([]); // Clear selection after deletion
    } catch (error) {
      console.error("Error deleting videos:", error);
    }
  };

  // Toggle video selection
  const toggleVideoSelection = (videoId) => {
    setSelectedVideos((prevSelected) =>
      prevSelected.includes(videoId)
        ? prevSelected.filter((id) => id !== videoId)
        : [...prevSelected, videoId]
    );
  };

  // Select or deselect all currently displayed videos
  const toggleSelectAll = () => {
    const displayedVideos = showNAOnly
      ? videos.filter((video) => !isAvailable(video.transcript?.english) && !isAvailable(video.transcript?.original))
      : videos;

    if (selectedVideos.length === displayedVideos.length) {
      setSelectedVideos([]); // Deselect all
    } else {
      setSelectedVideos(displayedVideos.map((video) => video._id)); // Select all
    }
  };

  // Check if a nested object or array is available
  const isAvailable = (data) => {
    if (!data) return false; // If data is null or undefined
    if (typeof data === "string" && data.trim() === "NA") return false; // If data is "NA"
    if (Array.isArray(data) && data.length === 0) return false; // If array is empty
    if (typeof data === "object" && Object.keys(data).length === 0) return false; // If object is empty
    return true; // Otherwise, data is available
  };

  // Get the list of videos to display based on the filter
  const getDisplayedVideos = () => {
    if (showNAOnly) {
      return videos.filter(
        (video) => !isAvailable(video.transcript?.english) && !isAvailable(video.transcript?.original)
      );
    }
    return videos;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Video List</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBulkDelete}
            disabled={selectedVideos.length === 0}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-red-300"
          >
            Delete Selected
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={
                selectedVideos.length === getDisplayedVideos().length && getDisplayedVideos().length > 0
              }
              onChange={toggleSelectAll}
              className="w-5 h-5 rounded-md border-2 border-gray-400 focus:ring-0 cursor-pointer"
            />
            <span className="text-sm text-gray-700">Select All</span>
          </label>
          <button
            onClick={() => setShowNAOnly(!showNAOnly)}
            className={`px-4 py-2 rounded ${
              showNAOnly ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {showNAOnly ? "Show All Videos" : "Show Videos with NA Transcript"}
          </button>
        </div>
        <button
          onClick={fetchVideos}
          disabled={loading}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Reload
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ImSpinner8 className="animate-spin text-4xl text-gray-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {getDisplayedVideos().map((video) => (
            <div key={video._id} className="relative bg-white shadow-lg rounded-lg p-3">
              {/* Checkbox for selection */}
              <input
                type="checkbox"
                checked={selectedVideos.includes(video._id)}
                onChange={() => toggleVideoSelection(video._id)}
                className="absolute top-2 left-2 w-5 h-5 rounded-md border-2 border-gray-400 focus:ring-0 cursor-pointer"
              />
              {/* Video Thumbnail (Linked to YouTube) */}
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover rounded-md" />
              </a>

              {/* Video Info */}
              <div className="mt-3">
                <h2 className="text-lg font-semibold">{video.title}</h2>
                <p className="text-sm text-gray-600">Duration: {video.duration}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Transcript:</span>{" "}
                  {isAvailable(video.transcript?.english) || isAvailable(video.transcript?.original) ? "Available" : "NA"}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Summary:</span>{" "}
                  {isAvailable(video.summary?.english) || isAvailable(video.summary?.original) ? "Available" : "NA"}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Key Concepts:</span>{" "}
                  {isAvailable(video.keyconcept?.primary) || isAvailable(video.keyconcept?.secondary) ? "Available" : "NA"}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">QnAs:</span>{" "}
                  {isAvailable(video.qnas?.mcqs) || isAvailable(video.qnas?.shortQuestions) ? "Available" : "NA"}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Score:</span>{" "}
                  {video.score ? "Available" : "NA"}
                </p>
              </div>

              {/* Three-dot Menu */}
              <div className="absolute top-2 right-2">
                <button onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)}>
                  <FiMoreVertical className="text-gray-600 hover:text-gray-800 text-xl" />
                </button>
                {menuOpen === video._id && (
                  <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-md w-24 p-2">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-red-500 w-full text-left px-2 py-1 hover:bg-red-100 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;