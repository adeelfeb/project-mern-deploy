// FeaturesSection.js
import React from 'react';
// Removed Element import
import IconPlaceholder from './IconPlaceholder';

// Define HEADER_HEIGHT matching your CSS/layout
const HEADER_HEIGHT = 70; // Ensure consistency

function FeaturesSection() {
  const features = [
    // ... (features array remains the same)
    { title: "Accurate Transcription", description: "Get clean, readable transcripts from video lectures (uploads or links)." },
    { title: "Intelligent Summarization", description: "Quickly grasp the main points with AI-generated summaries." },
    { title: "Key Concept Identification", description: "Pinpoint the most important topics and ideas discussed in the video." },
    { title: "Automated Quizzes", description: "Test your understanding with custom quizzes (MCQs, Fill-in-blanks, Short Qs)." },
    { title: "Instant Feedback", description: "Get immediate scoring and feedback on your quiz answers to identify weak spots." },
    { title: "User-Friendly Interface", description: "Easily navigate and use all features through a clean, intuitive design." },
  ];

  return (
    // Add id and style for scroll margin
    <section
      id="features"
      style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      className="py-20 bg-gray-800"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300 flex flex-col items-center">
              <IconPlaceholder />
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;