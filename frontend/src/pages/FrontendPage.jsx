// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import conf from '../conf/conf';
// import ToastNotification from "../components/toastNotification/ToastNotification";

// const FrontendPage = () => {
//     const [url, setUrl] = useState('');
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [toast, setToast] = useState({ show: false, type: '', message: '' });
    
//     useEffect(() => {
//         // Fetch the URL from the backend on mount
//         const fetchUrl = async () => {
//             try {
//                 const response = await axios.get(`${conf.apiUrl}/get-url`);
//                 setUrl(response.data.url);
//             } catch (error) {
//                 console.error("Error fetching URL:", error);
//             }
//         };
//         fetchUrl();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         const apiUrl = conf.apiUrl;

//         try {
//             const response = await axios.post(`${apiUrl}/allow-origin`, { url });
//             setMessage(response.data.message);
//             setToast({ show: true, type: 'success', message: response.data.message });
//             setUrl(''); // Clear input after submission
//         } catch (error) {
//             const errorMsg = error.response ? error.response.data.error : 'An error occurred';
//             setMessage(errorMsg);
//             setToast({ show: true, type: 'error', message: errorMsg });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//             {toast.show && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />}
//             <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//                 <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Allow Origin</h1>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <input
//                             type="text"
//                             value={url}
//                             onChange={(e) => setUrl(e.target.value)}
//                             placeholder="Enter URL"
//                             required
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                         disabled={loading}
//                     >
//                         {loading ? 'Processing...' : 'Submit'}
//                     </button>
//                 </form>
//                 {message && (
//                     <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
//                         <p className="text-gray-700">{message}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FrontendPage;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import conf from '../conf/conf';
import ToastNotification from "../components/toastNotification/ToastNotification";

const FrontendPage = () => {
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const inputRef = useRef(null);
    
    useEffect(() => {
        // Fetch the URL from the backend on mount
        const fetchUrl = async () => {
            try {
                const response = await axios.get(`${conf.apiUrl}/get-url`);
                setUrl(response.data.url);
            } catch (error) {
                console.error("Error fetching URL:", error);
            }
        };
        fetchUrl();
    }, []);

    const handleInputClick = async () => {
        try {
            // Clear the input first
            setUrl('');
            
            // Read clipboard contents
            const clipboardText = await navigator.clipboard.readText();
            
            // Only paste if there's actually text in clipboard
            if (clipboardText) {
                setUrl(clipboardText);
                inputRef.current.focus();
            }
        } catch (err) {
            console.error("Failed to read clipboard contents:", err);
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }
    };

    const handleClearInput = () => {
        setUrl('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const apiUrl = conf.apiUrl;

        try {
            const response = await axios.post(`${apiUrl}/allow-origin`, { url });
            setMessage(response.data.message);
            setToast({ show: true, type: 'success', message: response.data.message });
            setUrl(''); // Clear input after submission
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error : 'An error occurred';
            setMessage(errorMsg);
            setToast({ show: true, type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            {toast.show && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Allow Origin</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative w-full">
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onClick={handleInputClick}
                            placeholder="Click to paste URL"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer pr-10"
                            aria-label="URL input"
                        />
                        {url && (
                            <button
                                type="button"
                                onClick={handleClearInput}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="Clear input"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Submit'}
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