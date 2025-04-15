// Header.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // If Get Started goes elsewhere

// Define HEADER_HEIGHT matching your CSS/layout (including padding/border if any)
const HEADER_HEIGHT = 70; // Adjust this value accurately in pixels

function Header() {
  const navLinks = [
    { name: 'Home', targetId: 'home' },
    { name: 'The Problem', targetId: 'problem' },
    { name: 'Our Solution', targetId: 'solution' },
    { name: 'Features', targetId: 'features' },
    { name: 'How it Works', targetId: 'how-it-works' },
  ];

  const handleScroll = (event, targetId) => {
    event.preventDefault(); // Prevent default anchor jump
    const element = document.getElementById(targetId);
    if (element) {
      // Calculate position manually IF scroll-margin-top is not reliable/sufficient
      // const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      // const offsetPosition = elementPosition - HEADER_HEIGHT;
      // window.scrollTo({
      //   top: offsetPosition,
      //   behavior: "smooth"
      // });

      // Preferred method using scrollIntoView with CSS offset (scroll-margin-top)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Note: Active link highlighting (activeClass) needs a more complex
  // implementation using Intersection Observer or scroll event listeners
  // if you want to replicate react-scroll's 'spy' functionality.
  // This version provides only the smooth scroll on click.

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          Watch To Work {/* Or your project name */}
        </div>
        <ul className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              {/* Use standard <a> tag with onClick */}
              <a
                href={`#${link.targetId}`} // Keep href for semantics/fallback, but prevent default
                onClick={(e) => handleScroll(e, link.targetId)}
                className="cursor-pointer text-gray-300 hover:text-white transition duration-300"
                // Add active styling manually if implementing scroll spying
              >
                {link.name}
              </a>
            </li>
          ))}
          <li>
            <RouterLink to="/dashboard">
               <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                 Get Started
               </button>
            </RouterLink>
          </li>
        </ul>
        {/* Add a Mobile Menu Button here if needed */}
      </nav>
    </header>
  );
}

export default Header;