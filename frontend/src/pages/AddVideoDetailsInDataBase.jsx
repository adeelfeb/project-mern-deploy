import React, { useState } from "react";
import ApiService from "../AserverAuth/ApiService";
import ToastNotification from "../components/toastNotification/ToastNotification";

const apiService = ApiService;



function AddVideoDetailsInDataBase() {
  const [videoDetails, setVideoDetails] = useState({
    id: "",
    title: "",
    thumbnailUrl: "",
    duration: "",
  });

  const [jsonInput, setJsonInput] = useState(""); // JSON input state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Handle individual input changes
  const handleChange = (e) => {
    setVideoDetails({ ...videoDetails, [e.target.name]: e.target.value });
  };

  // Handle JSON input change
  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  // Parse JSON and update state
  const handleJsonParse = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setVideoDetails(parsedData);
      setToast({ message: "✅ JSON parsed successfully!", type: "success" });
    } catch (error) {
      setToast({ message: "❌ Invalid JSON format!", type: "error" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: "", type: "" });

    try {
      await apiService.addVideoDetails(
        videoDetails.id,
        videoDetails.title,
        videoDetails.thumbnailUrl,
        videoDetails.duration
      );

      setToast({ message: "✅ Video added successfully!", type: "success" });
      setVideoDetails({ id: "", title: "", thumbnailUrl: "", duration: "" });
      setJsonInput("");
    } catch (error) {
      setToast({ message: "❌ Failed to add video. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Add Video Details</h2>

        {/* Toast Notification */}
        {toast.message && <ToastNotification message={toast.message} type={toast.type} />}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">Video ID</label>
            <input
              type="text"
              name="id"
              placeholder="Enter Video ID"
              value={videoDetails.id}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              value={videoDetails.title}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnailUrl"
              placeholder="Enter Thumbnail URL"
              value={videoDetails.thumbnailUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="Enter Duration"
              value={videoDetails.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* JSON Input */}
          <div>
            <label className="block text-gray-700 font-medium">JSON Input</label>
            <textarea
              rows="4"
              placeholder={`{
  "id": "67b3093e0829fa6bc8e45c52",
  "title": "Sample Title",
  "duration": "2:30",
  "thumbnailUrl": "https://example.com/image.png"
}`}
              value={jsonInput}
              onChange={handleJsonChange}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300 font-mono"
            />
            <button
              type="button"
              onClick={handleJsonParse}
              className="mt-2 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              Parse JSON
            </button>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Video"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVideoDetailsInDataBase;
