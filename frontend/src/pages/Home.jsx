import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import optimized images
import bot from '../assets/bot.png';




function Home() {
    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();

    useEffect(() => {
        if (authStatus && user) {
            navigate('/dashboard');
        }
    }, [authStatus, user, navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            {/* Navigation Bar */}
            <nav className="w-full p-4 bg-gray-800">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-purple-500">YouTube Summarizer</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row items-center justify-center flex-grow p-6">
                {/* Left Section */}
                <div className="text-center lg:w-1/2 p-6 mb-6 lg:mb-0">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                        YouTube Summarizer
                    </h1>
                    <h2 className="text-2xl font-semibold text-white mb-6">Summarize, Analyze, and Quiz</h2>
                    <h3 className="text-lg text-gray-300 mb-8 max-w-[60%] mx-auto font-normal">
                        Paste a YouTube video URL, and our AI will generate a transcript, provide a summary, create Q&A, and assess your understanding with a quiz. Dive deeper into your favorite videos effortlessly!
                    </h3>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                    >
                        Try It Now
                    </button>
                </div>

                {/* Right Section */}
                <div className="lg:w-1/2 flex flex-col items-center space-y-8">
                    {/* Bot Image */}
                    <div className="w-64 h-64 lg:w-80 lg:h-80 flex justify-center items-center">
                        <img
                            src={bot}
                            alt="Bot"
                            className="object-contain w-full h-full"
                            loading="lazy"
                        />
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Home;