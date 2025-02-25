// import React, { useState } from "react";
// import { FaClipboardList, FaPen, FaQuestionCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import videoService from "../AserverAuth/config";
// import { startChatWithMessage } from "../lib/geminiHelperFunc";
// import ToastNotification from "../components/toastNotification/ToastNotification";

// const CurrentScore = ({ data }) => {
//   const [scores, setScores] = useState({
//     mcqScore: null,
//     fillInTheBlanksScore: null,
//     shortQuestionsScore: null,
//     quizTaken: [],
//     overallScore: null,
//   });
//   const [buttonState, setButtonState] = useState("default"); // 'default', 'loading', 'calculating'

//   // Helper function to determine text color based on score
//   const getScoreColor = (score) => {
//     return score < 50 ? "text-red-600" : "text-green-600";
//   };

//   const handleGetScores = async () => {
//     setButtonState("loading"); // Start loading
//     try {
//       const response = await videoService.getScore(data);
//       if (!response.data.scoreIsEvaluated) {
//         setButtonState("calculating"); // Show 'Calculating...' for 3 seconds

//         const prompt = response.data.shortAnswers.map((q, index) => 
//           `Q${index + 1}: ${q.question}
//           User Answer: ${q.givenAnswer}
//           Evaluate the user's answer based on your knowledge and provide a score out of 2. 
//           Format your response as: 
//           Q${index + 1}: Score: <score>/2, Evaluation: <brief evaluation>`
//         ).join("\n\n");
        
//         // Send a single request with all questions
//         const aiResponse = await startChatWithMessage([prompt]);
        
//         // Extract scores and evaluations from AI response
//         const shortAnswersWithScores = response.data.shortAnswers.map((q, index) => {
//           const scoreRegex = new RegExp(`Q${index + 1}: Score: (\\d+)/2, Evaluation: (.+)`);
//           const match = aiResponse.match(scoreRegex);
        
//           if (match) {
//             const score = parseInt(match[1], 10); // Extract the score
//             const evaluation = match[2]; // Extract the evaluation
//             return { 
//               ...q, 
//               score, 
//               evaluation 
//             };
//           } else {
//             // Default to 0 if no score is found
//             return { 
//               ...q, 
//               score: 0, 
//               evaluation: "No evaluation provided by AI." 
//             };
//           }
//         });
        
//         // Calculate total score
//         const totalScore = shortAnswersWithScores.reduce((sum, q) => sum + q.score, 0);
        
//         const updatedResponse = {
//           ...response.data,
//           shortAnswers: shortAnswersWithScores,
//           totalScore, // Add total score to the response
//         };
        
//         // Calculate scores based on the updated response
//         const { shortAnswers, mcqs, fillInTheBlanks, overallScore } = updatedResponse;
//         const quizTaken = [
//           ...shortAnswers.map((q) => ({
//             question: q.question,
//             userAnswer: q.givenAnswer,
//             correctAnswer: q.correctAnswer,
//             type: 'shortAnswer',
//             isCorrect: q.isCorrect,
//             evaluation: q.evaluation, // Add the evaluation field
//           })),
//           ...mcqs.map((q) => ({
//             question: q.question,
//             userAnswer: q.selectedOption,
//             correctAnswer: q.correctOption,
//             type: 'mcq',
//             isCorrect: q.isCorrect,
//           })),
//           ...fillInTheBlanks.map((q) => ({
//             question: q.sentence,
//             userAnswer: q.givenAnswer,
//             correctAnswer: q.correctAnswer,
//             type: 'fillInTheBlank',
//             isCorrect: q.givenAnswer === q.correctAnswer,
//           })),
//         ];

//         setScores({
//           mcqScore: calculatePercentage(mcqs.filter((q) => q.isCorrect).length, mcqs.length),
//           fillInTheBlanksScore: calculatePercentage(
//             fillInTheBlanks.filter((q) => q.givenAnswer === q.correctAnswer).length,
//             fillInTheBlanks.length
//           ),
//           shortQuestionsScore: calculatePercentage(
//             shortAnswers.filter((q) => q.isCorrect).length,
//             shortAnswers.length
//           ),
//           quizTaken,
//           overallScore: totalScore,
//         });

//         return; // Exit function early
//       }

//       const { shortAnswers, mcqs, fillInTheBlanks, overallScore } = response.data;
//       const quizTaken = [
//         ...shortAnswers.map((q) => ({
//           question: q.question,
//           userAnswer: q.givenAnswer,
//           correctAnswer: q.correctAnswer,
//           type: 'shortAnswer',
//           isCorrect: q.givenAnswer === q.correctAnswer,
//         })),
//         ...mcqs.map((q) => ({
//           question: q.question,
//           userAnswer: q.selectedOption,
//           correctAnswer: q.correctOption,
//           type: 'mcq',
//           isCorrect: q.isCorrect,
//         })),
//         ...fillInTheBlanks.map((q) => ({
//           question: q.sentence,
//           userAnswer: q.givenAnswer,
//           correctAnswer: q.correctAnswer,
//           type: 'fillInTheBlank',
//           isCorrect: q.givenAnswer === q.correctAnswer,
//         })),
//       ];

//       setScores({
//         mcqScore: calculatePercentage(mcqs.filter((q) => q.isCorrect).length, mcqs.length),
//         fillInTheBlanksScore: calculatePercentage(
//           fillInTheBlanks.filter((q) => q.givenAnswer === q.correctAnswer).length,
//           fillInTheBlanks.length
//         ),
//         shortQuestionsScore: calculatePercentage(
//           shortAnswers.filter((q) => q.givenAnswer === q.correctAnswer).length,
//           shortAnswers.length
//         ),
//         quizTaken,
//         overallScore,
//       });
//     } catch (error) {
//       console.error("Error fetching scores:", error);

//     } finally {
//       if (buttonState !== "calculating") {
//         setButtonState("default"); // Reset only if it's not already in 'calculating' state
//       }
//     }
//   };

//   const calculatePercentage = (correct, total) => {
//     return total === 0 ? 0 : ((correct / total) * 100).toFixed(2);
//   };

//   // Group questions by type
//   const groupedQuestions = scores.quizTaken.reduce((acc, question) => {
//     if (!acc[question.type]) {
//       acc[question.type] = [];
//     }
//     acc[question.type].push(question);
//     return acc;
//   }, {});

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">Your Current Scores</h2>

//       <div className="space-y-6">
//         {scores.mcqScore === null ? (
//           <p className="text-lg text-gray-700 text-center mb-4">
//             Click the button below to fetch your current scores.
//           </p>
//         ) : (
//           <>
//             {/* MCQ Score */}
//             <div className="flex items-center space-x-3">
//               <FaClipboardList className="text-indigo-600 text-3xl" />
//               <p className="text-xl font-semibold">
//                 MCQ Score: <span className={`font-bold ${getScoreColor(scores.mcqScore)}`}>{scores.mcqScore}%</span>
//               </p>
//             </div>

//             {/* Fill-in-the-Blanks Score */}
//             <div className="flex items-center space-x-3">
//               <FaPen className="text-indigo-600 text-3xl" />
//               <p className="text-xl font-semibold">
//                 Fill-in-the-Blanks Score: <span className={`font-bold ${getScoreColor(scores.fillInTheBlanksScore)}`}>{scores.fillInTheBlanksScore}%</span>
//               </p>
//             </div>

//             {/* Short Questions Score */}
//             <div className="flex items-center space-x-3">
//               <FaQuestionCircle className="text-indigo-600 text-3xl" />
//               <p className="text-xl font-semibold">
//                 Short Questions Score: <span className={`font-bold ${getScoreColor(scores.shortQuestionsScore)}`}>{scores.shortQuestionsScore}%</span>
//               </p>
//             </div>

//             {/* Overall Score */}
//             <div className="flex items-center space-x-3">
//               <FaQuestionCircle className="text-indigo-600 text-3xl" />
//               <p className="text-xl font-semibold">
//                 Overall Score: <span className={`font-bold ${getScoreColor(scores.overallScore)}`}>{scores.overallScore}%</span>
//               </p>
//             </div>

//             {/* Display All Questions Grouped by Type */}
//             <div className="mt-8">
//               <h3 className="text-2xl font-bold text-indigo-600 mb-4">All Questions</h3>

//               {/* MCQs Section */}
//               {groupedQuestions.mcq && (
//                 <div className="mb-8">
//                   <h4 className="text-xl font-semibold text-indigo-500 mb-4">MCQs</h4>
//                   {groupedQuestions.mcq.map((q, index) => (
//                     <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
//                       <div className="flex items-center space-x-2">
//                         {q.isCorrect ? (
//                           <FaCheckCircle className="text-green-500 text-xl" />
//                         ) : (
//                           <FaTimesCircle className="text-red-500 text-xl" />
//                         )}
//                         <p className="text-lg font-semibold text-gray-800">{q.question}</p>
//                       </div>
//                       <div className="ml-8">
//                         <p className="text-gray-600">
//                           <span className="font-medium">Your Answer:</span> {q.userAnswer}
//                         </p>
//                         <p className="text-gray-600">
//                           <span className="font-medium">Correct Answer:</span> {q.correctAnswer}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Short Questions Section */}
//               {groupedQuestions.shortAnswer && (
//                 <div className="mb-8">
//                   <h4 className="text-xl font-semibold text-indigo-500 mb-4">Short Questions</h4>
//                   {groupedQuestions.shortAnswer.map((q, index) => (
//                     <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
//                       <div className="flex items-center space-x-2">
//                         {q.isCorrect ? (
//                           <FaCheckCircle className="text-green-500 text-xl" />
//                         ) : (
//                           <FaTimesCircle className="text-red-500 text-xl" />
//                         )}
//                         <p className="text-lg font-semibold text-gray-800">{q.question}</p>
//                       </div>
//                       <div className="ml-8">
//                         <p className="text-gray-600">
//                           <span className="font-medium">Your Answer:</span> {q.userAnswer}
//                         </p>
//                         <p className="text-gray-600">
//                           <span className="font-medium">Correct Answer:</span> {q.correctAnswer}
//                         </p>
//                         {/* Add the evaluation line */}
//                         <p className="text-gray-600">
//                           <span className="font-medium">Evaluation:</span> {q.evaluation}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Fill-in-the-Blanks Section */}
//               {groupedQuestions.fillInTheBlank && (
//                 <div className="mb-8">
//                   <h4 className="text-xl font-semibold text-indigo-500 mb-4">Fill-in-the-Blanks</h4>
//                   {groupedQuestions.fillInTheBlank.map((q, index) => (
//                     <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
//                       <div className="flex items-center space-x-2">
//                         {q.isCorrect ? (
//                           <FaCheckCircle className="text-green-500 text-xl" />
//                         ) : (
//                           <FaTimesCircle className="text-red-500 text-xl" />
//                         )}
//                         <p className="text-lg font-semibold text-gray-800">{q.question}</p>
//                       </div>
//                       <div className="ml-8">
//                         <p className="text-gray-600">
//                           <span className="font-medium">Your Answer:</span> {q.userAnswer}
//                         </p>
//                         <p className="text-gray-600">
//                           <span className="font-medium">Correct Answer:</span> {q.correctAnswer}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       <div className="mt-8 text-center">
//         <button
//           onClick={handleGetScores}
//           disabled={buttonState !== "default"}
//           className="px-8 py-4 font-medium text-white bg-blue-500 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {buttonState === "loading"
//             ? "Fetching Scores..."
//             : buttonState === "calculating"
//             ? "Calculating..."
//             : "Get Current Scores"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CurrentScore;






















import React, { useState } from "react";
import { FaClipboardList, FaPen, FaQuestionCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import videoService from "../AserverAuth/config";
import { startChatWithMessage } from "../lib/geminiHelperFunc";
import ToastNotification from "../components/toastNotification/ToastNotification";

const CurrentScore = ({ data }) => {
  const [scores, setScores] = useState({
    mcqScore: null,
    fillInTheBlanksScore: null,
    shortQuestionsScore: null,
    quizTaken: [],
    overallScore: null,
  });
  const [buttonState, setButtonState] = useState("default"); // 'default', 'loading', 'calculating'
  const [errorMessage, setErrorMessage] = useState(null); // State for error handling

  // Helper function to determine text color based on score
  const getScoreColor = (score) => {
    return score < 50 ? "text-red-600" : "text-green-600";
  };

  const handleGetScores = async () => {
    setButtonState("loading"); // Start loading
    setErrorMessage(null); // Clear any previous error message
    try {
      const response = await videoService.getScore(data);
      // console.log("the repsonse was:", response)
      if (!response.data.scoreIsEvaluated) {
        setButtonState("calculating"); // Show 'Calculating...' for 3 seconds

        const prompt = response.data.shortAnswers.map((q, index) => 
          `Q${index + 1}: ${q.question}
          User Answer: ${q.givenAnswer}
          Evaluate the user's answer based on your knowledge and provide a score out of 2. 
          Format your response as: 
          Q${index + 1}: Score: <score>/2, Evaluation: <brief evaluation>`
        ).join("\n\n");
        
        // Send a single request with all questions
        const aiResponse = await startChatWithMessage([prompt]);
        
        // Extract scores and evaluations from AI response
        const shortAnswersWithScores = response.data.shortAnswers.map((q, index) => {
          const scoreRegex = new RegExp(`Q${index + 1}: Score: (\\d+)/2, Evaluation: (.+)`);
          const match = aiResponse.match(scoreRegex);
        
          if (match) {
            const score = parseInt(match[1], 10); // Extract the score
            const evaluation = match[2]; // Extract the evaluation
            return { 
              ...q, 
              score, 
              evaluation 
            };
          } else {
            // Default to 0 if no score is found
            return { 
              ...q, 
              score: 0, 
              evaluation: "No evaluation provided by AI." 
            };
          }
        });
        
        // Calculate total score
        const totalScore = shortAnswersWithScores.reduce((sum, q) => sum + q.score, 0);
        
        const updatedResponse = {
          ...response.data,
          shortAnswers: shortAnswersWithScores,
          totalScore, // Add total score to the response
        };
        
        // Calculate scores based on the updated response
        const { shortAnswers, mcqs, fillInTheBlanks, overallScore } = updatedResponse;
        const quizTaken = [
          ...shortAnswers.map((q) => ({
            question: q.question,
            userAnswer: q.givenAnswer,
            correctAnswer: q.correctAnswer,
            type: 'shortAnswer',
            isCorrect: q.isCorrect,
            evaluation: q.evaluation, // Add the evaluation field
          })),
          ...mcqs.map((q) => ({
            question: q.question,
            userAnswer: q.selectedOption,
            correctAnswer: q.correctOption,
            type: 'mcq',
            isCorrect: q.isCorrect,
          })),
          ...fillInTheBlanks.map((q) => ({
            question: q.sentence,
            userAnswer: q.givenAnswer,
            correctAnswer: q.correctAnswer,
            type: 'fillInTheBlank',
            isCorrect: q.givenAnswer === q.correctAnswer,
          })),
        ];

        setScores({
          mcqScore: calculatePercentage(mcqs.filter((q) => q.isCorrect).length, mcqs.length),
          fillInTheBlanksScore: calculatePercentage(
            fillInTheBlanks.filter((q) => q.givenAnswer === q.correctAnswer).length,
            fillInTheBlanks.length
          ),
          shortQuestionsScore: calculatePercentage(
            shortAnswers.filter((q) => q.isCorrect).length,
            shortAnswers.length
          ),
          quizTaken,
          overallScore: totalScore,
        });

        return; // Exit function early
      }

      const { shortAnswers, mcqs, fillInTheBlanks, overallScore } = response.data;
      const quizTaken = [
        ...shortAnswers.map((q) => ({
          question: q.question,
          userAnswer: q.givenAnswer,
          correctAnswer: q.correctAnswer,
          type: 'shortAnswer',
          isCorrect: q.givenAnswer === q.correctAnswer,
        })),
        ...mcqs.map((q) => ({
          question: q.question,
          userAnswer: q.selectedOption,
          correctAnswer: q.correctOption,
          type: 'mcq',
          isCorrect: q.isCorrect,
        })),
        ...fillInTheBlanks.map((q) => ({
          question: q.sentence,
          userAnswer: q.givenAnswer,
          correctAnswer: q.correctAnswer,
          type: 'fillInTheBlank',
          isCorrect: q.givenAnswer === q.correctAnswer,
        })),
      ];

      setScores({
        mcqScore: calculatePercentage(mcqs.filter((q) => q.isCorrect).length, mcqs.length),
        fillInTheBlanksScore: calculatePercentage(
          fillInTheBlanks.filter((q) => q.givenAnswer === q.correctAnswer).length,
          fillInTheBlanks.length
        ),
        shortQuestionsScore: calculatePercentage(
          shortAnswers.filter((q) => q.givenAnswer === q.correctAnswer).length,
          shortAnswers.length
        ),
        quizTaken,
        overallScore,
      });
    } catch (error) {
      // console.log("Error fetching scores:", error);
      setErrorMessage("Error getting quiz score. Please submit a quiz or try later."); // Set error message
    } finally {
      if (buttonState !== "calculating") {
        setButtonState("default"); // Reset only if it's not already in 'calculating' state
      }
    }
  };

  const calculatePercentage = (correct, total) => {
    return total === 0 ? 0 : ((correct / total) * 100).toFixed(2);
  };

  // Group questions by type
  const groupedQuestions = scores.quizTaken.reduce((acc, question) => {
    if (!acc[question.type]) {
      acc[question.type] = [];
    }
    acc[question.type].push(question);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">Your Current Scores</h2>

      {/* Display Error Toast Notification */}
      {errorMessage && (
        <ToastNotification
          message={errorMessage}
          isSuccess= {false}
          onClose={() => setErrorMessage(null)} // Clear error message on close
        />
      )}

      <div className="space-y-6">
        {scores.mcqScore === null ? (
          <p className="text-lg text-gray-700 text-center mb-4">
            Click the button below to fetch your current scores.
          </p>
        ) : (
          <>
            {/* MCQ Score */}
            <div className="flex items-center space-x-3">
              <FaClipboardList className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold">
                MCQ Score: <span className={`font-bold ${getScoreColor(scores.mcqScore)}`}>{scores.mcqScore}%</span>
              </p>
            </div>

            {/* Fill-in-the-Blanks Score */}
            <div className="flex items-center space-x-3">
              <FaPen className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold">
                Fill-in-the-Blanks Score: <span className={`font-bold ${getScoreColor(scores.fillInTheBlanksScore)}`}>{scores.fillInTheBlanksScore}%</span>
              </p>
            </div>

            {/* Short Questions Score */}
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold">
                Short Questions Score: <span className={`font-bold ${getScoreColor(scores.shortQuestionsScore)}`}>{scores.shortQuestionsScore}%</span>
              </p>
            </div>

            {/* Overall Score */}
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold">
                Overall Score: <span className={`font-bold ${getScoreColor(scores.overallScore)}`}>{scores.overallScore}%</span>
              </p>
            </div>

            {/* Display All Questions Grouped by Type */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">All Questions</h3>

              {/* MCQs Section */}
              {groupedQuestions.mcq && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-indigo-500 mb-4">MCQs</h4>
                  {groupedQuestions.mcq.map((q, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        {q.isCorrect ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-xl" />
                        )}
                        <p className="text-lg font-semibold text-gray-800">{q.question}</p>
                      </div>
                      <div className="ml-8">
                        <p className="text-gray-600">
                          <span className="font-medium">Your Answer:</span> {q.userAnswer}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Correct Answer:</span> {q.correctAnswer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Short Questions Section */}
              {groupedQuestions.shortAnswer && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-indigo-500 mb-4">Short Questions</h4>
                  {groupedQuestions.shortAnswer.map((q, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        {q.isCorrect ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-xl" />
                        )}
                        <p className="text-lg font-semibold text-gray-800">{q.question}</p>
                      </div>
                      <div className="ml-8">
                        <p className="text-gray-600">
                          <span className="font-medium">Your Answer:</span> {q.userAnswer}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Correct Answer:</span> {q.correctAnswer}
                        </p>
                        {/* Add the evaluation line */}
                        <p className="text-gray-600">
                          <span className="font-medium">Evaluation:</span> {q.evaluation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fill-in-the-Blanks Section */}
              {groupedQuestions.fillInTheBlank && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-indigo-500 mb-4">Fill-in-the-Blanks</h4>
                  {groupedQuestions.fillInTheBlank.map((q, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        {q.isCorrect ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-xl" />
                        )}
                        <p className="text-lg font-semibold text-gray-800">{q.question}</p>
                      </div>
                      <div className="ml-8">
                        <p className="text-gray-600">
                          <span className="font-medium">Your Answer:</span> {q.userAnswer}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Correct Answer:</span> {q.correctAnswer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleGetScores}
          disabled={buttonState !== "default"}
          className="px-8 py-4 font-medium text-white bg-blue-500 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonState === "loading"
            ? "Fetching Scores..."
            : buttonState === "calculating"
            ? "Calculating..."
            : "Get Current Scores"}
        </button>
      </div>
    </div>
  );
};

export default CurrentScore;