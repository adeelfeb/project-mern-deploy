// SolutionSection.js
import React from 'react';
// Removed Element import

// Define HEADER_HEIGHT matching your CSS/layout
const HEADER_HEIGHT = 70; // Ensure consistency

function SolutionSection() {
  return (
    // Add id and style for scroll margin
    <section
      id="solution"
      style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      className="py-20"
    >
      <div className="container mx-auto px-6 text-center">
         <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">From Watch to Work: Your Active Learning Partner</h2>
         <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
           Our platform tackles these challenges head-on. We use advanced AI to analyze video content (from uploads or links) and provide tools that force active engagement, helping you understand deeply and remember longer.
         </p>
        {/* Optional visual */}
      </div>
    </section>
  );
}

export default SolutionSection;