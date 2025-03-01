import React, { useState } from "react";
import authService from "../AserverAuth/auth";
import { MdCloudUpload, MdCheckCircle } from "react-icons/md"; // Icons for upload and success
import { ImSpinner8 } from "react-icons/im"; // Loading spinner icon
import ToastNotification from "../components/toastNotification/ToastNotification";

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
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 p-2">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Description at the Top */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Upload Your Video
          </h1>
          <p className="text-gray-600">
            Share your video with the world. Supported formats: MP4, MOV, AVI, MKV.
          </p>
        </div>

        {/* File Input */}
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading} // Disable file input during upload
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <MdCloudUpload className="w-12 h-12 text-blue-500" />
              <p className="text-gray-700">
                {videoFile ? videoFile.name : "Choose a video file to upload"}
              </p>
              <p className="text-sm text-gray-500">
                Max file size: 100MB
              </p>
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Upload Button at the Bottom */}
      <div className="w-full max-w-md mx-auto p-4 mb-12">
        <button
          onClick={handleUpload}
          disabled={!videoFile || loading} // Disable button during upload
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <>
              <ImSpinner8 className="w-5 h-5 animate-spin" /> {/* Loading spinner */}
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <MdCloudUpload className="w-5 h-5" />
              <span>Upload Video</span>
            </>
          )}
        </button>
      </div>

        {/* Video Details */}
        {videoDetails && (
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Video Details</h3>
            <div className="space-y-2">
              {/* Video Preview */}
              <div className="w-full aspect-video rounded-lg overflow-hidden">
                <video
                  src={videoDetails.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <p>
                <span className="font-medium">Title:</span> {videoDetails.title}
              </p>
              
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {videoDetails.duration}
              </p>
              
              <p className="break-words">
                <span className="font-medium">URL:</span>{" "}
                <a
                  href={videoDetails.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {videoDetails.videoUrl}
                </a>
              </p>
            </div>
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