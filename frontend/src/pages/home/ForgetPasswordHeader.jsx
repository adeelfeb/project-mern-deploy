import React from 'react';
// Remove useNavigate import from here

// Accept navigate as a prop
function ForgetPasswordHeader({ navigate }) {
  // Basic check if navigate prop is provided (optional but good practice)
  if (!navigate) {
    console.error("HeaderForLogin requires a 'navigate' prop.");
    return null; // Or render some fallback
  }

  return (
    // Remove the outer div with p-4 unless specifically needed for other reasons
    // The parent component already has padding and centering
    <div className="w-full max-w-md mb-8 flex justify-between items-center">

      <button
        onClick={() => navigate('/')} // Use the passed-in navigate function
        className="text-sm text-purple-600 hover:text-purple-800 hover:underline transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded" // Added focus styles for accessibility
      >
        ← Back to Homepage
      </button>

      <div className="space-x-4">
        
        
        <button
          onClick={() => navigate('/Login')} // Use the passed-in navigate function
          className="text-sm px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')} // Use the passed-in navigate function
          className="text-sm px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default ForgetPasswordHeader;