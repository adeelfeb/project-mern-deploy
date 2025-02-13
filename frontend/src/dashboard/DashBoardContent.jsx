import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header2";

const DashboardContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
     

      {/* Main Content */}
      <motion.div
        className="flex-grow flex flex-col items-center bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-6 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Hero Section */}
        <motion.div
          className="w-full max-w-6xl text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          > 
            From Watch To Work
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Transform YouTube videos into actionable insights! Get transcript summaries, Q&A, and chat with an AI-powered assistant using Retrieval-Augmented Generation (RAG).
          </motion.p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { delay: 2, staggerChildren: 0.3 },
            },
          }}
        >
          {[
            { title: "Transcript Summary", description: "Get a concise summary of the video transcript for quick understanding." },
            { title: "Q&A Generation", description: "Automatically generate questions and answers based on the video content." },
            { title: "RAG-Powered Chat", description: "Chat with an AI assistant that uses Retrieval-Augmented Generation for context-aware responses." },
            { title: "Vectorization", description: "Convert video transcripts into vectors for seamless AI integration." },
            { title: "Insights & Analytics", description: "Gain insights and analytics from the video content." },
            { title: "User-Friendly Interface", description: "Enjoy a clean, intuitive, and responsive design." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg hover:shadow-2xl transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Chatbot Section */}
    
      </motion.div>
    </div>
  );
};

export default DashboardContent;