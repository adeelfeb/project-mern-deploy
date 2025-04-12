import React, { useState, useEffect, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideoData, clearVideoData } from "../store/currentVideoSlice";
import videoService from "../AserverAuth/config"; // Assuming this service handles API calls and returns { statusCode, message, data }
import { TypeAnimation } from "react-type-animation";

// Lazy load the VideoDetails component
const VideoDetails = React.lazy(() => import("./VideoDetails"));

const InputURL = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(""); // Use a general message state
  const [messageType, setMessageType] = useState("info"); // 'info', 'error', 'success', 'warning'
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const videoData = useSelector((state) => state.currentVideo.videoData);

  // Helper to set messages
  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  // Clear message after a delay
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("info");
      }, 5000); // Clear message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages on new submission
    setMessageType("info");

    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      showMessage("Please enter a valid YouTube video URL.", "error");
      dispatch(clearVideoData());
      return;
    }

    // Clear previous video data only when starting a valid load
    dispatch(clearVideoData());
    setIsLoading(true);

    try {
      // Assuming videoService.addVideo ALWAYS returns an object like:
      // { statusCode: number, message: string, data: any | null }
      // Or throws an error for network/unexpected issues.
      const response = await videoService.addVideo(url);
      // console.log("InputURL component received response:", response);

      if (!response || typeof response.statusCode === 'undefined') {
         // Handle cases where the service might return undefined/null unexpectedly
         console.error("Invalid response structure received from videoService:", response);
         showMessage("Received an invalid response from the server.", "error");
         dispatch(clearVideoData());
         return; // Exit early
      }

      // Check for Successful status codes (200-299 range)
      if (response.statusCode >= 200 && response.statusCode < 300) {
        // Handle success (e.g., 200 OK, 201 Created)
        if (response.data) {
            dispatch(setVideoData(response.data));
            // Optionally show a success message if needed, though displaying data might be enough
            // showMessage(response.message || "Video loaded successfully.", "success");
        } else {
            // Success status but no data? Might be an issue.
            console.warn("Successful response but no video data received:", response);
            showMessage("Video processed, but no details were returned.", "warning");
            dispatch(clearVideoData());
        }
      } else {
        // Handle known error status codes (4xx, 5xx) returned by the backend
        console.error(`Server responded with status ${response.statusCode}:`, response.message);
        showMessage(response.message || `An error occurred (Status ${response.statusCode}).`, "error");
        dispatch(clearVideoData());
      }

    } catch (error) {
      // Handle network errors or errors *thrown* by videoService
      console.error("Error during video submission:", error);
      // Try to get a specific message, otherwise show a generic one
      const errorMessage = error.response?.data?.message || // Check for Axios error response message
                           error.message || // Standard error message property
                           "A network or unexpected error occurred. Please try again.";
      showMessage(errorMessage, "error");
      dispatch(clearVideoData());
    } finally {
      setIsLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    // More robust regex covering various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleClearInput = () => {
    setUrl("");
    setMessage("");
    setMessageType("info");
    dispatch(clearVideoData());
    if (inputRef.current) {
        inputRef.current.focus(); // Keep focus after clearing
    }
  };

  const handleInputClick = async () => {
     // Clear URL only if it's not already empty to avoid clearing pasted content immediately
    if (url) {
      setUrl("");
    }
    setMessage(""); // Clear message on click
    setMessageType("info");

    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText && clipboardText !== url) { // Only set if clipboard is different
        setUrl(clipboardText);
        // Optionally trigger validation or focus here if needed
        // const videoId = getYouTubeVideoId(clipboardText);
        // if (videoId && inputRef.current) {
        //   inputRef.current.focus();
        // }
      }
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
      // Optionally inform the user, e.g., showMessage("Could not read clipboard.", "warning");
    } finally {
        // Ensure focus is set regardless of clipboard success/failure
        if (inputRef.current) {
             inputRef.current.focus();
             // Select only if the input is empty after attempting paste, allowing user to type
             if (!url && !navigator.clipboard.readText) { // rough check if paste likely failed
                inputRef.current.select();
             }
        }
    }
  };

  // Determine message style based on type
  const getMessageStyle = () => {
    switch (messageType) {
      case "error":
        return "text-red-600 bg-red-100 border-red-400";
      case "success":
        return "text-green-700 bg-green-100 border-green-400";
      case "warning":
        return "text-yellow-700 bg-yellow-100 border-yellow-400";
      case "info":
      default:
        return "text-blue-700 bg-blue-100 border-blue-400";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <form
        className="flex flex-col sm:flex-row gap-2 mb-4"
        onSubmit={handleSubmit}
      >
        {/* Input field and clear button */}
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all pr-10" // Removed cursor-pointer for better text selection
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onClick={handleInputClick} // Keep onClick for paste functionality
            placeholder="Paste YouTube URL here"
            aria-label="YouTube video URL"
          />
          {url && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-500 focus:outline-none transition-colors"
              aria-label="Clear input"
            >
              {/* X icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {/* Submit button */}
        <button
          type="submit"
          className={`bg-green-500 text-white p-2 px-4 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
             <div className="flex items-center justify-center space-x-2">
                 <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                 <span>Loading...</span>
             </div>
          ) : "Submit"}
        </button>
      </form>

      {/* Message Display Area */}
      {message && (
        <div className={`p-2 mb-4 border rounded-lg text-sm animate-fade-in ${getMessageStyle()}`} role="alert">
          {message}
        </div>
      )}

      {/* Video Details or Placeholder */}
      <div className="relative min-h-[50px]"> {/* Added min-height */}
        {isLoading && !videoData && ( // Show spinner only when loading AND no data is currently shown
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded-lg">
            <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {videoData ? (
          <Suspense fallback={<div className="text-center p-4">Loading Video Details...</div>}>
            <VideoDetails data={videoData} />
          </Suspense>
        ) : (
          // Show placeholder only if not loading and no data
          !isLoading && !videoData && (
            <div className="text-gray-500 text-center p-3 bg-white rounded-lg shadow-inner text-sm sm:text-base">
               {/* Placeholder Animation */}
               <TypeAnimation
                 sequence={[
                   "Enter a Valid YouTube URL to get started.", 1500,
                   "We'll fetch the transcript, summary, and more!", 1500,
                   "Paste the link above and hit Submit.", 1500,
                   "Supports videos up to 20 minutes long.", 1500,
                 ]}
                 wrapper="span"
                 speed={60}
                 repeat={Infinity}
                 cursor={true}
                 style={{ fontSize: '0.9rem', display: 'inline-block' }}
               />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default InputURL;