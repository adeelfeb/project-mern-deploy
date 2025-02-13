// src/pages/NotFound.jsx
import { Link } from 'react-router-dom'; // Import Link for navigation

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-center p-6">
      {/* Heading */}
      <h1 className="text-6xl font-bold mb-4">
        404 - Page Not Found
      </h1>

      {/* Message */}
      <p className="text-2xl mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Note */}
      <p className="text-lg mb-8">
        If you're lost, try going back to the homepage and navigate from there.
      </p>

      {/* Button to navigate to the base URL */}
      <Link
        to="/"
        className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-purple-50 transition-all duration-300"
      >
        Go to Homepage
      </Link>
    </div>
  );
}