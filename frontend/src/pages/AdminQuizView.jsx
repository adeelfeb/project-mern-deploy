// import React, { useState } from 'react';
// import videoService from '../AserverAuth/config';
// import { startChatWithMessage } from "../lib/geminiHelperFunc";
// import transcriptFetchService from '../utils/transcriptFetch';
// import ApiService from '../AserverAuth/ApiService';

// const AdminQuizView = ({ data }) => {
//   // console.log("The admin quiz section contains the data:", data);

//   const [transcriptData, setTranscriptData] = useState(null);
//   const [qnaData, setQnaData] = useState(data?.qnas || null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [regenerateStatus, setRegenerateStatus] = useState('active'); // 'active' or 'generating'

//   const defaultQnas = {
//     mcqs: [],
//     shortQuestions: [],
//     fillInTheBlanks: [],
//   };

//   // Use qnaData if available, otherwise fall back to props or default
//   const { mcqs = [], shortQuestions = [], fillInTheBlanks = [] } = qnaData || data?.qnas || defaultQnas;

//   const hasQuestions = mcqs.length > 0 || shortQuestions.length > 0 || fillInTheBlanks.length > 0;

//   const regenerateQuiz = async () => {
//     try {
//       setRegenerateStatus('generating');
//       setIsGenerating(true);
  
//       console.log("Current quiz data:", data.qnas);
  
//       // If QnA is empty, generate it using the transcript
//       if (!(data.qnas?.shortQuestions?.length || data.qnas?.mcqs?.length || data.qnas?.fillInTheBlanks?.length)) {
//         // Fetch and process transcript
//         const transcriptResult = await transcriptFetchService.fetchAndProcessTranscript(data.videoId);
//         if (!transcriptResult) {
//           setQnaData({ qnas: "NA" });
//           return;
//         }
  
//         const { transcriptText } = transcriptResult;
  
//         // Prompt AI to generate structured quiz data
//         const aiResponse = await startChatWithMessage([
//           `
//           This is the current quiz i want to generate a new one ${JSON.stringify(data.qnas)} i want to regenerate: 
//           Generate a structured quiz based on this transcript:
//           ${transcriptText}
//           The quiz should be formatted as JSON with three sections:
//           - "mcqs": An array of MCQs, each with a question, four options, and the correctAnswer.
//           - "shortQuestions": An array of short-answer questions, each with a question and answer.
//           - "fillInTheBlanks": An array of fill-in-the-blank questions, each with a sentence and the correct missing word.
//           Wrap the JSON inside a code block like this:
//           \`\`\`json
//           { "mcqs": [...], "shortQuestions": [...], "fillInTheBlanks": [...] }
//           \`\`\`
//           `
//         ]);
  
//         console.log("The AI response is:", aiResponse);
  
//         // Extract JSON from AI response (removing the code block formatting)
//         const jsonMatch = aiResponse.match(/```json([\s\S]*?)```/);
//         if (!jsonMatch) {
//           console.error("Failed to parse AI response as JSON.");
//           setQnaData({ qnas: "NA" });
//           return;
//         }
  
//         try {
//           const parsedData = JSON.parse(jsonMatch[1].trim()); // Convert extracted JSON string to object
  
//           // Ensure the response is properly formatted
//           const formattedQuizData = {
//             mcqs: parsedData.mcqs || [],
//             shortQuestions: parsedData.shortQuestions || [],
//             fillInTheBlanks: parsedData.fillInTheBlanks || [],
//           };
  
//           // Store the quiz in the database
//           await ApiService.addQnas(data.videoId, { qnas: formattedQuizData });
//           console.log("The generated quiz is:", formattedQuizData);
  
//           // Update the local state with the new quiz data
//           setQnaData(formattedQuizData);
//         } catch (error) {
//           console.error("Error parsing AI response JSON:", error);
//           setQnaData({ qnas: "NA" });
//         }
//       } else {
//         // If we already have quiz data, just use it
//         setQnaData(data.qnas);
//       }
//     } catch (error) {
//       console.error("Error regenerating quiz:", error);
//     } finally {
//       setRegenerateStatus('active');
//       setIsGenerating(false);
//     }
//   };

//   // Function to generate text for copying
//   const generateQuizText = () => {
//     let text = `Quiz for Video ID: ${data?.videoId || 'N/A'}\n\n`;

//     if (shortQuestions.length > 0) {
//       text += "--- Short Questions ---\n";
//       shortQuestions.forEach((q, index) => {
//         text += `Q${index + 1}: ${q.question}\n`;
//         text += `Answer: ${q.answer || q.correctAnswer || 'N/A'}\n\n`;
//       });
//     }

//     if (mcqs.length > 0) {
//       text += "--- MCQs ---\n";
//       mcqs.forEach((q, index) => {
//         text += `Q${index + 1}: ${q.question}\n`;
//         q.options.forEach((opt, i) => {
//           const isCorrect = opt === (q.correctAnswer || q.correctOption);
//           text += `  ${String.fromCharCode(65 + i)}. ${opt}${isCorrect ? ' (Correct)' : ''}\n`;
//         });
//         text += "\n";
//       });
//     }

//     if (fillInTheBlanks.length > 0) {
//       text += "--- Fill in the Blanks ---\n";
//       fillInTheBlanks.forEach((q, index) => {
//         text += `Q${index + 1}: ${q.sentence || q.question}\n`;
//         text += `Answer: ${q.missingWord || q.correctAnswer || 'N/A'}\n\n`;
//       });
//     }
//     return text;
//   };

//   // Basic copy to clipboard function
//   const handleCopy = async () => {
//     if (!navigator.clipboard) {
//       alert('Clipboard API not available in this browser/context.');
//       return;
//     }
//     try {
//       await navigator.clipboard.writeText(generateQuizText());
//       alert('Quiz content copied to clipboard!');
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//       alert('Failed to copy quiz content.');
//     }
//   };

//   return (
//     <div className="p-6 mb-8 bg-indigo-50 rounded-lg shadow-md mx-auto mb-8 max-w-2xl h-[calc(100vh-100px)] overflow-y-auto">
//       <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
//         Quiz Content (Admin View)
//       </h2>
//       <p className="text-center text-gray-600 mb-6">
//         As an admin, you can view and copy the quiz content below.
//       </p>

//       {hasQuestions ? (
//         <>
//           {/* Button to copy content */}
//           <div className="text-center mb-6 flex justify-center gap-4">
//             <button
//               onClick={handleCopy}
//               className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
//               disabled={!navigator.clipboard}
//             >
//               Copy Quiz Content
//             </button>

//             <button
//               onClick={regenerateQuiz}
//               className={`py-2 px-4 rounded transition ${
//                 regenerateStatus === 'generating'
//                   ? 'bg-yellow-500 text-white cursor-not-allowed'
//                   : 'bg-blue-500 text-white hover:bg-blue-600'
//               }`}
//               disabled={regenerateStatus === 'generating'}
//             >
//               {regenerateStatus === 'generating' ? 'Generating...' : 'Regenerate Quiz'}
//             </button>
            
//             {!navigator.clipboard && <p className="text-xs text-red-500 mt-1">Copy requires HTTPS or localhost</p>}
//           </div>

//           {/* Short Questions */}
//           {shortQuestions.length > 0 && (
//             <div className="mb-6 p-4 border border-gray-200 rounded bg-white shadow-sm">
//               <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Short Questions</h3>
//               {shortQuestions.map((q, index) => (
//                 <div key={q._id || `sq-${index}`} className="mb-3 text-sm">
//                   <p className="text-gray-700 mb-1">
//                     <strong>Q{index + 1}:</strong> {q.question}
//                   </p>
//                   <p className="text-green-700 font-medium">
//                     <strong>Answer:</strong> {q.answer || q.correctAnswer || <span className="text-gray-400 italic">N/A</span>}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* MCQs */}
//           {mcqs.length > 0 && (
//             <div className="mb-6 p-4 border border-gray-200 rounded bg-white shadow-sm">
//               <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Multiple Choice Questions</h3>
//               {mcqs.map((mcq, index) => (
//                 <div key={mcq._id || `mcq-${index}`} className="mb-4 text-sm">
//                   <p className="text-gray-700 mb-2">
//                     <strong>Q{index + 1}:</strong> {mcq.question}
//                   </p>
//                   <ul className="list-none pl-4">
//                     {mcq.options.map((option, i) => {
//                       const isCorrect = option === (mcq.correctAnswer || mcq.correctOption);
//                       return (
//                         <li key={i} className={`mb-1 ${isCorrect ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>
//                           {String.fromCharCode(65 + i)}. {option} {isCorrect && <span className="text-green-500 ml-1">(Correct)</span>}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Fill-in-the-Blanks */}
//           {fillInTheBlanks.length > 0 && (
//             <div className="mb-6 p-4 border border-gray-200 rounded bg-white shadow-sm">
//               <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Fill in the Blanks</h3>
//               {fillInTheBlanks.map((q, index) => (
//                 <div key={q._id || `fib-${index}`} className="mb-3 text-sm">
//                   <p className="text-gray-700 mb-1">
//                     <strong>Q{index + 1}:</strong> {q.sentence || q.question}
//                   </p>
//                   <p className="text-green-700 font-medium">
//                     <strong>Answer:</strong> {q.missingWord || q.correctAnswer || <span className="text-gray-400 italic">N/A</span>}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center">
//           <p className="text-gray-500 mt-6 mb-4">No quiz content available for this video.</p>
//           <button
//             onClick={regenerateQuiz}
//             className={`py-2 px-4 rounded transition ${
//               regenerateStatus === 'generating'
//                 ? 'bg-yellow-500 text-white cursor-not-allowed'
//                 : 'bg-blue-500 text-white hover:bg-blue-600'
//             }`}
//             disabled={regenerateStatus === 'generating'}
//           >
//             {regenerateStatus === 'generating' ? 'Generating Quiz...' : 'Generate Quiz'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminQuizView;




import React, { useState } from 'react';
import videoService from '../AserverAuth/config';
import { startChatWithMessage } from "../lib/geminiHelperFunc";
import transcriptFetchService from '../utils/transcriptFetch';
import ApiService from '../AserverAuth/ApiService';

const AdminQuizView = ({ data }) => {
  const [qnaData, setQnaData] = useState(data?.qnas || null);
  const [regenerateStatus, setRegenerateStatus] = useState('idle'); // 'idle', 'generating', 'success', 'error'
  const [notification, setNotification] = useState(null);

  const defaultQnas = {
    mcqs: [],
    shortQuestions: [],
    fillInTheBlanks: [],
  };

  // Use qnaData if available, otherwise fall back to props or default
  const { mcqs = [], shortQuestions = [], fillInTheBlanks = [] } = qnaData || data?.qnas || defaultQnas;

  const hasQuestions = mcqs.length > 0 || shortQuestions.length > 0 || fillInTheBlanks.length > 0;

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // const regenerateQuiz = async () => {
  //   try {
  //     setRegenerateStatus('generating');
      
  //     // Always fetch fresh transcript and generate new quiz
  //     const transcriptResult = await transcriptFetchService.fetchAndProcessTranscript(data.videoId);
  //     if (!transcriptResult?.transcriptText) {
  //       throw new Error('Failed to fetch transcript');
  //     }

  //     const aiResponse = await startChatWithMessage([
  //       `Generate a fresh quiz based on this transcript:
  //       ${transcriptResult.transcriptText}
  //       The quiz should be formatted as JSON with:
  //       - "mcqs": Array of MCQs with question, options, correctAnswer
  //       - "shortQuestions": Array of short-answer Q&A
  //       - "fillInTheBlanks": Array of fill-in-blank questions
  //       Return only the JSON wrapped in \`\`\`json code block`
  //     ]);

  //     const jsonMatch = aiResponse.match(/```json([\s\S]*?)```/);
  //     if (!jsonMatch) throw new Error('Failed to parse AI response');

  //     const parsedData = JSON.parse(jsonMatch[1].trim());
  //     const formattedQuizData = {
  //       mcqs: parsedData.mcqs || [],
  //       shortQuestions: parsedData.shortQuestions || [],
  //       fillInTheBlanks: parsedData.fillInTheBlanks || [],
  //     };

  //     // Save to database
  //     const id = data.videoId
  //     console.log("Before saving the quiz")
  //     const saveResponse = await ApiService.addQnas(id,formattedQuizData );
  //     console.log("After saving the quiz:", saveResponse)
      
  //     // Update local state
  //     setQnaData(formattedQuizData);
  //     setRegenerateStatus('success');
  //     showNotification('Quiz regenerated successfully!', 'success');
      
  //   } catch (error) {
  //     console.error("Quiz regeneration failed:", error);
  //     setRegenerateStatus('error');
  //     showNotification('Failed to regenerate quiz', 'error');
  //   }
  // };


  const regenerateQuiz = async () => {
    try {
      setRegenerateStatus('generating');
      showNotification('Generating new quiz...', 'info');
  
      const transcriptResult = await transcriptFetchService.fetchAndProcessTranscript(data.videoId);
      if (!transcriptResult?.transcriptText) {
        throw new Error('Failed to fetch transcript');
      }
  
      const aiResponse = await startChatWithMessage([
        `Generate a fresh quiz based on this transcript:
        ${transcriptResult.transcriptText}
        The quiz should be formatted as JSON with:
        - "mcqs": Array of MCQs with question, options, correctAnswer
        - "shortQuestions": Array of short-answer Q&A
        - "fillInTheBlanks": Array of fill-in-blank questions
        Return only the JSON wrapped in \`\`\`json code block`
      ]);
  
      const jsonMatch = aiResponse.match(/```json([\s\S]*?)```/);
      if (!jsonMatch) throw new Error('Failed to parse AI response');
  
      const parsedData = JSON.parse(jsonMatch[1].trim());
      
      // Format the data to match backend expectations
      const formattedQuizData = {
        qnas: {
          mcqs: (parsedData.mcqs || []).map(mcq => ({
            question: mcq.question,
            options: mcq.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: mcq.correctAnswer || mcq.correctOption || 'Not provided'
          })),
          shortQuestions: (parsedData.shortQuestions || []).map(sq => ({
            question: sq.question,
            answer: sq.answer || sq.correctAnswer || 'Not provided'
          })),
          fillInTheBlanks: (parsedData.fillInTheBlanks || []).map(fib => ({
            sentence: fib.question || fib.sentence,
            missingWord: fib.answer || fib.correctAnswer || fib.missingWord || 'Not provided'
          }))
        }
      };
  
      console.log("Formatted quiz data:", formattedQuizData);
  
      // Save to database
      await ApiService.addQnas(data.videoId, formattedQuizData);
      
      // Update local state with normalized data
      setQnaData({
        mcqs: formattedQuizData.qnas.mcqs,
        shortQuestions: formattedQuizData.qnas.shortQuestions,
        fillInTheBlanks: formattedQuizData.qnas.fillInTheBlanks
      });
  
      setRegenerateStatus('success');
      showNotification('Quiz regenerated and saved successfully!', 'success');
      
    } catch (error) {
      console.error("Quiz regeneration failed:", error);
      setRegenerateStatus('error');
      showNotification(error.message || 'Failed to regenerate quiz', 'error');
    }
  };


  
  const generateQuizText = () => {
    const sections = [
      {
        title: "Short Questions",
        items: shortQuestions,
        format: (q, index) => `Q${index + 1}: ${q.question}\nAnswer: ${q.answer || q.correctAnswer || 'N/A'}\n`
      },
      {
        title: "MCQs",
        items: mcqs,
        format: (q, index) => {
          let text = `Q${index + 1}: ${q.question}\n`;
          q.options.forEach((opt, i) => {
            const isCorrect = opt === (q.correctAnswer || q.correctOption);
            text += `  ${String.fromCharCode(65 + i)}. ${opt}${isCorrect ? ' (Correct)' : ''}\n`;
          });
          return text;
        }
      },
      {
        title: "Fill in the Blanks",
        items: fillInTheBlanks,
        format: (q, index) => `Q${index + 1}: ${q.sentence || q.question}\nAnswer: ${q.missingWord || q.correctAnswer || 'N/A'}\n`
      }
    ];

    return sections.reduce((text, section) => {
      if (section.items.length > 0) {
        text += `--- ${section.title} ---\n`;
        text += section.items.map(section.format).join('\n') + '\n';
      }
      return text;
    }, `Quiz for Video ID: ${data?.videoId || 'N/A'}\n\n`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateQuizText());
      showNotification('Quiz copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy quiz', 'error');
    }
  };

  return (
    <div className="p-6 bg-indigo-50 rounded-lg shadow-md mx-auto max-w-2xl h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
        Quiz Content (Admin View)
      </h2>
      
      {notification && (
        <div className={`mb-4 p-3 rounded ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleCopy}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          disabled={!hasQuestions}
        >
          Copy Quiz
        </button>

        <button
          onClick={regenerateQuiz}
          disabled={regenerateStatus === 'generating'}
          className={`py-2 px-4 rounded transition ${
            regenerateStatus === 'generating' 
              ? 'bg-yellow-500 text-white cursor-wait' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {regenerateStatus === 'generating' ? 'Generating...' : 'Regenerate Quiz'}
        </button>
      </div>

      {hasQuestions ? (
        <>
          {[
            { title: "Short Questions", items: shortQuestions, key: 'sq' },
            { title: "Multiple Choice Questions", items: mcqs, key: 'mcq' },
            { title: "Fill in the Blanks", items: fillInTheBlanks, key: 'fib' }
          ].map(section => (
            section.items.length > 0 && (
              <div key={section.key} className="mb-6 p-4 bg-white rounded border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
                  {section.title}
                </h3>
                {section.items.map((item, index) => (
                  <div key={item._id || `${section.key}-${index}`} className="mb-4 last:mb-0">
                    {renderQuestionItem(section.key, item, index)}
                  </div>
                ))}
              </div>
            )
          ))}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No quiz content available</p>
          <button
            onClick={regenerateQuiz}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Generate Quiz
          </button>
        </div>
      )}
    </div>
  );
};

// Helper component to render different question types
const renderQuestionItem = (type, item, index) => {
  switch (type) {
    case 'sq':
      return (
        <>
          <p className="text-gray-700 mb-1">
            <strong>Q{index + 1}:</strong> {item.question}
          </p>
          <p className="text-green-700 font-medium">
            <strong>Answer:</strong> {item.answer || item.correctAnswer || <span className="text-gray-400 italic">N/A</span>}
          </p>
        </>
      );
    case 'mcq':
      return (
        <>
          <p className="text-gray-700 mb-2">
            <strong>Q{index + 1}:</strong> {item.question}
          </p>
          <ul className="list-none pl-4">
            {item.options.map((opt, i) => {
              const isCorrect = opt === (item.correctAnswer || item.correctOption);
              return (
                <li key={i} className={`mb-1 ${isCorrect ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>
                  {String.fromCharCode(65 + i)}. {opt} {isCorrect && <span className="text-green-500 ml-1">(Correct)</span>}
                </li>
              );
            })}
          </ul>
        </>
      );
    case 'fib':
      return (
        <>
          <p className="text-gray-700 mb-1">
            <strong>Q{index + 1}:</strong> {item.sentence || item.question}
          </p>
          <p className="text-green-700 font-medium">
            <strong>Answer:</strong> {item.missingWord || item.correctAnswer || <span className="text-gray-400 italic">N/A</span>}
          </p>
        </>
      );
    default:
      return null;
  }
};

export default AdminQuizView;