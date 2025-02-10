import React, { useState, useMemo } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import getUserData from '../AserverAuth/getUserData';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  setCurrentFileData } from '../store/fileSlice';
import { clearChat } from '../store/messageSlice';
import UploadSection from './UploadSection';

function HistorySection({ uploadedFiles }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingFileId, setLoadingFileId] = useState(null);

  // Memoize reversed files for better performance (only recompute when uploadedFiles change)
  const reversedFiles = useMemo(() => {
    return [...uploadedFiles].reverse();  // Create a shallow copy and reverse it
  }, [uploadedFiles]);

  const handleChatClick = async (file) => {
    console.log("Selected File:", file)
    setLoadingFileId(file._id); // Set the loading state
    try {
      
      dispatch(setCurrentFileData(file)); // Store response in Redux
      dispatch(clearChat())
      navigate('/dashboard/chat'); // Navigate to chat page
    } catch (error) {
      console.error('Error fetching vector data:', error);
    } finally {
      setLoadingFileId(null); // Reset the loading state
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-transparent ">
      {/* History Section */}
      <div className="flex-1 overflow-y-auto p-6">
  {reversedFiles && reversedFiles.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {reversedFiles.map((file, index) => (
        <div
          key={index}
          className="p-4 border rounded-md shadow-lg bg-opacity-50 bg-gray-100 flex flex-col items-center justify-center transition-all duration-300 ease-in-out hover:bg-gray-200 hover:bg-opacity-70 hover:shadow-xl hover:scale-105"
        >
          <div className="relative flex justify-center items-center mb-4 transition-all duration-300 ease-in-out hover:scale-110">
            <FaFilePdf className="text-red-600 text-6xl transition-all duration-300 ease-in-out hover:text-red-500 hover:drop-shadow-lg" />
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Title: {file.fileName}</p>
            <p className="text-gray-500 text-sm">
              Upload Time: {new Date(file.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            <button
              className={`${
                loadingFileId === file._id ? 'bg-gray-500' : 'bg-blue-500'
              } text-white py-1 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-blue-600 hover:scale-105`}
              onClick={() => handleChatClick(file)}
              disabled={loadingFileId === file._id}
            >
              {loadingFileId === file._id ? 'Loading...' : 'Chat'}
            </button>
            <button
              className="bg-green-500 text-white py-1 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-green-600 hover:scale-105"
              onClick={() => window.open(file.fileUrl, '_blank')}
            >
              Open
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-center">No files uploaded yet.</p>
  )}
</div>



      {/* Sticky Upload Section */}
      <div className="sticky bottom-0 p-0 m-0 bg-transparent z-10 w-full ">
        <UploadSection errorMessage={""} />
      </div>
    </div>
  );
}

export default HistorySection;
