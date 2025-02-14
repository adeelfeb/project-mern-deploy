import React, { useState } from "react";
import ApiService from "../AserverAuth/ApiService";
import ToastNotification from "../components/toastNotification/ToastNotification";

const apiService = ApiService;

const ApiRequestForm = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            const parsedData = JSON.parse(jsonInput);
            if (!parsedData.id) throw new Error("ID is required in JSON");

            const result = await apiService.addTranscript(parsedData.id, parsedData.english, parsedData.original);
            setResponse(result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setResponse(null);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-xl font-semibold mb-4 text-center">API Request Form</h2>
            <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter JSON request here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
            ></textarea>
            <button 
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={handleSubmit}
            >
                Send Request
            </button>
            {response && (
                <div className="mt-4 p-3 border rounded-lg bg-green-100 text-green-800">
                    <strong>Response:</strong> <pre className="whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
            {error && (
                <div className="mt-4 p-3 border rounded-lg bg-red-100 text-red-800">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default ApiRequestForm;
