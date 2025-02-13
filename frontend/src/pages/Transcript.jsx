// import React, { useState } from "react";
// import { MdContentCopy } from "react-icons/md"; // Copy icon
// import ToastNotification from "../components/toastNotification/ToastNotification";

// const Transcript = ({ data }) => {
//   const [view, setView] = useState("original");
//   const [toastMessage, setToastMessage] = useState(""); // State for Toast Notification
//   const [isSuccess, setIsSuccess] = useState(true);
//   console.log("the transcript data:", data)
//   const renderTranscript = (transcript) => {
//     return transcript.map((entry, index) => (
//       <div
//         key={entry._id || index}
//         className="flex items-center my-2 px-3 py-2 bg-white rounded-md shadow-sm w-full"
//       >
//         <span
//           className="inline-block px-2 py-1 bg-blue-500 text-white rounded-md mr-3"
//           style={{ backgroundColor: "#00BFFF" }}
//         >
//           {entry.timestamp[0]} - {entry.timestamp[1]}
//         </span>
//         <span className="flex-1 bg-gray-200 p-2 rounded-md">
//           {entry.text}
//         </span>
//       </div>
//     ));
//   };

//   const copyTranscript = () => {
//     const transcriptText = data?.[view]?.map((entry) => entry.text).join("\n");
//     if (transcriptText) {
//       navigator.clipboard
//         .writeText(transcriptText)
//         .then(() => {
//           // Basic if-else statement to set the toast message based on view
//           if (view === "original") {
//             setToastMessage("Original Transcript copied to clipboard!");
//           } else if (view === "english") {
//             setToastMessage("English Transcript copied to clipboard!");
//           }
//           setIsSuccess(true);
//         })
//         .catch((err) => setToastMessage("Failed to copy transcript: " + err));
//     } else {
//       setToastMessage("No transcript available to copy!");
//       setIsSuccess(false);
//     }
//   };

//   return (
//     <div className="w-full mb-8 flex flex-col h-screen">
//       {/* Heading and Buttons (Fixed) */}
//       <div className="flex flex-col gap-4 mb-2 p-2 bg-white shadow-md">
//         <h5 className="font-semibold text-lg">
//           {view === "original" ? "Original Transcript" : "English Transcript"}
//         </h5>
//         <div className="flex gap-4">
//           <button
//             className={`p-2 px-4 rounded ${
//               view === "english" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"
//             }`}
//             onClick={() => setView("english")}
//           >
//             English
//           </button>
//           <button
//             className={`p-2 px-4 rounded ${
//               view === "original" ? "bg-blue-500 text-white" : "bg-gray-400 text-black"
//             }`}
//             onClick={() => setView("original")}
//           >
//             Original
//           </button>
//           <button
//             className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
//             onClick={copyTranscript}
//           >
//             <MdContentCopy size={20} /> {/* Copy icon */}
//           </button>
//         </div>
//       </div>

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md shadow-inner">
//         {view === "original"
//           ? data?.original
//             ? renderTranscript(data.original)
//             : <p>No data available.</p>
//           : data?.english
//             ? renderTranscript(data.english)
//             : <p>No data available.</p>
//         }
//       </div>

//       {/* ToastNotification for feedback */}
//       {toastMessage && (
//         <ToastNotification
//           message={toastMessage}
//           duration={3000} // Duration for the toast to show
//           onClose={() => setToastMessage("")} // Reset toast message on close
//           position="right"
//           isSuccess={isSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default Transcript;




import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md"; // Copy icon
import ToastNotification from "../components/toastNotification/ToastNotification";

const Transcript = ({ data }) => {
  const [view, setView] = useState("original");
  const [toastMessage, setToastMessage] = useState(""); // State for Toast Notification
  const [isSuccess, setIsSuccess] = useState(true);

  
  // Check if both `english` and `original` arrays are empty
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
          className="inline-block px-2 py-1 bg-blue-500 text-white rounded-md mr-3"
          style={{ backgroundColor: "#00BFFF" }}
        >
          {entry.timestamp[0]} - {entry.timestamp[1]}
        </span>
        <span className="flex-1 bg-gray-200 p-2 rounded-md">
          {entry.text}
        </span>
      </div>
    ));
  };

  const copyTranscript = () => {
    const transcriptText = data?.[view]?.map((entry) => entry.text).join("\n");
    if (transcriptText) {
      navigator.clipboard
        .writeText(transcriptText)
        .then(() => {
          // Basic if-else statement to set the toast message based on view
          if (view === "original") {
            setToastMessage("Original Transcript copied to clipboard!");
          } else if (view === "english") {
            setToastMessage("English Transcript copied to clipboard!");
          }
          setIsSuccess(true);
        })
        .catch((err) => setToastMessage("Failed to copy transcript: " + err));
    } else {
      setToastMessage("No transcript available to copy!");
      setIsSuccess(false);
    }
  };

  // If transcript is empty, show "NA"
  if (isTranscriptEmpty) {
    return (
      <div className="w-full mb-8 flex flex-col h-screen">
        <div className="flex flex-col gap-4 mb-2 p-2 bg-white shadow-md">
          <h5 className="font-semibold text-lg">Transcript</h5>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md shadow-inner flex items-center justify-center">
          <p className="text-gray-500 text-lg">NA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-8 flex flex-col h-screen">
      {/* Heading and Buttons (Fixed) */}
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
            <MdContentCopy size={20} /> {/* Copy icon */}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md shadow-inner">
        {view === "original"
          ? data?.original
            ? renderTranscript(data.original)
            : <p>No data available.</p>
          : data?.english
            ? renderTranscript(data.english)
            : <p>No data available.</p>
        }
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

export default Transcript;