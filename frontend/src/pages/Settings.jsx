import React, { useState } from "react";
import { ChangePassword, UpdateAvatar, UpdateAccountDetails, CurrentUserDetails } from "../components";

function Settings() {
  const [currentView, setCurrentView] = useState(null); // Track which functionality is active

  // Render different sections based on `currentView`
  const renderView = () => {
    switch (currentView) {
      case "changePassword":
        return <ChangePassword />;
      case "updateAccount":
        return <UpdateAccountDetails />;
      case "updateAvatar":
        return <UpdateAvatar />;
      case "currentUser": // Rendering condition for "View Current User"
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
          onClick={() => setCurrentView("changePassword")}
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

      {/* Render the view based on the current selection */}
      <div className="bg-white p-4 md:p-6 rounded shadow-md w-full max-w-4xl mx-auto mb-8 overflow-y-auto max-h-[calc(100vh-200px)]">
        {renderView()}
      </div>
    </div>
  );
}

export default Settings;