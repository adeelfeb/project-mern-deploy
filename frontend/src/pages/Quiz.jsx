import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveQuizResponse } from "../store/currentVideoSlice";
import ToastNotification from "../components/toastNotification/ToastNotification";
import videoService from "../AserverAuth/config";
import { formatProdErrorMessage } from "@reduxjs/toolkit";

const Quiz = ({ data }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});

  // Default empty structure for qnas
  const defaultQnas = {
    mcqs: [],
    shortQuestions: [],
    fillInTheBlanks: [],
  };

  // console.log("the recieved quiz:", data)

  // Ensure qnas is always an object with the expected structure
  const { mcqs = [], shortQuestions = [], fillInTheBlanks = [] } = data?.qnas || defaultQnas;
  // const videoId = data.videoId
  // console.log("the video id inside the quize compoent is:", videoId)

  // State to store responses
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

  // Handle Quiz Submission
  // const handleSubmit = async () => {
  //   if (!validateResponses()) return; // Stop if validation fails
  
  //   setIsSubmitting(true);
  //   try {
  //     // Transform responses to match backend format
  //     const formattedResponses = {
  //       shortAnswers: shortQuestions.map((q, index) => ({
  //         question: q.question,
  //         givenAnswer: responses.shortAnswers[index] || "",
  //       })),
  //       mcqAnswers: mcqs.map((q, index) => ({
  //         question: q.question,
  //         selectedOption: responses.mcqAnswers[index] || "",
  //         correctAnswer: q.correctAnswer,
  //         options: q.options, // Include the options for MCQs
  //       })),
  //       fillInTheBlanks: fillInTheBlanks.map((q, index) => ({
  //         question: q.sentence || q.question, // Handle both formats
  //         givenAnswer: responses.fillInTheBlanks[index] || "",
  //         missingWord: q.missingWord, // Include the missing word for fill-in-the-blanks
  //       })),
  //     };
  
  //     // Submit quiz with formatted data
      
  //     // console.log("Orignal quiz is:", mcqs, shortQuestions, fillInTheBlanks)
  //     // console.log("Formated quiz is:", formattedResponses)
  //     const tempResponse = await videoService.submitQuiz(data.videoId, formattedResponses);
  
  //     // Check the API response status
  //     if (tempResponse.data.status === 201) {
  //       dispatch(saveQuizResponse(formattedResponses));
  //       setShowToast({ message: "Quiz submitted successfully!", type: "success" }); // Success toast
  //     } else {
  //       setShowToast({ message: "Failed to submit quiz. Please try again.", type: "error" }); // Error toast
  //     }
  //   } catch (error) {
  //     console.error("Error submitting quiz:", error);
  //     setShowToast({ message: "An error occurred while submitting the quiz. Please try again.", type: "error" }); // Error toast for unexpected errors
  //   } finally {
  //     setIsSubmitting(false);
  //     setTimeout(() => setShowToast(null), 3000); // Clear toast after 3 seconds
  //   }
  // };


  const handleSubmit = async () => {
    if (!validateResponses()) return; // Stop if validation fails
  
    setIsSubmitting(true);
    try {
      // Transform responses to match backend format
      const formattedResponses = {
        shortAnswers: shortQuestions.map((q, index) => ({
          question: q.question,
          givenAnswer: responses.shortAnswers[index] || "",
          correctAnswer: q.answer, // Include the correct answer for short questions
        })),
        mcqAnswers: mcqs.map((q, index) => ({
          question: q.question,
          selectedOption: responses.mcqAnswers[index] || "",
          correctAnswer: q.correctAnswer, // Include the correct answer for MCQs
          options: q.options, // Include the options for MCQs
        })),
        fillInTheBlanks: fillInTheBlanks.map((q, index) => ({
          question: q.sentence || q.question, // Handle both formats
          givenAnswer: responses.fillInTheBlanks[index] || "",
          correctAnswer: q.missingWord, // Include the missing word for fill-in-the-blanks
        })),
      };
  
      // Submit quiz with formatted data
      const tempResponse = await videoService.submitQuiz(data.videoId, formattedResponses);
  
      // Check the API response status
      if (tempResponse.data.status === 201) {
        dispatch(saveQuizResponse(formattedResponses));
        setShowToast({ message: "Quiz submitted successfully!", type: "success" }); // Success toast
      } else {
        setShowToast({ message: "Failed to submit quiz. Please try again.", type: "error" }); // Error toast
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setShowToast({ message: "An error occurred while submitting the quiz. Please try again.", type: "error" }); // Error toast for unexpected errors
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowToast(null), 3000); // Clear toast after 3 seconds
    }
  };




  return (
    <div className="p-6 mb-8 bg-white rounded-lg shadow-lg mx-auto mb-8 max-w-2xl h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Take the Quiz!
      </h2>

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
      {showToast && (
        <ToastNotification message={showToast.message} type={showToast.type} />
      )}
    </div>
  );
};

export default Quiz;