import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { MdContentCopy, MdRefresh } from "react-icons/md";
import ToastNotification from "../components/toastNotification/ToastNotification";
import transcriptFetchService from "../utils/transcriptFetch.js";
import { startChatWithMessage } from "../lib/geminiHelperFunc";
import ApiService from "../AserverAuth/ApiService.js";

const Summary = ({ data, videoId }) => {
  const { english, original } = data; // Destructure data
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [buttonState, setButtonState] = useState("Re-Generate");
  const [summaryText, setSummaryText] = useState(selectedLanguage === "english" ? english : original);

  useEffect(() => {
    setSummaryText(selectedLanguage === "english" ? english : original);
  }, [selectedLanguage, english, original]);

  const handleCopy = () => {
    if (summaryText.trim() === "NA") {
      setToastMessage("No summary available to copy!");
      setIsSuccess(false);
    } else {
      navigator.clipboard.writeText(summaryText);
      setToastMessage(`Summary Copied to clipboard`);
      setIsSuccess(true);
    }
  };

  const regenerateSummary = async () => {
    setButtonState("Regenerating...");
    try {
      // Fetch the transcript using videoId
      
      const { transcriptText, transcriptTextOriginal } = await transcriptFetchService.fetchAndProcessTranscript(videoId, true);

      if (!transcriptText || !transcriptTextOriginal) {
        setToastMessage("Transcript is empty. Cannot regenerate summary.");
        setIsSuccess(false);
        return;
      }

      // Generate new summaries using AI
      const [aiResponseEnglish, aiResponseOriginal] = await Promise.all([
        startChatWithMessage([`Summarize this content   and this is the previouse summary text ${summaryText}. It is a lecture transcript and will be displayed on the frontend, so format it well: ${transcriptText} `]),
        startChatWithMessage([`Summarize this content and this is the previouse summary text ${summaryText} in the language it is mostly in: ${transcriptTextOriginal} `]),
      ]);

      const id = videoId
      const original = aiResponseOriginal
      const english = aiResponseEnglish

      ApiService.addSummary(id, original, english).catch((error) => {
        console.error("Error storing Summary:", error);
      })

      // Update the local state with the new summaries
      setSummaryText(selectedLanguage === "english" ? aiResponseEnglish : aiResponseOriginal);
      setToastMessage("Summary regenerated successfully!");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error regenerating summary:", error);
      setToastMessage("Failed to regenerate summary. Please try again.");
      setIsSuccess(false);
    } finally {
      setButtonState("Re-Generate");
    }
  };


  return (
    <div className="min-w-[250px] max-w-[80vw] mx-auto flex flex-col h-screen">
      {/* Fixed Heading and Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-white shadow-md gap-4 sm:gap-0">
        {/* Language Buttons */}
        <div className="flex gap-4">
          <button
            className={`p-2 px-4 rounded-full ${
              selectedLanguage === "english" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-black"
            }`}
            onClick={() => setSelectedLanguage("english")}
          >
            English
          </button>
          <button
            className={`p-2 px-4 rounded-full ${
              selectedLanguage === "original" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-black"
            }`}
            onClick={() => setSelectedLanguage("original")}
          >
            Original
          </button>
        </div>
  
        {/* Copy and Regenerate Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 w-full sm:w-auto">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full w-full sm:w-auto flex justify-center items-center"
            onClick={handleCopy}
          >
            <MdContentCopy size={20} />
          </button>
          <button
            className="bg-green-500 text-white p-2 px-4 rounded-full hover:bg-green-600 flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={regenerateSummary}
            disabled={buttonState === "Regenerating..."}
          >
            <MdRefresh size={20} />
            {buttonState}
          </button>
        </div>
      </div>
  
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md border shadow-inner">
        <p>
          <strong>{selectedLanguage === "english" ? "English" : "Original"} Summary:</strong>
        </p>
        <ReactMarkdown className="prose max-w-none">
          {summaryText !== "NA" ? summaryText : "Not yet provided"}
        </ReactMarkdown>
      </div>
  
      {/* ToastNotification for feedback */}
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

 
};


export default Summary;