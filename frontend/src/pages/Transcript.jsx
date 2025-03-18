import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";
import ToastNotification from "../components/toastNotification/ToastNotification";

// Format timestamp into "MM:SS"
const formatTimestamp = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const Transcript = ({ data }) => {
  let indexView = data.original === "NA" ? "english" : "original";
  const [view, setView] = useState(indexView);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  console.log("Transcript data received:", data);

  const isTranscriptEmpty =
    (!data?.english || data.english.length === 0) &&
    (!data?.original || data.original.length === 0);

  const renderTranscript = (transcript) => {
    return transcript.map((entry, index) => (
      <div
        key={entry._id || index}
        className="flex items-center my-2 px-3 py-2 bg-white rounded-md shadow-sm w-full"
      >
        <span
          className="inline-block px-2 py-1 text-white rounded-md mr-3 font-semibold 
          bg-blue-500 sm:text-sm text-xs" // Smaller text on mobile
        >
          {formatTimestamp(entry.timestamp[0])} - {formatTimestamp(entry.timestamp[1])}
        </span>
        <span className="flex-1 bg-gray-200 p-2 rounded-md">{entry.text}</span>
      </div>
    ));
  };

  const copyTranscript = () => {
    const transcriptText = data?.[view]?.map((entry) => entry.text).join("\n");
    if (transcriptText) {
      navigator.clipboard
        .writeText(transcriptText)
        .then(() => {
          setToastMessage(
            view === "original"
              ? "Original Transcript copied to clipboard!"
              : "English Transcript copied to clipboard!"
          );
          setIsSuccess(true);
        })
        .catch((err) => setToastMessage("Failed to copy transcript: " + err));
    } else {
      setToastMessage("No transcript available to copy!");
      setIsSuccess(false);
    }
  };

  if (isTranscriptEmpty) {
    return (
      <div className="w-full mb-8 flex flex-col h-screen">
        <div className="flex flex-col gap-4 mb-2 p-2 bg-white shadow-md">
          <h5 className="font-semibold text-lg">Transcript</h5>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md shadow-inner flex items-center justify-center">
          <p className="text-gray-500 text-lg">Transcript is Not Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-[100vh]">
      <div className="flex flex-col gap-4 mb-2 p-2 bg-white shadow-md">
        <h5 className="font-semibold text-lg">
          {view === "original" ? "Original Transcript" : "English Transcript"}
        </h5>
        <div className="flex gap-4">
          <button
            className={`p-2 px-4 rounded ${
              view === "english" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"
            }`}
            onClick={() => setView("english")}
          >
            English
          </button>
          <button
            className={`p-2 px-4 rounded ${
              view === "original" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"
            }`}
            onClick={() => setView("original")}
          >
            Original
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            onClick={copyTranscript}
          >
            <MdContentCopy size={20} />
          </button>
        </div>
      </div>

      <div className="h-0 flex-grow overflow-y-auto bg-white rounded-md shadow-inner">
        {view === "original"
          ? data?.original
            ? renderTranscript(data.original)
            : <p>No data available.</p>
          : data?.english
            ? renderTranscript(data.english)
            : <p>No data available.</p>
        }
      </div>

      {toastMessage && (
        <div className="absolute bottom-4 right-4">
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

export default Transcript;

