import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const MessagesList = () => {
  const scrollToBottomRef = useRef(null);

  // Access messages and isLoading from Redux store
  const messages = useSelector((state) => state.chatSlice.messages);
  const isLoading = useSelector((state) => state.chatSlice.isLoading);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  return (
    <div
      className="overflow-y-auto w-full custom-scrollbar"
      style={{ height: "calc(100vh - 11rem)", paddingBottom: "2rem" }}
    >
      <div className="flex flex-col w-full max-w-3xl mx-auto px-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: index * 0.01 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2 mt-2`}
          >
            <div
              className={`${
                msg.text ? "p-3 rounded-lg shadow" : ""
              } ${
                msg.role === "user"
                  ? "bg-gray-100 text-black"
                  : "bg-[#fff4f4] text-black"
              } ${
                msg.text ? "max-w-[70%]" : "max-w-[90%]"
              } break-words overflow-hidden`}
            >
              {msg.text && (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              )}
            </div>
          </motion.div>
        ))}

        {/* Show loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: messages.length * 0.05 }}
            className="flex justify-start mb-4"
          >
            <div className="flex items-center text-black p-3 rounded-lg bg-[#fff4f4] shadow">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Loading...</span>
            </div>
          </motion.div>
        )}

        {/* Scroll to bottom reference */}
        <div ref={scrollToBottomRef} className="p-2"></div>
      </div>
    </div>
  );
};

export default MessagesList;

// import React, { useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";

// const MessagesList = () => {
//   const scrollToBottomRef = useRef(null);

//   // Access messages and isLoading from Redux store
//   const messages = useSelector((state) => state.chatSlice.messages);
//   const isLoading = useSelector((state) => state.chatSlice.isLoading);

//   // Scroll to the bottom when messages change
//   useEffect(() => {
//     if (scrollToBottomRef.current) {
//       scrollToBottomRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//       });
//     }
//   }, [messages]);

//   // Animation variants for messages
//   const messageVariants = {
//     initial: { opacity: 0, y: 10 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -10 },
//   };

//   // Animation variants for loading indicator
//   const loadingVariants = {
//     initial: { opacity: 0, y: 10 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -10 },
//   };

//   return (
//     <div
//       className="overflow-y-auto w-full custom-scrollbar"
//       style={{ height: "calc(100vh - 11rem)", paddingBottom: "2rem" }}
//     >
//       <div className="flex flex-col w-full max-w-3xl mx-auto px-4">
//         {messages.map((msg, index) => (
//           <motion.div
//             key={index}
//             variants={messageVariants}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             transition={{ duration: 0.5, delay: index * 0.01 }}
//             className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2 mt-2`}
//           >
//             <div
//               className={`${
//                 msg.text ? "p-3 rounded-lg shadow" : ""
//               } ${
//                 msg.role === "user"
//                   ? "bg-gray-100 text-black"
//                   : "bg-[#fff4f4] text-black"
//               } ${
//                 msg.text ? "max-w-[70%]" : "max-w-[90%]"
//               } break-words overflow-hidden`} // Ensure text wraps and doesn't overflow
//             >
//               {/* Render text as Markdown */}
//               {msg.text && (
//                 <ReactMarkdown
//                   components={{
//                     h1: ({ node, ...props }) => (
//                       <h1 className="mt-4 mb-2 text-2xl font-bold" {...props} />
//                     ),
//                     h2: ({ node, ...props }) => (
//                       <h2 className="mt-4 mb-2 text-xl font-semibold" {...props} />
//                     ),
//                     h3: ({ node, ...props }) => (
//                       <h3 className="mt-4 mb-2 text-lg font-medium" {...props} />
//                     ),
//                     p: ({ node, ...props }) => (
//                       <p className="text-base md:text-lg" {...props} /> // Responsive font size
//                     ),
//                     code: ({ node, ...props }) => (
//                       <code className="bg-gray-200 p-1 rounded" {...props} />
//                     ),
//                     pre: ({ node, ...props }) => (
//                       <pre className="bg-gray-200 p-2 rounded overflow-x-auto" {...props} />
//                     ),
//                   }}
//                 >
//                   {msg.text}
//                 </ReactMarkdown>
//               )}
//             </div>
//           </motion.div>
//         ))}

//         {/* Show loading indicator */}
//         {isLoading && (
//           <motion.div
//             variants={loadingVariants}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             transition={{ duration: 0.5, delay: messages.length * 0.05 }}
//             className="flex justify-start mb-4"
//           >
//             <div className="flex items-center text-black p-3 rounded-lg bg-[#fff4f4] shadow">
//               <svg
//                 className="animate-spin h-5 w-5 mr-2 text-black"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 ></path>
//               </svg>
//               <span>Loading...</span>
//             </div>
//           </motion.div>
//         )}

//         {/* Scroll to bottom reference */}
//         <div ref={scrollToBottomRef} className="p-2"></div>
//       </div>
//     </div>
//   );
// };

// export default MessagesList;