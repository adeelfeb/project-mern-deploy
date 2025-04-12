// src/components/AdminQuizView.jsx
import React from 'react';

const AdminQuizView = ({ data }) => {
  // Default empty structure for qnas
  const defaultQnas = {
    mcqs: [],
    shortQuestions: [],
    fillInTheBlanks: [],
  };

  // Ensure qnas is always an object with the expected structure
  const { mcqs = [], shortQuestions = [], fillInTheBlanks = [] } = data?.qnas || defaultQnas;

  const hasQuestions = mcqs.length > 0 || shortQuestions.length > 0 || fillInTheBlanks.length > 0;

  // Function to generate text for copying
  const generateQuizText = () => {
    let text = `Quiz for Video ID: ${data?.videoId || 'N/A'}\n\n`;

    if (shortQuestions.length > 0) {
      text += "--- Short Questions ---\n";
      shortQuestions.forEach((q, index) => {
        text += `Q${index + 1}: ${q.question}\n`;
        text += `Answer: ${q.answer || q.correctAnswer || 'N/A'}\n\n`;
      });
    }

    if (mcqs.length > 0) {
      text += "--- MCQs ---\n";
      mcqs.forEach((q, index) => {
        text += `Q${index + 1}: ${q.question}\n`;
        q.options.forEach((opt, i) => {
          const isCorrect = opt === (q.correctAnswer || q.correctOption);
          text += `  ${String.fromCharCode(65 + i)}. ${opt}${isCorrect ? ' (Correct)' : ''}\n`;
        });
        text += "\n";
      });
    }

    if (fillInTheBlanks.length > 0) {
      text += "--- Fill in the Blanks ---\n";
      fillInTheBlanks.forEach((q, index) => {
        text += `Q${index + 1}: ${q.sentence || q.question}\n`;
        text += `Answer: ${q.missingWord || q.correctAnswer || 'N/A'}\n\n`;
      });
    }
    return text;
  };

  // Basic copy to clipboard function
  const handleCopy = async () => {
    if (!navigator.clipboard) {
        alert('Clipboard API not available in this browser/context.');
        return;
    }
    try {
      await navigator.clipboard.writeText(generateQuizText());
      alert('Quiz content copied to clipboard!'); // Simple feedback
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy quiz content.');
    }
  };

  return (
    <div className="p-6 mb-8 bg-indigo-50 rounded-lg shadow-md mx-auto mb-8 max-w-2xl h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
        Quiz Content (Admin View)
      </h2>
      <p className="text-center text-gray-600 mb-6">
        As an admin, you can view and copy the quiz content below.
      </p>

      {hasQuestions ? (
          <>
            {/* Button to copy content */}
            <div className="text-center mb-6">
                <button
                  onClick={handleCopy}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
                  disabled={!navigator.clipboard} // Disable if clipboard API not available
                >
                  Copy Quiz Content
                </button>
                 {!navigator.clipboard && <p className="text-xs text-red-500 mt-1">Copy requires HTTPS or localhost</p>}
            </div>

            {/* Short Questions */}
            {shortQuestions.length > 0 && (
              <div className="mb-6 p-4 border border-gray-200 rounded bg-white shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Short Questions</h3>
                {shortQuestions.map((q, index) => (
                  <div key={q._id || `sq-${index}`} className="mb-3 text-sm">
                    <p className="text-gray-700 mb-1">
                      <strong>Q{index + 1}:</strong> {q.question}
                    </p>
                    <p className="text-green-700 font-medium">
                      <strong>Answer:</strong> {q.answer || q.correctAnswer || <span className="text-gray-400 italic">N/A</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* MCQs */}
            {mcqs.length > 0 && (
              <div className="mb-6 p-4 border border-gray-200 rounded bg-white shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Multiple Choice Questions</h3>
                {mcqs.map((mcq, index) => (
                  <div key={mcq._id || `mcq-${index}`} className="mb-4 text-sm">
                    <p className="text-gray-700 mb-2">
                      <strong>Q{index + 1}:</strong> {mcq.question}
                    </p>
                    <ul className="list-none pl-4">
                      {mcq.options.map((option, i) => {
                        const isCorrect = option === (mcq.correctAnswer || mcq.correctOption);
                        return (
                          <li key={i} className={`mb-1 ${isCorrect ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>
                            {String.fromCharCode(65 + i)}. {option} {isCorrect && <span className="text-green-500 ml-1">(Correct)</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Fill-in-the-Blanks */}
            {fillInTheBlanks.length > 0 && (
              <div className="mb-6 p-4 border border-gray-200 rounded bg-white shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Fill in the Blanks</h3>
                {fillInTheBlanks.map((q, index) => (
                  <div key={q._id || `fib-${index}`} className="mb-3 text-sm">
                    <p className="text-gray-700 mb-1">
                      <strong>Q{index + 1}:</strong> {q.sentence || q.question}
                    </p>
                    <p className="text-green-700 font-medium">
                      <strong>Answer:</strong> {q.missingWord || q.correctAnswer || <span className="text-gray-400 italic">N/A</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">No quiz content available for this video.</p>
        )}

    </div>
  );
};

export default AdminQuizView;