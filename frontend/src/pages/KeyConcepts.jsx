import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { MdContentCopy } from "react-icons/md"; // Import copy icon
import ToastNotification from "../components/toastNotification/ToastNotification";

function KeyConcepts({ data }) {
  const [keyConcepts, setKeyConcepts] = useState(null);
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [isSuccess, setIsSuccess] = useState(true);
  const [error, setError] = useState(false); // State to track if the format is invalid

  useEffect(() => {
    if (
      !data?.keyconcept ||
      typeof data.keyconcept !== "object" ||
      (!data.keyconcept.primary)
    ) {
      console.error("Invalid or empty KeyConcepts format:", data);
      setError(true);
      return;
    }

    setKeyConcepts(data.keyconcept);
    setError(false);
  }, [data]);

  const copyToClipboard = () => {
    if (!keyConcepts) {
      setToastMessage("No key concept available to copy!");
      setIsSuccess(false);
    } else {
      navigator.clipboard
        .writeText(JSON.stringify(keyConcepts, null, 2))
        .then(() => {
          setToastMessage("Key Concepts copied to clipboard!");
          setIsSuccess(true);
        })
        .catch(() => {
          setToastMessage("Failed to copy key concepts");
          setIsSuccess(false);
        });
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">Invalid or missing key concepts. Please check the backend response.</p>
      </div>
    );
  }

  if (!keyConcepts) {
    return <p>Loading key concepts...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-full mx-auto">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Key Concepts</h2>

      {/* Copy Button */}
      <button
        onClick={copyToClipboard}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center"
        title="Copy to Clipboard"
      >
        <MdContentCopy size={20} />
      </button>

      {/* Primary Concept (Markdown Rendered) */}
      {keyConcepts.primary && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700">Key Concepts:</h3>
          <ReactMarkdown className="text-gray-600">{keyConcepts.primary}</ReactMarkdown>
        </div>
      )}

      

      {/* Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          duration={3000}
          onClose={() => setToastMessage("")}
          position="right"
          isSuccess={isSuccess}
        />
      )}
    </div>
  );
}

export default KeyConcepts;
