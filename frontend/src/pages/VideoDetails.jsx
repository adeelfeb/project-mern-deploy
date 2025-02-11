import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Transcript from "./Transcript";
import Summary from "./Summary";
import Quiz from "./Quiz";
import KeyConcepts from "./KeyConcepts";
import Explanation from "./Explanation"; // Import the Explanation component
import CurrentScore from "./CurrentScore"; // Import the CurrentScore component
import videoService from "../AserverAuth/config";

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
  
  
  const handleTranscriptClick = async () => {
    if (!data._id) {
      console.error("No videoId found.");
      return;
    }

    setTranscriptIsLoading(true);

    try {
      const transcript = await videoService.getTranscript(data._id);
      setTranscriptData(transcript.data.transcript);
      setSelectedSection("transcript");
    } catch (error) {
      console.error("Error fetching transcript:", error);
    } finally {
      setTranscriptIsLoading(false);
    }
  };

  const handleSummaryClick = async () => {
    if (!data._id) {
      console.error("No videoId found.");
      return;
    }

    setSummaryIsLoading(true);

    try {
      const summary = await videoService.getSummary(data._id);
      setSummarytData(summary.data.summary);
      setSelectedSection("summary");
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setSummaryIsLoading(false);
    }
  };

  const handleQuizClick = async () => {
    if (!data._id) {
      console.error("No videoId found.");
      return;
    }

    setQuizIsLoading(true);

    try {
      const quiz = await videoService.getqnas(data._id);
      setQnatData(quiz.data.qnas);
      setSelectedSection("quiz");
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setQuizIsLoading(false);
    }
  };

  const handleKeyConceptsClick = async () => {
    if (!data._id) {
      console.error("No videoId found.");
      return;
    }

    setKeyConceptsIsLoading(true);

    try {
      const keyConcepts = await videoService.getKeyConcepts(data._id);
      // console.log("The keyconcepts from the VideoDetails page:", keyConcepts.data.data);
      setKeyConceptsData(keyConcepts.data.data);
      setSelectedSection("keyConcepts");
    } catch (error) {
      console.error("Error fetching key concepts:", error);
    } finally {
      setKeyConceptsIsLoading(false);
    }
  };

  const handleCurrentScoreClick = () => {
    setSelectedSection("currentScore");
  };

  return (
    <div className="flex flex-row h-[calc(100vh-200px)]">
      {/* Left Section */}
      <div className="flex-[3] p-4 border-r">
        <div className="w-full mb-4">
          <iframe
            src={
              data.videoUrl
                ? `https://www.youtube.com/embed/${new URLSearchParams(
                    new URL(data.videoUrl).search
                  ).get("v")}`
                : ""
            }
            width="100%"
            height="100%"
            className="aspect-video"
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div>
          <h4 className="font-semibold text-lg">{data.title}</h4>
          <p className="text-sm font-semibold text-gray-600 mt-2 truncate">
            Duration: {data.duration}
          </p>
          <p className="text-sm font-semibold text-gray-600 mb-2 truncate">
            Watched: {new Date(data.createdAt).toLocaleString()}
          </p>
          {/* <div className="flex flex-col gap-2 overflow-y-auto max-h-[200px]">
  <button
    onClick={handleTranscriptClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "transcript"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {transcriptisLoading ? "Loading..." : "Transcript"}
  </button>
  <button
    onClick={handleSummaryClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "summary"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {summaryIsLoading ? "Loading..." : "Summary"}
  </button>
  <button
    onClick={handleKeyConceptsClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "keyConcepts"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {keyConceptsIsLoading ? "Loading..." : "Key Concepts"}
  </button>
  <button
    onClick={handleQuizClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "quiz"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {quizIsLoading ? "Loading..." : "Take Quiz"}
  </button>
  
  <button
    onClick={handleCurrentScoreClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "currentScore"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    Current Score
  </button>
</div> */}

<div className="flex flex-col gap-2 overflow-y-auto max-h-[200px]">
  <button
    onClick={handleTranscriptClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "transcript"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {transcriptisLoading ? "Loading..." : "Transcript"}
  </button>
  <button
    onClick={handleSummaryClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "summary"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {summaryIsLoading ? "Loading..." : "Summary"}
  </button>
  <button
    onClick={handleKeyConceptsClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "keyConcepts"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {keyConceptsIsLoading ? "Loading..." : "Key Concepts"}
  </button>
  <button
    onClick={handleQuizClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "quiz"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    {quizIsLoading ? "Loading..." : "Take Quiz"}
  </button>
  <button
    onClick={handleCurrentScoreClick}
    className={`px-4 py-2 font-medium border rounded-lg transition-transform duration-300 ease-in-out ${
      selectedSection === "currentScore"
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    Current Score
  </button>
</div>

        </div>
      </div>

      {/* Right Section */}
      <div className="flex-[7] p-4 overflow-auto scrollbar-thin">
        {!selectedSection && <Explanation />} {/* Show Explanation by default */}
        {selectedSection === "transcript" && (
          <Transcript data={transcriptData || data.transcript} />
        )}
        {selectedSection === "summary" && (
          <Summary data={summaryData || data.summary} />
        )}
        {selectedSection === "keyConcepts" && (
          <KeyConcepts data={keyConceptsData} />
        )}
        {selectedSection === "quiz" && <Quiz data={qnaData || data.qnas} />}
        {selectedSection === "currentScore" && <CurrentScore />} {/* Display CurrentScore component */}
      </div>
    </div>
  );
};

export default VideoDetails;
