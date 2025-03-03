import React, { useState, useEffect } from "react";
import videoService from "../../AserverAuth/config.js";
import ToastNotification from "../toastNotification/ToastNotification.jsx";

function ChangePassword({isValid }) {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [hasPassword, setHasPassword] = useState(isValid);


// console.log("the user has password :", isValid)



  const handleChangePassword = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword?.value;
    const newPassword = e.target.newPassword.value;

    setLoading(true);
    setToastMessage("");

    try {
      const response = hasPassword
        ? await videoService.changeCurrentPassword(oldPassword, newPassword)
        : await videoService.setNewPassword(newPassword);

      setToastMessage(response.message || "Password updated successfully");
      setIsSuccess(true);
    } catch (error) {
      setToastMessage(error.message || "Error updating password");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleChangePassword} className="space-y-6 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {hasPassword ? "Change Password" : "Set Password"}
        </h2>
        
        {hasPassword && (
          <div>
            <label className="block text-gray-700 mb-1">Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        <div>
          <label className="block text-gray-700 mb-1">New Password:</label>
          <input
            type="password"
            name="newPassword"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Submit"}
        </button>
      </form>

      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          duration={3000}
          onClose={() => setToastMessage("")}
          position="bottom-right"
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}

export default ChangePassword;
