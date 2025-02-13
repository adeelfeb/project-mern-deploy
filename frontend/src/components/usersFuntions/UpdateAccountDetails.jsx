import React, { useState } from "react";
import VideoService from "../../AserverAuth/config.js";
import ToastNotification from "../toastNotification/ToastNotification.jsx";

function UpdateAccountDetails() {
  const [loading, setLoading] = useState(false); // Track loading state
  const [toastMessage, setToastMessage] = useState(""); // Store toast message
  const [isSuccess, setIsSuccess] = useState(true); // Track success/error state

  const handleUpdateAccount = async (e, field) => {
    e.preventDefault();
    const form = e.currentTarget; // Access the form element
    const fullname = form.fullname.value;
    const email = form.email.value;

    // Check if at least one field is provided
    if (!fullname && !email) {
      setToastMessage("Please enter at least one detail (Full Name or Email).");
      setIsSuccess(false);
      return;
    }

    setLoading(true); // Start loading
    setToastMessage(""); // Clear previous toast messages

    try {
      let response;
      if (field === "fullname") {
        // Update only Full Name
        response = await VideoService.updateAccountDetails({ fullname });
      } else if (field === "email") {
        // Update only Email
        response = await VideoService.updateAccountDetails({ email });
      } else {
        // Update both Full Name and Email
        response = await VideoService.updateAccountDetails({ fullname, email });
      }

      // Show success notification
      setToastMessage(response.message || "Account updated successfully");
      setIsSuccess(true);
    } catch (error) {
      // Handle specific error response
      if (error.message === "The email address is already in use.") {
        setToastMessage(
          "The email address is already in use. Please try another one."
        );
      } else {
        setToastMessage(error.message || "Error updating account");
      }
      setIsSuccess(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => handleUpdateAccount(e, "all")}
        className="space-y-6 bg-white p-4 md:p-6 rounded shadow-md"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Enter detail to update 
        </h2>
        {/* <div>
          <label className="block text-gray-700 mb-1">Full Name:</label>
          <input
            type="text"
            name="fullname"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
        <div>
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="w-full md:flex-1 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              "Update"
            )}
          </button>
          {/* <button
            type="button"
            onClick={(e) => handleUpdateAccount(e, "fullname")}
            disabled={loading}
            className="w-full md:flex-1 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              "Update Full Name"
            )}
          </button>
          <button
            type="button"
            onClick={(e) => handleUpdateAccount(e, "email")}
            disabled={loading}
            className="w-full md:flex-1 px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              "Update Email"
            )}
          </button> */}
        </div>
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