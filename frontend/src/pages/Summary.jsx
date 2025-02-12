import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md"; // Import the copy icon
import ToastNotification from "../components/toastNotification/ToastNotification";

const Summary = (data) => {
  const { english, original } = data.data;

  const [selectedLanguage, setSelectedLanguage] = useState("english"); // State to toggle language
  const [toastMessage, setToastMessage] = useState(""); // State to manage toast message visibility
  const summaryText = selectedLanguage === "english" ? english : original;
  const [isSuccess, setIsSuccess] = useState(true);

  const handleCopy = () => {
    if (summaryText.trim() === "NA") {
      setToastMessage("No summary available to copy!"); // Show error message if no summary available
      setIsSuccess(false);
    } else {
      navigator.clipboard.writeText(summaryText);
      setToastMessage(`Summary Copied to clipboard`); // Show the toast message when copied
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-w-[250px] max-w-[80vw] mx-auto flex flex-col h-screen">
      {/* Fixed Heading and Buttons */}
      <div className="flex justify-between items-center mb-4 p-4 bg-white shadow-md">
        <div className="flex gap-4">
          <button
            className={`p-2 px-4 rounded ${
              selectedLanguage === "english" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"
            }`}
            onClick={() => setSelectedLanguage("english")}
          >
            English
          </button>
          <button
            className={`p-2 px-4 rounded ${
              selectedLanguage === "original" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"
            }`}
            onClick={() => setSelectedLanguage("original")}
          >
            Original
          </button>
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
          onClick={handleCopy}
        >
          <MdContentCopy size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md border shadow-inner">
        <p>
          <strong>{selectedLanguage === "english" ? "English" : "Original"} Summary:</strong>
        </p>
        <p>{summaryText || "Not yet provided"}</p>
      </div>

      {/* ToastNotification for feedback */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          duration={3000} // Duration for the toast to show
          onClose={() => setToastMessage("")} // Reset toast message on close
          position="right"
          isSuccess={isSuccess}
        />
      )}
    </div>
  );
};

export default Summary;