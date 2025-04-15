// ProblemSection.js
import React from 'react';
// Removed Element import

// Define HEADER_HEIGHT matching your CSS/layout
const HEADER_HEIGHT = 70; // Ensure consistency

function ProblemSection() {
  return (
    // Add id and style for scroll margin
    <section
      id="problem"
      style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      className="py-20 bg-gray-800"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">The Challenge with Online Learning</h2>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          Endless online resources are great, but passive watching leads to information overload, distractions, and poor knowledge retention. It's hard to truly engage and know if you're really learning.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Problem Cards remain the same */}
           <div className="bg-gray-700 p-6 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2">
             <h3 className="text-xl font-semibold mb-3 text-white">Information Overload</h3>
             <p className="text-gray-400">Too much content makes it hard to find and focus on what's crucial.</p>
           </div>
           <div className="bg-gray-700 p-6 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2">
             <h3 className="text-xl font-semibold mb-3 text-white">Passive Consumption</h3>
             <p className="text-gray-400">Just watching or listening doesn't build strong memory connections.</p>
           </div>
           <div className="bg-gray-700 p-6 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2">
             <h3 className="text-xl font-semibold mb-3 text-white">Lack of Engagement</h3>
             <p className="text-gray-400">Without interaction, it's easy to zone out and miss key concepts.</p>
           </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;