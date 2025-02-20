import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md"; // Import the copy icon
import ToastNotification from "../components/toastNotification/ToastNotification";
import { useDispatch } from "react-redux";
import { setTranscript } from "../store/currentVideoSlice";
import { startChatWithMessage } from "../lib/geminiHelperFunc";


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




// import React, { useState, useEffect } from "react";
// import { MdContentCopy } from "react-icons/md"; // Import the copy icon
// import ToastNotification from "../components/toastNotification/ToastNotification";
// import {  useSelector } from "react-redux";

// import { startChatWithMessage } from "../lib/geminiHelperFunc";

// const Summary = ({ data }) => {
//   const { english, original } = data?.data || { english: null, original: null }; // Ensure data exists
//   const transcript = useSelector((state) => state.currentVideo.transcript); // Get transcript from Redux
//   const [selectedLanguage, setSelectedLanguage] = useState("english");
//   const [toastMessage, setToastMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(true);
//   const [summary, setSummary] = useState({ english, original });
//   const [view, setView] = useState("english");

//   useEffect(() => {
//     if (!english && !original && transcript) {
//       // Generate summary if data is null but transcript exists
//       const transcriptText = `Summarize this transcript: ${transcript?.[view]?.map((entry) => entry.text).join("\n")}`;
//       // console.log("the transcript inside the summary fucniton:", transcriptText)
//       startChatWithMessage([transcriptText])
//         .then((response) => {
//           setSummary({ english: response, original: response }); // Store generated summary
//         })
//         .catch((error) => console.error("Error generating summary:", error));
//     }
//   }, [english, original, transcript]);

//   const handleCopy = () => {
//     const summaryText = selectedLanguage === "english" ? summary.english : summary.original;
//     if (!summaryText || summaryText.trim() === "NA") {
//       setToastMessage("No summary available to copy!");
//       setIsSuccess(false);
//     } else {
//       navigator.clipboard.writeText(summaryText);
//       setToastMessage("Summary Copied to clipboard");
//       setIsSuccess(true);
//     }
//   };

//   return (
//     <div className="min-w-[250px] max-w-[80vw] mx-auto flex flex-col h-screen">
//       {/* Fixed Heading and Buttons */}
//       <div className="flex justify-between items-center mb-4 p-4 bg-white shadow-md">
//         <div className="flex gap-4">
//           <button
//             className={`p-2 px-4 rounded ${selectedLanguage === "english" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"}`}
//             onClick={() => setSelectedLanguage("english")}
//           >
//             English
//           </button>
//           <button
//             className={`p-2 px-4 rounded ${selectedLanguage === "original" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"}`}
//             onClick={() => setSelectedLanguage("original")}
//           >
//             Original
//           </button>
//         </div>
//         <button
//           className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
//           onClick={handleCopy}
//         >
//           <MdContentCopy size={20} />
//         </button>
//       </div>

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md border shadow-inner">
//         <p>
//           <strong>{selectedLanguage === "english" ? "English" : "Original"} Summary:</strong>
//         </p>
//         <p>{summary[selectedLanguage] || "Not yet provided"}</p>
//       </div>

//       {/* ToastNotification for feedback */}
//       {toastMessage && (
//         <ToastNotification
//           message={toastMessage}
//           duration={3000}
//           onClose={() => setToastMessage("")}
//           position="right"
//           isSuccess={isSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default Summary;
