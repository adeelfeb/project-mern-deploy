import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveQuizResponse } from "../store/currentVideoSlice";
import ToastNotification from "../components/toastNotification/ToastNotification";
import videoService from "../AserverAuth/config";

const Quiz = ({ data }) => {
  const dispatch = useDispatch();
  
  if (!data) {
    return <p className="text-center text-gray-500">Loading quiz...</p>;
  }

  console.log("Quiz data received:", data);

  // Destructure directly from data
  const { shortQuestions = [], mcqs = [], fillInTheBlanks = [] } = data.qnas;

  const [responses, setResponses] = useState({
    shortAnswers: {},
    mcqAnswers: {},
    fillInTheBlanks: {},
  });

  // Handle Short Answer Change
  const handleShortAnswerChange = (index, value) => {
    setResponses((prev) => ({
      ...prev,
      shortAnswers: { ...prev.shortAnswers, [index]: value },
    }));
  };

  // Handle MCQ Change
  const handleMCQAnswerChange = (index, value) => {
    setResponses((prev) => ({
      ...prev,
      mcqAnswers: { ...prev.mcqAnswers, [index]: value },
    }));
  };

  // Handle Fill-in-the-Blanks Change
  const handleFillBlankChange = (index, value) => {
    setResponses((prev) => ({
      ...prev,
      fillInTheBlanks: { ...prev.fillInTheBlanks, [index]: value },
    }));
  };

  const handleSubmit = async() => {
    // Save responses to Redux
    const response = await VideoService.submitQuiz(videoId, responses)
    dispatch(saveQuizResponse(responses));

    // Mock submission to a backend API
    alert("Quiz responses saved!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mx-auto mb-8">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Take the Quiz!
      </h2>

      {/* If no quiz data is available */}
      {shortQuestions.length === 0 && mcqs.length === 0 && fillInTheBlanks.length === 0 ? (
        <p className="text-center text-gray-500">No quiz available.</p>
      ) : (
        <>
          {/* Short Questions */}
          {shortQuestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Short Questions
              </h3>
              {shortQuestions.map((q, index) => (
                <div key={q._id} className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Q:</strong> {q.question}
                  </p>
                  <input
                    type="text"
                    placeholder="Your answer"
                    className="w-full p-2 border rounded-md"
                    value={responses.shortAnswers[index] || ""}
                    onChange={(e) => handleShortAnswerChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* MCQs */}
          {mcqs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">MCQs</h3>
              {mcqs.map((mcq, index) => (
                <div key={mcq._id} className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Q:</strong> {mcq.question}
                  </p>
                  <ul>
                    {mcq.options.map((option, i) => (
                      <li key={i} className="mb-2">
                        <label>
                          <input
                            type="radio"
                            name={`mcq-${index}`}
                            value={option}
                            checked={responses.mcqAnswers[index] === option}
                            onChange={() => handleMCQAnswerChange(index, option)}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Fill in the Blanks */}
          {fillInTheBlanks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Fill in the Blanks
              </h3>
              {fillInTheBlanks.map((q, index) => (
                <div key={q._id} className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Q:</strong> {q.question.replace("___", "_____")}
                  </p>
                  <input
                    type="text"
                    placeholder="Your answer"
                    className="w-full p-2 border rounded-md"
                    value={responses.fillInTheBlanks[index] || ""}
                    onChange={(e) => handleFillBlankChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700 transition w-full text-center"
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default Quiz;
