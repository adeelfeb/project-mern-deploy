// import React, { useState, useEffect, Suspense, lazy } from "react";
// import videoService from "../AserverAuth/config";
// import { useDispatch } from "react-redux";
// import { startChatWithMessage } from "../lib/geminiHelperFunc";
// import { original } from "@reduxjs/toolkit";


// // Lazy load components
// const Transcript = lazy(() => import("./Transcript"));
// const Summary = lazy(() => import("./Summary"));
// const Quiz = lazy(() => import("./Quiz"));
// const KeyConcepts = lazy(() => import("./KeyConcepts"));
// const Explanation = lazy(() => import("./Explanation"));
// const CurrentScore = lazy(() => import("./CurrentScore"));

// const VideoDetails = ({ data }) => {
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [transcriptData, setTranscriptData] = useState(null);
//   const [summaryData, setSummaryData] = useState(null);
//   const [qnaData, setQnatData] = useState(null);
//   const [keyConceptsData, setKeyConceptsData] = useState(null);
//   const [transcriptisLoading, setTranscriptIsLoading] = useState(false);
//   const [summaryIsLoading, setSummaryIsLoading] = useState(false);
//   const [quizIsLoading, setQuizIsLoading] = useState(false);
//   const [keyConceptsIsLoading, setKeyConceptsIsLoading] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 
//   const [isPopupOpen, setIsPopupOpen] = useState(false); 
  

  
//   // Reset state when data changes
//   useEffect(() => {
//     setSelectedSection(null);
//     setTranscriptData(null);
//     setSummaryData(null);
//     setQnatData(null);
//     setKeyConceptsData(null);
//     setTranscriptIsLoading(false);
//     setSummaryIsLoading(false);
//     setQuizIsLoading(false);
//     setKeyConceptsIsLoading(false);
//   }, [data]);

//   // Detect screen size changes
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

  
  


//   const handleSectionClick = async (section) => {
//     if (!data._id) {
//       console.error("No videoId found.");
//       return;
//     }
  
//     // Set loading state
//     switch (section) {
//       case "transcript":
//         setTranscriptIsLoading(true);
//         break;
//       case "summary":
//         setSummaryIsLoading(true); // Initially show 'Loading...' when fetching summary
//         break;
//       case "quiz":
//         setQuizIsLoading(true);
//         break;
//       case "keyConcepts":
//         setKeyConceptsIsLoading(true);
//         break;
//       default:
//         break;
//     }
  
//     try {
//       let response;
//       switch (section) {
//         case "transcript":
//           response = await videoService.getTranscript(data._id);
//           setTranscriptData(response.data.transcript);
//           break;
  
//         case "summary":
//           response = await videoService.getSummary(data._id);
          
//           if (response.data.summary.original === "NA") {
//             console.log("Summary is empty, generating...");
//             setSummaryIsLoading("generating"); // Change state to 'Generating...'
  
//             // Fetch transcript only once
//             const transcriptResponse = await videoService.getTranscript(data._id);
//             const transcriptData = transcriptResponse.data.transcript;
  
//             const transcriptText = transcriptData?.["english"]?.map(entry => entry.text).join("\n") || "";
//             const transcriptTextOriginal = transcriptData?.["original"]?.map(entry => entry.text).join("\n") || "";
  
//             // Run AI generation in parallel
//             const [aiResponseEnglish, aiResponseOriginal] = await Promise.all([
//               startChatWithMessage([`Summarize this content. It is a lecture transcript and will be displayed on the frontend, so format it well: ${transcriptText}`]),
//               startChatWithMessage([`Summarize this content in the original language as much as possible: ${transcriptTextOriginal}`])
//             ]);
  
//             console.log("Summaries generated.");
            
//             setSummaryData({
//               original: aiResponseOriginal,
//               english: aiResponseEnglish,
//             });
//           } else {
//             setSummaryData(response.data.summary);
//           }
//           break;
  
//         case "quiz":
//           response = await videoService.getqnas(data._id);
//           setQnatData(response);
//           break;
  
//         case "keyConcepts":
//           response = await videoService.getKeyConcepts(data._id);
//           setKeyConceptsData(response.data.data);
//           break;
  
//         default:
//           break;
//       }
  
//       setSelectedSection(section);
//       if (isMobile) setIsPopupOpen(true);
//     } catch (error) {
//       console.error(`Error fetching ${section}:`, error);
//     } finally {
//       // Reset loading states
//       switch (section) {
//         case "transcript":
//           setTranscriptIsLoading(false);
//           break;
//         case "summary":
//           setSummaryIsLoading(false);
//           break;
//         case "quiz":
//           setQuizIsLoading(false);
//           break;
//         case "keyConcepts":
//           setKeyConceptsIsLoading(false);
//           break;
//         default:
//           break;
//       }
//     }
//   };

  
  
//   // Close popup
//   const closePopup = () => {
//     setIsPopupOpen(false);
//     setSelectedSection(null);
//   };
//   const [videoId, setVideoId] = useState(null);


  

  
//   useEffect(() => {
//     if (data?._id) {
//       setVideoId(data._id);
//     }
//   }, [data]);


//   return (
//     <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden ">
//       {/* Left Section */}
//       <div className="flex-1 md:flex-[3] w-full p-2 border-b md:border-b-0 md:border-r h-full md:max-h-screen flex flex-col">
//         {/* Video Section */}
//         <div className="w-full mb-4">
//           <iframe
//             src={
//               data.videoUrl
//                 ? `https://www.youtube.com/embed/${new URLSearchParams(
//                     new URL(data.videoUrl).search
//                   ).get("v")}`
//                 : ""
//             }
//             className="w-full aspect-video"
//             title="YouTube Video"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>
//         </div>
  
//         {/* Video Details */}
//         <div>
//           <h4 className="font-semibold text-lg">{data.title}</h4>
//           <p className="text-sm font-semibold text-gray-600 mt-2">
//             Duration: {data.duration}
//           </p>
//           <p className="text-sm font-semibold text-gray-600 mb-2">
//             Watched: {new Date(data.createdAt).toLocaleString()}
//           </p>
//         </div>
  
//         {/* Buttons Section */}
//         <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-grow max-h-[calc(100vh-300px)]">
//           {[
//             { label: "Transcript", loading: transcriptisLoading, section: "transcript" },
//             { label: "Summary", loading: summaryIsLoading, section: "summary" },
//             { label: "Key Concepts", loading: keyConceptsIsLoading, section: "keyConcepts" },
//             { label: "Take Quiz", loading: quizIsLoading, section: "quiz" },
//             { label: "Current Score", loading: false, section: "currentScore" },
//           ].map(({ label, loading, section }) => (
//             <button
//   key={section}
//   onClick={() => handleSectionClick(section)}
//   className={`w-full px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base font-medium border rounded-lg transition-all duration-300 ${
//     selectedSection === section
//       ? "bg-blue-500 text-white"
//       : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
//   }`}
// >
//   {loading ? "Loading..." : label}
// </button>

//           ))}
//         </div>
//       </div>
  
  
//         {/* Right Section (Desktop) */} 
// <div className="hidden md:block md:flex-[7] w-full p-2">
//   <Suspense fallback={<div>Loading...</div>}>
//     {!selectedSection && <Explanation />}

//     {selectedSection === "transcript" && (
//       <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
//         <Transcript data={transcriptData || data.transcript} />
//       </div>
//     )}

//     {selectedSection === "summary" && (
//       <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
//       <Summary data={summaryData || data.summary} /> 
//       </div>
//     )}
    
//     {selectedSection === "keyConcepts" && (
//        <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
//       <KeyConcepts data={keyConceptsData} />
//       </div>
//     )}
    
//     {selectedSection === "quiz" && 
    
//     <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2"><Quiz data={qnaData} />
//     </div>}
    
//     {selectedSection === "currentScore" && 
//        <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2"><CurrentScore /> </div>}
//   </Suspense>
// </div>


//       {/* Popup (Mobile) */}
//       {isMobile && isPopupOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-11/12 max-h-[90vh] overflow-auto p-4">
//             <button
//               onClick={closePopup}
//               className="absolute top-2 right-2 bg-gray-100 text-gray-800 hover:text-gray-900 
//                         text-xl md:text-2xl w-6 h-6 md:w-12 md:h-12 
//                         flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 leading-none"
//             >
//               &times;
//             </button>
  
//             <Suspense fallback={<div>Loading...</div>}>
//               {selectedSection === "transcript" && (
//                 <Transcript data={transcriptData || data.transcript} />
//               )}
//               {selectedSection === "summary" && (
//                 <Summary data={summaryData || data.summary} />
//               )}
//               {selectedSection === "keyConcepts" && (
//                 <KeyConcepts data={keyConceptsData} />
//               )}
//               {selectedSection === "quiz" && videoId && <Quiz data={qnaData} />}
//               {selectedSection === "currentScore" && <CurrentScore />}
//             </Suspense>
//           </div>
//         </div>
//       )}
//     </div>
//   );
  
//   };

// export default VideoDetails;

















import React, { useState, useEffect, Suspense, lazy, memo, useMemo } from "react";
import videoService from "../AserverAuth/config";
import { useDispatch } from "react-redux";
import { startChatWithMessage } from "../lib/geminiHelperFunc";
import { original } from "@reduxjs/toolkit";

// Lazy load components
const Transcript = lazy(() => import("./Transcript"));
const Summary = lazy(() => import("./Summary"));
const Quiz = lazy(() => import("./Quiz"));
const KeyConcepts = lazy(() => import("./KeyConcepts"));
const Explanation = lazy(() => import("./Explanation"));
const CurrentScore = lazy(() => import("./CurrentScore"));

const VideoDetails = ({ data }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [qnaData, setQnatData] = useState(null);
  const [keyConceptsData, setKeyConceptsData] = useState(null);
  const [transcriptisLoading, setTranscriptIsLoading] = useState(false);
  const [summaryIsLoading, setSummaryIsLoading] = useState(false);
  const [quizIsLoading, setQuizIsLoading] = useState(false);
  const [keyConceptsIsLoading, setKeyConceptsIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset state when data changes
  useEffect(() => {
    setSelectedSection(null);
    setTranscriptData(null);
    setSummaryData(null);
    setQnatData(null);
    setKeyConceptsData(null);
    setTranscriptIsLoading(false);
    setSummaryIsLoading(false);
    setQuizIsLoading(false);
    setKeyConceptsIsLoading(false);
    setIsGenerating(false);
  }, [data]);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const fetchAndProcessTranscript = async (videoId) => {
    const transcriptResponse = await videoService.getTranscript(videoId);
    const transcriptData = transcriptResponse.data.transcript;
  
    // If transcript is empty, return null
    if (!transcriptData || transcriptData.original === "NA") {
      console.log("Transcript is empty.");
      return null;
    }
  
    // Extract transcript text
    const transcriptText = transcriptData?.["english"]?.map(entry => entry.text).join("\n") || "";
    return { transcriptData, transcriptText };
  };


  const memoizedTranscript = useMemo(async () => {
    if (!data._id) return null;
    return await fetchAndProcessTranscript(data._id);
  }, [data._id]);



  const handleSectionClick = async (section) => {
    if (!data._id) {
      console.error("No videoId found.");
      return;
    }
  
    // Set loading state
    switch (section) {
      case "transcript":
        setTranscriptIsLoading(true);
        break;
      case "summary":
        setSummaryIsLoading(true);
        break;
      case "quiz":
        setQuizIsLoading(true);
        break;
      case "keyConcepts":
        setKeyConceptsIsLoading(true);
        break;
      default:
        break;
    }
  
    try {
      let response;
      switch (section) {
        case "transcript":
          response = await videoService.getTranscript(data._id);
          // If transcript is empty, set default empty state and return
          if (!response.data.transcript || response.data.transcript.original === "NA") {
            console.log("Transcript is empty.");
            setTranscriptData({ original: [], english: [] });
            return;
          }
          setTranscriptData(response.data.transcript);
          break;
  
        case "summary":
          response = await videoService.getSummary(data._id);
  
          // If summary is empty, generate it using the transcript
          if (response.data.summary.original === "NA") {
            console.log("Summary is empty, generating...");
            setSummaryIsLoading("generating");
            setIsGenerating(true);
  
            // Fetch and process transcript
            const transcriptResult = await fetchAndProcessTranscript(data._id);
            if (!transcriptResult) {
              console.log("Transcript is empty, cannot generate summary.");
              setSummaryData({ original: "NA", english: "NA" });
              return;
            }
  
            const { transcriptText, transcriptTextOriginal } = transcriptResult;
  
            // Generate summary using AI
            const [aiResponseEnglish, aiResponseOriginal] = await Promise.all([
              startChatWithMessage([`Summarize this content. It is a lecture transcript and will be displayed on the frontend, so format it well: ${transcriptText}`]),
              startChatWithMessage([`Summarize this content in the original language as much as possible: ${transcriptTextOriginal}`])
            ]);
  
            console.log("Summaries generated.");
            setSummaryData({
              original: aiResponseOriginal,
              english: aiResponseEnglish,
            });
          } else {
            setSummaryData(response.data.summary);
          }
          break;
  
        case "quiz":
          response = await videoService.getqnas(data._id);      
          // console.log("the quiz recieved is :", response)
  
          // If QnA is empty, generate it using the transcript
          if (!(response.qnas?.shortQuestions?.length || response.qnas?.mcqs?.length || response.qnas?.fillInTheBlanks?.length)) {
  
            setQuizIsLoading("generating");
            setIsGenerating(true);
          
            // Fetch and process transcript
            const transcriptResult = await fetchAndProcessTranscript(data._id);
            if (!transcriptResult) {
              console.log("Transcript is empty, cannot generate quiz.");
              setQnatData({ qnas: "NA" });
              return;
            }
          
            const { transcriptText } = transcriptResult;
          
            // Prompt AI to generate structured quiz data
            const aiResponse = await startChatWithMessage([
              `Generate a structured quiz based on this transcript:
               ${transcriptText}
               The quiz should be formatted as JSON with three sections:
               - "mcqs": An array of MCQs, each with a question, four options, and the correctAnswer.
               - "shortQuestions": An array of short-answer questions, each with a question and answer.
               - "fillInTheBlanks": An array of fill-in-the-blank questions, each with a sentence and the correct missing word.
               Wrap the JSON inside a code block like this:
               \`\`\`json
               { "mcqs": [...], "shortQuestions": [...], "fillInTheBlanks": [...] }
               \`\`\`
               `
            ]);
          
            
          
            // Extract JSON from AI response (removing the code block formatting)
            const jsonMatch = aiResponse.match(/```json([\s\S]*?)```/);
            if (!jsonMatch) {
              console.error("Failed to parse AI response as JSON.");
              setQnatData({ qnas: "NA" });
              return;
            }
          
            try {
              const parsedData = JSON.parse(jsonMatch[1].trim()); // Convert extracted JSON string to object
          
              // Ensure the response is properly formatted
              const formattedQuizData = {
                qnas: {
                  mcqs: parsedData.mcqs || [],
                  shortQuestions: parsedData.shortQuestions || [],
                  fillInTheBlanks: parsedData.fillInTheBlanks || [],
                }
              };
              // console.log("formated quiz is:", formattedQuizData)
          
              setQnatData(formattedQuizData);
            } catch (error) {
              console.error("Error parsing AI response JSON:", error);
              setQnatData({ qnas: "NA" });
            }
          }
          
           else {
            setQnatData(response);
          }
          break;
  
        case "keyConcepts":
          response = await videoService.getKeyConcepts(data._id);
  
          // If key concepts are empty, generate them using the transcript
          if (response.data.data.keyconcept.primary === "NA") {
            
            setKeyConceptsIsLoading("generating");
            setIsGenerating(true);
  
            // Fetch and process transcript
            const transcriptResult = await fetchAndProcessTranscript(data._id);
            if (!transcriptResult) {
              console.log("Transcript is empty, cannot generate key concepts.");
              setKeyConceptsData({ keyconcept: { description: "", primary: "NA" } });
              return;
            }
  
            const { transcriptText } = transcriptResult;
            const aiResponse = await startChatWithMessage([`Extract key concepts from this content this is transcript of an educational video so make it accordingly: ${transcriptText}`]);
  
            
            const keyconceptGenerated = {
              keyconcept: {
                description: "",
                primary: aiResponse,
              },
            };
            setKeyConceptsData(keyconceptGenerated);
          } else {
            setKeyConceptsData(response.data.data);
          }
          break;
  
        default:
          break;
      }
  
      setSelectedSection(section);
      if (isMobile) setIsPopupOpen(true);
    } catch (error) {
      console.error(`Error fetching ${section}:`, error);
    } finally {
      // Reset loading states
      switch (section) {
        case "transcript":
          setTranscriptIsLoading(false);
          break;
        case "summary":
          setSummaryIsLoading(false);
          break;
        case "quiz":
          setQuizIsLoading(false);
          break;
        case "keyConcepts":
          setKeyConceptsIsLoading(false);
          break;
        default:
          break;
      }
      setIsGenerating(false);
    }
  };



  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedSection(null);
  };
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (data?._id) {
      setVideoId(data._id);
    }
  }, [data]);

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden ">
      {/* Left Section */}
      <div className="flex-1 md:flex-[3] w-full p-2 border-b md:border-b-0 md:border-r h-full md:max-h-screen flex flex-col">
        {/* Video Section */}
        <div className="w-full mb-4">
          <iframe
            src={
              data.videoUrl
                ? `https://www.youtube.com/embed/${new URLSearchParams(
                    new URL(data.videoUrl).search
                  ).get("v")}`
                : ""
            }
            className="w-full aspect-video"
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
  
        {/* Video Details */}
        <div>
          <h4 className="font-semibold text-lg">{data.title}</h4>
          <p className="text-sm font-semibold text-gray-600 mt-2">
            Duration: {data.duration}
          </p>
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Watched: {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
  
        {/* Buttons Section */}
        <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-grow max-h-[calc(100vh-300px)]">
          {[
            { label: "Transcript", loading: transcriptisLoading, section: "transcript" },
            { label: "Summary", loading: summaryIsLoading, section: "summary" },
            { label: "Key Concepts", loading: keyConceptsIsLoading, section: "keyConcepts" },
            { label: "Take Quiz", loading: quizIsLoading, section: "quiz" },
            { label: "Current Score", loading: false, section: "currentScore" },
          ].map(({ label, loading, section }) => (
            <button
              key={section}
              onClick={() => handleSectionClick(section)}
              className={`w-full px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base font-medium border rounded-lg transition-all duration-300 ${
                selectedSection === section
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
              }`}
            >
              {loading === "generating" ? "Generating..." : loading ? "Fetching..." : label}
            </button>
          ))}
        </div>
      </div>
  
      {/* Right Section (Desktop) */} 
      <div className="hidden md:block md:flex-[7] w-full p-2">
        <Suspense fallback={<div>Loading...</div>}>
          {!selectedSection && <Explanation />}

          {selectedSection === "transcript" && (
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
              <Transcript data={transcriptData || data.transcript} />
            </div>
          )}

          {selectedSection === "summary" && (
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
              <Summary data={summaryData || data.summary} /> 
            </div>
          )}
          
          {selectedSection === "keyConcepts" && (
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
              <KeyConcepts data={keyConceptsData} />
            </div>
          )}
          
          {selectedSection === "quiz" && 
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
              <Quiz data={qnaData} />
            </div>
          }
          
          {selectedSection === "currentScore" && 
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-2">
              <CurrentScore /> 
            </div>
          }
        </Suspense>
      </div>

      {/* Popup (Mobile) */}
      {isMobile && isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-h-[90vh] overflow-auto p-4">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 bg-gray-100 text-gray-800 hover:text-gray-900 
                        text-xl md:text-2xl w-6 h-6 md:w-12 md:h-12 
                        flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 leading-none"
            >
              &times;
            </button>
  
            <Suspense fallback={<div>Loading...</div>}>
              {selectedSection === "transcript" && (
                <Transcript data={transcriptData || data.transcript} />
              )}
              {selectedSection === "summary" && (
                <Summary data={summaryData || data.summary} />
              )}
              {selectedSection === "keyConcepts" && (
                <KeyConcepts data={keyConceptsData} />
              )}
              {selectedSection === "quiz" && videoId && <Quiz data={qnaData} />}
              {selectedSection === "currentScore" && <CurrentScore />}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;