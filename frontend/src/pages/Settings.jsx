import React, { useState } from "react";
import {
  ChangePassword,
  UpdateAvatar,
  UpdateAccountDetails,
  CurrentUserDetails,
} from "../components";
import videoService from "../AserverAuth/config.js";
import ToastNotification from "../components/toastNotification/ToastNotification.jsx";

function Settings() {
  const [currentView, setCurrentView] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [isValid, setIsValid] = useState(true)

  // Function to handle checking password status before changing it
  const handlePasswordCheck = async () => {
    try {
      const response = await videoService.checkUserPasswordStatus();
      
      if (response.statusCode === 202) {
        setToastMessage("Please create a passwrod");
        setIsValid(false)
        // setIsSuccess(false);
        setCurrentView("changePassword")
      } else {
        setCurrentView("changePassword");
      }
    } catch (error) {
      setToastMessage("Error checking password status.");
      setIsSuccess(false);
    }
  };

  // Render different sections based on `currentView`
  const renderView = () => {
    switch (currentView) {
      case "changePassword":
        return <ChangePassword isValid= {isValid}/>;
      case "updateAccount":
        return <UpdateAccountDetails />;
      case "updateAvatar":
        return <UpdateAvatar />;
      case "currentUser":
        return <CurrentUserDetails />;
      default:
        return <p className="text-gray-600 text-center">Select an action</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-black text-center mb-6">Settings</h1>

      {/* Buttons for Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={handlePasswordCheck} // Check before navigating
          className={`px-2 py-1 md:px-4 md:py-2 rounded text-xs md:text-base ${
            currentView === "changePassword"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Change Password
        </button>
        <button
          onClick={() => setCurrentView("updateAccount")}
          className={`px-2 py-1 md:px-4 md:py-2 rounded text-xs md:text-base ${
            currentView === "updateAccount"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Update Account Details
        </button>
        <button
          onClick={() => setCurrentView("updateAvatar")}
          className={`px-2 py-1 md:px-4 md:py-2 rounded text-xs md:text-base ${
            currentView === "updateAvatar"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Update Avatar
        </button>
        <button
          onClick={() => setCurrentView("currentUser")}
          className={`px-2 py-1 md:px-4 md:py-2 rounded text-xs md:text-base ${
            currentView === "currentUser"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          View Current User
        </button>
      </div>

      {/* Render the selected view */}
      <div className="bg-white p-4 md:p-6 rounded shadow-md w-full max-w-4xl mx-auto mb-8 overflow-y-auto max-h-[calc(100vh-200px)]">
        {renderView()}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          duration={3000}
          onClose={() => setToastMessage("")}
          position="bottom-right"
          isSuccess={isSuccess}
        />
      )}
    </div>
  );
}

export default Settings;
