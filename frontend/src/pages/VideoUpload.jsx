import React, { useState } from "react";
import authService from "../AserverAuth/auth";
import { MdCloudUpload, MdCheckCircle } from "react-icons/md"; // Icons for upload and success
import { ImSpinner8 } from "react-icons/im"; // Loading spinner icon
import ToastNotification from "../components/toastNotification/ToastNotification";
import VideoDetails from "./VideoDetails";

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoDetails, setVideoDetails] = useState(null);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    setLoading(true); // Start loading
    setError("");
    setIsSuccess(false);
    setToastMessage("");

    try {
      const details = await authService.uploadVideo(videoFile); 
      setVideoDetails(details);
      setIsSuccess(true);
      setToastMessage("Video uploaded successfully!");
      // console.log("Video uploaded successfully:", details);
    } catch (err) {
      setError(err.message);
      setIsSuccess(false);
      setToastMessage("Failed to upload video. Please try again.");
      console.error("Error uploading video:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-2">
     {/* Top Section: Upload Button and Icons */}
<div className="w-full max-w-4xl mx-auto p-2">
  {/* <div className="text-center mb-4">
    <h1 className="text-3xl font-bold text-gray-800">
      Upload Your Video
    </h1>
  </div> */}

  {/* Flex Container for File Input and Upload Button */}
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
    {/* File Input */}
    <div className="w-full sm:w-auto bg-white p-4 rounded-lg shadow-md text-center">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading} // Disable file input during upload
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <MdCloudUpload className="w-8 h-8 text-blue-500" />
          <p className="text-gray-700 text-sm">
            {videoFile ? videoFile.name : "Choose a video file"}
          </p>
          <p className="text-xs text-gray-500">
            Max file size: 100MB
          </p>
        </div>
      </label>
    </div>

    {/* Upload Button */}
    <div className="w-full sm:w-auto">
      <button
        onClick={handleUpload}
        disabled={!videoFile || loading} // Disable button during upload
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? (
          <>
            <ImSpinner8 className="w-4 h-4 animate-spin" /> {/* Loading spinner */}
            <span className="text-sm">Uploading...</span>
          </>
        ) : (
          <>
            <MdCloudUpload className="w-4 h-4" />
            <span className="text-sm">Upload Video</span>
          </>
        )}
      </button>
    </div>
  </div>

  {/* Error Message */}
  {error && (
    <p className="text-red-500 text-sm text-center mt-4">{error}</p>
  )}
</div>

      {/* Bottom Section: Video Details */}
      <div className="flex-1 w-full mt-4">
        {videoDetails ? (
          <VideoDetails data={videoDetails} />
        ) : (
          <div className="text-center text-gray-500">
            No video details available. Upload a video to see details.
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4">
          <ToastNotification
            message={toastMessage}
            duration={3000}
            onClose={() => setToastMessage("")}
            position="right"
            isSuccess={isSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUpload;