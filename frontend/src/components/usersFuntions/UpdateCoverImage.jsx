import React, { useState } from "react";
import VideoService from "../AserverAuth/config";
import ToastNotification from "../toastNotification/ToastNotification";

function UpdateAccountDetails() {
  const [loading, setLoading] = useState(false); // Track loading state
  const [toastMessage, setToastMessage] = useState(""); // Store toast message
  const [isSuccess, setIsSuccess] = useState(true); // Track success/error state

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    const fullname = e.target.fullname.value;
    const email = e.target.email.value;

    // Check if at least one field is provided
    if (!fullname && !email) {
      setToastMessage("Please enter at least one detail (Full Name or Email).");
      setIsSuccess(false);
      return;
    }

    setLoading(true); // Start loading
    setToastMessage(""); // Clear previous toast messages

    try {
      const response = await VideoService.updateAccountDetails(fullname, email);
      // Show success notification
      setToastMessage(response.message || "Account updated successfully");
      setIsSuccess(true);
    } catch (error) {
      // Show error notification
      setToastMessage(error.message || "Error updating account");
      setIsSuccess(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <form
        onSubmit={handleUpdateAccount}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Account Details
        </h2>
        <div>
          <label className="block text-gray-700 mb-2">Full Name:</label>
          <input
            type="text"
            name="fullname"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {/* Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          duration={3000} // Display for 3 seconds
          onClose={() => setToastMessage("")} // Clear toast message on close
          position="bottom-right"
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}

export default UpdateAccountDetails;