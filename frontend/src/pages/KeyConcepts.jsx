import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { MdContentCopy, MdRefresh } from "react-icons/md";
import ToastNotification from "../components/toastNotification/ToastNotification";
import transcriptFetchService from "../utils/transcriptFetch.js";
import { startChatWithMessage } from "../lib/geminiHelperFunc";
import ApiService from "../AserverAuth/ApiService.js";

function KeyConcepts({ data, videoId }) {
  const [keyConcepts, setKeyConcepts] = useState(null);
  const [error, setError] = useState(false);
  const [buttonState, setButtonState] = useState("Re-Generate");
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  // console.log("the data format is like:", data);

  const regenerate = async () => {
    setButtonState("Regenerating...");
    const transcriptResult = await transcriptFetchService.fetchAndProcessTranscript(videoId);

    if (!transcriptResult) {
      setToastMessage("Error Re-generating Keyconcept!");
      setIsSuccess(false);
      return;
    }

    const { transcriptText } = transcriptResult;
    const aiResponse = await startChatWithMessage([
      `Extract key concepts from this content this is transcript of an educational video so make it accordingly: ${transcriptText}`,
    ]);

    const concept = {
      keyconcept: {
        description: "",
        primary: aiResponse,
      },
    };
    const id = videoId;

    // Update local state with the new key concepts
    setKeyConcepts(concept.keyconcept);
    // console.log("the data generated is:", concept);

    setButtonState("Re-Generate");
    setToastMessage("Key-Concept regenerated successfully!");
    setIsSuccess(true);

    // Send the new key concepts to the backend
    ApiService.addKeyconcept(id, concept).catch((error) => {
      console.error("Error storing Key-concept:", error);
    });
  };

  useEffect(() => {
    if (
      !data?.keyconcept ||
      typeof data.keyconcept !== "object" ||
      !data.keyconcept.primary
    ) {
      console.error("Invalid or empty KeyConcepts format:", data);
      setError(true);
      return;
    }

    // Update local state with the data from the parent component
    setKeyConcepts(data.keyconcept);
    setError(false);
  }, [data]);

  const copyToClipboard = () => {
    if (!keyConcepts?.primary) {
      setToastMessage("No key concept available to copy!");
      setIsSuccess(false);
    } else {
      navigator.clipboard
        .writeText(keyConcepts.primary)
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
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">
          Invalid or missing key concepts. Please check the backend response.
        </p>
      </div>
    );
  }

  if (!keyConcepts) {
    return <p className="text-center text-gray-500">Loading key concepts...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      {/* Button Container */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center"
          title="Copy to Clipboard"
        >
          <MdContentCopy size={20} />
        </button>

        {/* Regenerate Button */}
        <button
          className="bg-green-500 text-white p-2 px-4 rounded-full hover:bg-green-600 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
          onClick={regenerate}
          disabled={buttonState === "Regenerating..."}
        >
          <MdRefresh size={20} />
          {buttonState}
        </button>
      </div>

      {/* Primary Concept (Markdown Rendered) */}
      {keyConcepts.primary && (
        <div className="prose prose-lg text-gray-700">
          <ReactMarkdown>{keyConcepts.primary}</ReactMarkdown>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          duration={3000}
          onClose={() => setToastMessage("")}
          position="bottom" // Changed to bottom for better mobile visibility
          isSuccess={isSuccess}
        />
      )}
    </div>
  );
}

export default KeyConcepts;