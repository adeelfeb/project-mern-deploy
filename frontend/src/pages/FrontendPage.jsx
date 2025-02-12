import React, { useState } from 'react';
import axios from 'axios';
import conf from '../conf/conf';

const FrontendPage = () => {
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = conf.apiUrl;

        try {
            const response = await axios.post(`${apiUrl}/allow-origin`, { url });
            console.log(response.data)
            setMessage(response.data.message);
            setUrl(''); // Clear the input field after successful submission
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Allow Origin</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </form>
                {message && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-gray-700">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FrontendPage;