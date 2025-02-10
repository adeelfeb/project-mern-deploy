import React from 'react';
import { motion } from 'framer-motion'; // Import motion for animations
import Upload from '../components/upload/Upload';

function UploadSection({ errorMessage }) {
  return (
    <div className="flex justify-center items-center  bg-transparent">  {/* Transparent background for the main container */}
      <motion.div
        className="bg-blue-50/60 rounded-lg shadow-lg p-8 max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9, y: 50 }} // Start with lower opacity and scale
        animate={{ opacity: 1, scale: 1, y: 0 }} // Animate to full opacity and scale
        transition={{ duration: .5, ease: "easeOut" }} // Smooth transition with ease-out
        whileHover={{ scale: 1.05 }}  // Slightly scale up on hover
        whileTap={{ scale: 0.98 }}  // Slightly scale down on tap
        style={{ backdropFilter: 'blur(10px)' }}  // Add a subtle blur effect for additional transparency
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Upload Your PDF</h2>
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Select a PDF file to upload.</p>

          {/* Upload Component */}
          <Upload />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <motion.p
            className="text-red-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.04, delay: 0.02 }}
          >
            {errorMessage}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default UploadSection;
