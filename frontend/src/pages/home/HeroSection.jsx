// HeroSection.js
import React from 'react';
// Removed ScrollLink and Element imports

// Define HEADER_HEIGHT matching your CSS/layout
const HEADER_HEIGHT = 70; // Ensure consistency

function HeroSection() {

  const handleLearnHowScroll = (event) => {
    event.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    // Add id and style for scroll margin
    <section
      id="home"
      style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      className="min-h-screen flex items-center justify-center pt-20 bg-cover bg-center relative"
      /* style={{ backgroundImage: "url('/path/to/your/cool/background-image.jpg')" }} */
    >
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
          Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Watching</span>, Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400">Mastering</span>.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Transform passive video lectures into active learning experiences. Our tool analyzes educational content, creates summaries, identifies key concepts, and generates personalized quizzes to boost your understanding and retention.
        </p>
        {/* Use a button or <a> tag with onClick for scrolling */}
        <button
          onClick={handleLearnHowScroll}
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer"
        >
          Learn How
        </button>
      </div>
    </section>
  );
}

export default HeroSection;