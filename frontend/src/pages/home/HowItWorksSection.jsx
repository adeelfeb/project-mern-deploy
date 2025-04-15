// HowItWorksSection.js
import React from 'react';
// Removed Element import
import { Link as RouterLink } from 'react-router-dom'; // Keep if the final CTA goes to dashboard

// Define HEADER_HEIGHT matching your CSS/layout
const HEADER_HEIGHT = 70; // Ensure consistency

function HowItWorksSection() {
  const steps = [
    { number: 1, title: "Provide Content", description: "Upload your video file or simply paste a link to an online video." },
    { number: 2, title: "Let AI Analyze", description: "Our system transcribes, summarizes, and prepares interactive elements." },
    { number: 3, title: "Engage & Learn", description: "Review summaries, key concepts, and take quizzes to solidify your knowledge." },
  ];

  return (
    // Add id and style for scroll margin
    <section
      id="how-it-works"
      style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      className="py-20"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Get Started in 3 Simple Steps</h2>
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center space-y-8 md:space-y-0 md:space-x-16 mb-16">
           {steps.map((step) => (
             <div key={step.number} className="flex flex-col items-center max-w-xs">
               <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">{step.number}</div>
               <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
               <p className="text-gray-400">{step.description}</p>
             </div>
           ))}
        </div>

         <div className="mt-16">
            <RouterLink to="/dashboard">
               <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition duration-300">
                 Start Learning Smarter Now
               </button>
            </RouterLink>
         </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;