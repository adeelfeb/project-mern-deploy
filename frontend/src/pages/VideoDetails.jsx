import React, { useState, useEffect, Suspense, lazy } from "react";
import videoService from "../AserverAuth/config";
import { useDispatch } from "react-redux";
import { setTranscript, clearTranscript } from "../store/currentVideoSlice";

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
  const [summaryData, setSummarytData] = useState(null);
  const [qnaData, setQnatData] = useState(null);
  const [keyConceptsData, setKeyConceptsData] = useState(null);
  const [transcriptisLoading, setTranscriptIsLoading] = useState(false);
  const [summaryIsLoading, setSummaryIsLoading] = useState(false);
  const [quizIsLoading, setQuizIsLoading] = useState(false);
  const [keyConceptsIsLoading, setKeyConceptsIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect mobile screen
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Control popup visibility
  const dispatch = useDispatch()

  
  // Reset state when data changes
  useEffect(() => {
    setSelectedSection(null);
    setTranscriptData(null);
    setSummarytData(null);
    setQnatData(null);
    setKeyConceptsData(null);
    setTranscriptIsLoading(false);
    setSummaryIsLoading(false);
    setQuizIsLoading(false);
    setKeyConceptsIsLoading(false);
  }, [data]);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle section selection
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
          dispatch(clearTranscript());
          response = await videoService.getTranscript(data._id);
          dispatch(setTranscript(response.data.transcript));
          setTranscriptData(response.data.transcript);
          break;
        case "summary":
          response = await videoService.getSummary(data._id);
          setSummarytData(response.data.summary);
          break;
        case "quiz":
          response = await videoService.getqnas(data._id);
          setQnatData(response);
          break;
        case "keyConcepts":
          response = await videoService.getKeyConcepts(data._id);
          setKeyConceptsData(response.data.data);
          break;
        default:
          break;
      }
      setSelectedSection(section);
      if (isMobile) setIsPopupOpen(true); // Open popup on mobile
    } catch (error) {
      console.error(`Error fetching ${section}:`, error);
    } finally {
      // Reset loading state
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
    }
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedSection(null);
  };
  const [videoId, setVideoId] = useState(null);


  // console.log("video Id in VideoDetails component:", videoId)


  
  useEffect(() => {
    if (data?._id) {
      setVideoId(data._id);
    }
  }, [data]);


  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
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
  {loading ? "Loading..." : label}
</button>

          ))}
        </div>
      </div>
  
      {/* Right Section (Desktop) */} 
      <div className="hidden md:block md:flex-[7] w-full p-4 overflow-auto">
        <Suspense fallback={<div>Loading...</div>}>
          {!selectedSection && <Explanation />}
          {selectedSection === "transcript" && (
            <Transcript data={transcriptData || data.transcript} />
          )}
          {selectedSection === "summary" && (
            <Summary data={summaryData || data.summary} /> 
          )}
          {selectedSection === "keyConcepts" && (
            <KeyConcepts data={keyConceptsData} />
          )}
          {selectedSection === "quiz" && <Quiz data={qnaData} />}
          {selectedSection === "currentScore" && <CurrentScore />}
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