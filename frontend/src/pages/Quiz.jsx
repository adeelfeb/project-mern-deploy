import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveQuizResponse } from "../store/currentVideoSlice";
import ToastNotification from "../components/toastNotification/ToastNotification";
import videoService from "../AserverAuth/config";





const Quiz = ({ data}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});

  if (!data) {
    return <p className="text-center text-gray-500">Loading quiz...</p>;
  }

  // console.log("Video Id in Quiz component:", data.videoId); // Log videoId for debugging

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
    setErrors((prev) => ({ ...prev, [`short-${index}`]: "" }));
  };

  // Handle MCQ Change
  const handleMCQAnswerChange = (index, value) => {
    setResponses((prev) => ({
      ...prev,
      mcqAnswers: { ...prev.mcqAnswers, [index]: value },
    }));
    setErrors((prev) => ({ ...prev, [`mcq-${index}`]: "" }));
  };

  // Handle Fill-in-the-Blanks Change
  const handleFillBlankChange = (index, value) => {
    setResponses((prev) => ({
      ...prev,
      fillInTheBlanks: { ...prev.fillInTheBlanks, [index]: value },
    }));
    setErrors((prev) => ({ ...prev, [`fill-${index}`]: "" }));
  };

  // Validate Responses Before Submission
  const validateResponses = () => {
    let newErrors = {};

    // Check short questions
    shortQuestions.forEach((_, index) => {
      if (!responses.shortAnswers[index]?.trim()) {
        newErrors[`short-${index}`] = "This field is required.";
      }
    });

    // Check MCQs
    mcqs.forEach((_, index) => {
      if (!responses.mcqAnswers[index]) {
        newErrors[`mcq-${index}`] = "Please select an option.";
      }
    });

    // Check fill-in-the-blanks
    fillInTheBlanks.forEach((_, index) => {
      if (!responses.fillInTheBlanks[index]?.trim()) {
        newErrors[`fill-${index}`] = "This field is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };



  const handleSubmit = async () => {
    if (!validateResponses()) return; // Stop if validation fails
  
    setIsSubmitting(true);
    try {
      // Transform responses to match backend format
      const formattedResponses = {
        shortAnswers: shortQuestions.map((q, index) => ({
          question: q.question,
          givenAnswer: responses.shortAnswers[index] || "",
        })),
        mcqAnswers: mcqs.map((q, index) => ({
          question: q.question,
          selectedOption: responses.mcqAnswers[index] || "",
        })),
        fillInTheBlanks: fillInTheBlanks.map((q, index) => ({
          question: q.question,
          givenAnswer: responses.fillInTheBlanks[index] || "",
        })),
      };
  
      // Submit quiz with formatted data
      await videoService.submitQuiz(data.videoId, formattedResponses);
      dispatch(saveQuizResponse(formattedResponses));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mx-auto mb-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Take the Quiz!
      </h2>

      {shortQuestions.length === 0 && mcqs.length === 0 && fillInTheBlanks.length === 0 ? (
        <p className="text-center text-gray-500">No quiz available.</p>
      ) : (
        <>
          {/* Short Questions */}
          {shortQuestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Short Questions</h3>
              {shortQuestions.map((q, index) => (
                <div key={q._id} className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Q:</strong> {q.question}
                  </p>
                  <input
                    type="text"
                    placeholder="Your answer"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    value={responses.shortAnswers[index] || ""}
                    onChange={(e) => handleShortAnswerChange(index, e.target.value)}
                  />
                  {errors[`short-${index}`] && <p className="text-red-500 text-sm">{errors[`short-${index}`]}</p>}
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
                        <label className="flex items-center">
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
                  {errors[`mcq-${index}`] && <p className="text-red-500 text-sm">{errors[`mcq-${index}`]}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Fill in the Blanks */}
          {fillInTheBlanks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Fill in the Blanks</h3>
              {fillInTheBlanks.map((q, index) => (
                <div key={q._id} className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Q:</strong> {q.question.replace("___", "_____")}
                  </p>
                  <input
                    type="text"
                    placeholder="Your answer"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    value={responses.fillInTheBlanks[index] || ""}
                    onChange={(e) => handleFillBlankChange(index, e.target.value)}
                  />
                  {errors[`fill-${index}`] && <p className="text-red-500 text-sm">{errors[`fill-${index}`]}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700 transition w-full disabled:bg-blue-300"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </>
      )}

      {/* Toast Notification */}
      {showToast && <ToastNotification message="Quiz submitted successfully!" type="success" />}
    </div>
  );
};

export default Quiz;