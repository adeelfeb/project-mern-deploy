// LandingPage.js (or HomePage.js)
import React from 'react';

// Import all the section components
import Header from './Header.jsx';
import HeroSection from './HeroSection.jsx';
import ProblemSection from './ProblemSection.jsx';
import SolutionSection from './SolutionSection.jsx';
import FeaturesSection from './FeaturesSection.jsx';
import HowItWorksSection from './HowItWorksSection.jsx';
import Footer from './Footer';

function LandingPage() {
  return (
    // Apply the overall background and text color here
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white min-h-screen font-sans flex flex-col">
      <Header />

      {/* Main content area */}
      <main className="flex-grow"> {/* flex-grow helps push footer down */}
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default LandingPage;