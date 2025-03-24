import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveQuizResponse } from "../store/currentVideoSlice";
import ToastNotification from "../components/toastNotification/ToastNotification";
import videoService from "../AserverAuth/config";

const Quiz = ({ data }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false); // Track quiz submission


  // console.log("the data received in the quiz component is:", data)
  // Input length limits
  const SHORT_ANSWER_MAX_LENGTH = 200; // Limit for short answers
  const FILL_IN_BLANK_MAX_LENGTH = 50; // Limit for fill-in-the-blanks

  // Default empty structure for qnas
  const defaultQnas = {
    mcqs: [],
    shortQuestions: [],
    fillInTheBlanks: [],
  };

  // Ensure qnas is always an object with the expected structure
  const { mcqs = [], shortQuestions = [], fillInTheBlanks = [] } = data?.qnas || defaultQnas;

  // State to store responses
  const [responses, setResponses] = useState({
    shortAnswers: {},
    mcqAnswers: {},
    fillInTheBlanks: {},
  });

  // Handle Short Answer Change
  const handleShortAnswerChange = (index, value) => {
    if (value.length <= SHORT_ANSWER_MAX_LENGTH) {
      setResponses((prev) => ({
        ...prev,
        shortAnswers: { ...prev.shortAnswers, [index]: value },
      }));
      setErrors((prev) => ({ ...prev, [`short-${index}`]: "" }));
    }
  };

  // Handle Fill-in-the-Blanks Change
  const handleFillBlankChange = (index, value) => {
    if (value.length <= FILL_IN_BLANK_MAX_LENGTH) {
      setResponses((prev) => ({
        ...prev,
        fillInTheBlanks: { ...prev.fillInTheBlanks, [index]: value },
      }));
      setErrors((prev) => ({ ...prev, [`fill-${index}`]: "" }));
    }
  };

  // Handle MCQ Change
  const handleMCQAnswerChange = (index, value) => {
    setResponses((prev) => ({
      ...prev,
      mcqAnswers: { ...prev.mcqAnswers, [index]: value },
    }));
    setErrors((prev) => ({ ...prev, [`mcq-${index}`]: "" }));
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

  // Handle Quiz Submission
  const handleSubmit = async () => {
    if (!validateResponses()) return; // Stop if validation fails

    setIsSubmitting(true);
    try {
      // Transform responses to match backend format
      const formattedResponses = {
        shortAnswers: shortQuestions.map((q, index) => ({
          question: q.question,
          givenAnswer: responses.shortAnswers[index] || "",
          correctAnswer: q.answer || q.correctAnswer,
        })),
        mcqAnswers: mcqs.map((q, index) => ({
          question: q.question,
          selectedOption: responses.mcqAnswers[index] || "",
          correctAnswer: q.correctAnswer || q.correctOption,
          options: q.options,
        })),
        fillInTheBlanks: fillInTheBlanks.map((q, index) => ({
          question: q.sentence || q.question,
          givenAnswer: responses.fillInTheBlanks[index] || "",
          correctAnswer: q.missingWord || q.correctAnswer,
        })),
      };


      // Submit quiz with formatted data
      const tempResponse = await videoService.submitQuiz(data.videoId, formattedResponses);

      // Check the API response status
      if (tempResponse.data.status === 201) {
        dispatch(saveQuizResponse(formattedResponses));
        setShowToast({ message: "Quiz submitted successfully!", type: "success" });
        setIsQuizSubmitted(true); // Mark quiz as submitted
      } else {
        setShowToast({ message: "Failed to submit quiz. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setShowToast({ message: "An error occurred while submitting the quiz. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowToast(null), 3000); // Clear toast after 3 seconds
    }
  };

   // If the status is 269, show a message that the quiz has already been submitted
   if (data?.status === 269) {
    return (
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg mx-auto mb-8 max-w-2xl h-[calc(100vh-100px)] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Quiz Already Submitted
        </h2>
        <p className="text-center text-gray-600">
          You have already submitted this quiz. You cannot retake it.
          
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8 bg-white rounded-lg shadow-lg mx-auto mb-8 max-w-2xl h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Take the Quiz!
      </h2>

      {isQuizSubmitted ? (
        // Show this component after quiz submission
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Quiz has been submitted. Please check your score by clicking Current Score button.
          </p>
        </div>
      ) : (
        // Show the quiz form if not submitted
        <>
          {mcqs.length === 0 && shortQuestions.length === 0 && fillInTheBlanks.length === 0 ? (
            <p className="text-center text-gray-500">No quiz available.</p>
          ) : (
            <>
              {/* Short Questions */}
              {shortQuestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Short Questions</h3>
                  {shortQuestions.map((q, index) => (
                    <div key={q._id || index} className="mb-4">
                      <p className="text-gray-700 mb-2">
                        <strong>Q{index + 1}:</strong> {q.question}
                      </p>
                      <input
                        type="text"
                        placeholder="Your answer"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={responses.shortAnswers[index] || ""}
                        onChange={(e) => handleShortAnswerChange(index, e.target.value)}
                        maxLength={SHORT_ANSWER_MAX_LENGTH} // Set max length
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {responses.shortAnswers[index]?.length || 0}/{SHORT_ANSWER_MAX_LENGTH} characters
                      </p>
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
                    <div key={mcq._id || index} className="mb-4">
                      <p className="text-gray-700 mb-2">
                        <strong>Q{index + 1}:</strong> {mcq.question}
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

              {/* Fill-in-the-Blanks */}
              {fillInTheBlanks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Fill in the Blanks</h3>
                  {fillInTheBlanks.map((q, index) => (
                    <div key={q?._id || index} className="mb-4">
                      <p className="text-gray-700 mb-2">
                        <strong>Q{index + 1}:</strong> {q.sentence || q.question}
                      </p>
                      <input
                        type="text"
                        placeholder="Your answer"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={responses.fillInTheBlanks[index] || ""}
                        onChange={(e) => handleFillBlankChange(index, e.target.value)}
                        maxLength={FILL_IN_BLANK_MAX_LENGTH} // Set max length
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {responses.fillInTheBlanks[index]?.length || 0}/{FILL_IN_BLANK_MAX_LENGTH} characters
                      </p>
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
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <ToastNotification message={showToast.message} type={showToast.type} />
      )}
    </div>
  );
};

export default Quiz;