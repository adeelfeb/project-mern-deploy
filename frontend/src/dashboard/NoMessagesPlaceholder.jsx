import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NoMessagesPlaceholder = () => {
  const navigate = useNavigate();


  
  const animationVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex justify-center items-center h-full text-gray-500"
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center space-y-4">
        <p className="text-2xl font-semibold text-gray-800 mb-4">
          🌟 Welcome to Your PDF Chat Assistant! 🌟
        </p>

        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full mx-auto"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        <p className="text-lg font-medium text-gray-700 mb-4">
          🤖 Upload a PDF to begin your chat. The model will process it and help you with any questions about the content. 📚
        </p>

        <motion.div
          className="bg-gray-100 p-3 rounded-lg shadow-lg space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-sm text-gray-600">
            📄 **Current PDF**: <span className="font-semibold text-blue-600">"Your PDF File.pdf"</span> (You can change this anytime!)
          </p>
          <p className="text-sm text-gray-600">
            🔄 Want to upload a new PDF? Simply go to the <span className="font-semibold text-blue-600">History</span> page from the left navigation bar to select a different document or upload a new one.
          </p>
        </motion.div>

        <motion.div
          className="text-lg font-medium text-gray-600 mt-4"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span role="img" aria-label="rocket">🚀</span> Ready to get started? Let's chat! 
        </motion.div>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button
            className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
            onClick={() => navigate("/dashboard/uploadpdf")}
          >
            📤 Upload New PDF
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NoMessagesPlaceholder;
