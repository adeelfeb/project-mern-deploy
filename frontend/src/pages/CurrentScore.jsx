import React, { useState } from 'react';
import { FaClipboardList, FaPen, FaQuestionCircle } from 'react-icons/fa';
import videoService from '../AserverAuth/config';
import { startChatWithMessage } from '../lib/geminiHelperFunc';

const CurrentScore = ({ data }) => {
  const [scores, setScores] = useState({
    mcqScore: null,
    fillInTheBlanksScore: null,
    shortQuestionsScore: null,
    quizTaken: [],
    overallScore: null,
  });
  const [buttonState, setButtonState] = useState("default"); // 'default', 'loading', 'calculating'

  const handleGetScores = async () => {
    setButtonState("loading"); // Start loading
    try {
      const response = await videoService.getScore(data);
      if (!response.data.scoreIsEvaluated) {
        console.log("Generating score...");
        console.log("Score response:", response);
        setButtonState("calculating"); // Show 'Calculating...' for 3 seconds

        // Evaluate short answers using the chatbot
        const shortAnswersWithScores = await Promise.all(
          response.data.shortAnswers.map(async (q) => {
            const prompt = `Evaluate the following answer for the question: ${q.question}\nCorrect Answer: ${q.correctAnswer}\nUser Answer: ${q.givenAnswer}\nIs the user answer correct?`;
            const aiResponse = await startChatWithMessage(prompt);
            return {
              ...q,
              isCorrect: aiResponse.includes('correct'), // Assuming the AI response includes 'correct' if the answer is correct
            };
          })
        );

        const updatedResponse = {
          ...response.data,
          shortAnswers: shortAnswersWithScores,
        };

        // Calculate scores based on the updated response
        const { shortAnswers, mcqs, fillInTheBlanks, overallScore } = updatedResponse;
        const quizTaken = [
          ...shortAnswers.map((q) => ({
            question: q.question,
            userAnswer: q.givenAnswer,
            correctAnswer: q.correctAnswer,
            type: 'shortAnswer',
          })),
          ...mcqs.map((q) => ({
            question: q.question,
            userAnswer: q.selectedOption,
            correctAnswer: q.correctOption,
            type: 'mcq',
          })),
          ...fillInTheBlanks.map((q) => ({
            question: q.sentence,
            userAnswer: q.givenAnswer,
            correctAnswer: q.correctAnswer,
            type: 'fillInTheBlank',
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
          overallScore,
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
        })),
        ...mcqs.map((q) => ({
          question: q.question,
          userAnswer: q.selectedOption,
          correctAnswer: q.correctOption,
          type: 'mcq',
        })),
        ...fillInTheBlanks.map((q) => ({
          question: q.sentence,
          userAnswer: q.givenAnswer,
          correctAnswer: q.correctAnswer,
          type: 'fillInTheBlank',
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
      console.error("Error fetching scores:", error);
    } finally {
      if (buttonState !== "calculating") {
        setButtonState("default"); // Reset only if it's not already in 'calculating' state
      }
    }
  };

  const calculatePercentage = (correct, total) => {
    return total === 0 ? 0 : ((correct / total) * 100).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">Your Current Scores</h2>

      <div className="space-y-6">
        {scores.mcqScore === null ? (
          <p className="text-lg text-gray-700 text-center mb-4">
            Click the button below to fetch your current scores.
          </p>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <FaClipboardList className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold text-green-600">
                MCQ Score: <span className="font-bold">{scores.mcqScore}%</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaPen className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold text-green-600">
                Fill-in-the-Blanks Score: <span className="font-bold">{scores.fillInTheBlanksScore}%</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold text-green-600">
                Short Questions Score: <span className="font-bold">{scores.shortQuestionsScore}%</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-indigo-600 text-3xl" />
              <p className="text-xl font-semibold text-green-600">
                Overall Score: <span className="font-bold">{scores.overallScore}%</span>
              </p>
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