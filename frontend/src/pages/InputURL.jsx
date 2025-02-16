import React, { useState, Suspense } from "react"; // Import Suspense
import { useDispatch, useSelector } from "react-redux";
import { setVideoData, clearVideoData } from "../store/currentVideoSlice"; // Redux actions
import videoService from "../AserverAuth/config";
import { TypeAnimation } from "react-type-animation"; // Import TypeAnimation

// Lazy load the VideoDetails component
const VideoDetails = React.lazy(() => import("./VideoDetails"));

const InputURL = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const videoData = useSelector((state) => state.currentVideo.videoData); // Access Redux store

  const handleSubmit = async (e) => {
    e.preventDefault();

    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      setError("Please enter a valid YouTube video URL.");
      dispatch(clearVideoData()); // Reset video data in Redux
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await videoService.addVideo(url);

      if (response.statusCode === 201 || 200) {
        // console.log("The Video data is:", response.data);
        dispatch(setVideoData(response.data)); // Update Redux store with success response
      } else {
        setError(response.message); // Display error message
        dispatch(clearVideoData()); // Clear Redux state on error
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
      dispatch(clearVideoData()); // Clear Redux state on error
    } finally {
      setIsLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <form
        className="flex flex-col sm:flex-row gap-2 mb-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
  
      {error && <p className="text-red-500 mb-2 animate-fade-in text-sm">{error}</p>}
  
      <div className="relative">
        {/* Overlay loader */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded-lg">
            <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
  
        {videoData ? (
          <Suspense fallback={<div>Loading Video Details...</div>}>
            <VideoDetails data={videoData} />
          </Suspense>
        ) : (
          <div className="text-gray-500 text-center p-3 bg-white rounded-lg shadow-sm text-sm sm:text-base">
            <TypeAnimation
              sequence={[
                "Enter a Valid URL to see details with duration limit",
                1000,
                "Paste your YouTube video link above",
                1000,
              ]}
              speed={50}
              repeat={Infinity}
              cursor={true}
              style={{ fontSize: "1rem", display: "inline-block" }}
            />
          </div>
        )}
      </div>
    </div>
  );
  
  

};

export default InputURL;

