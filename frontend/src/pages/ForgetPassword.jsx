

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../components'; // Assuming these are styled components
import authService from '../AserverAuth/auth';
import { useNavigate } from 'react-router-dom';
import ForgetPasswordHeader from './home/ForgetPasswordHeader'; // Assuming this provides necessary navigation/branding

function ForgetPassword() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // To track success or error
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleForgotPassword = async (data) => {
    setLoading(true);
    setMessage(''); // Reset message
    setIsSuccess(false); // Reset success state

    try {
      const response = await authService.forgetPassword(data.email);
      if (response.success) {
        setMessage(response.message);
        setIsSuccess(true);
      } else {
        setMessage(response.message || 'Failed to send reset link. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setMessage('An unexpected error occurred. Please try again later.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container: Full height, centered content, subtle background
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">

      {/* Optional Header - Assuming it handles its own styling */}
      <ForgetPasswordHeader navigate={navigate} />

      {/* Form Card: Centered, rounded, shadowed, padded */}
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mt-8">

        {/* Card Header */}
        <div>
          {/* You might add a logo here */}
          {/* <img className="mx-auto h-12 w-auto" src="/path/to/your/logo.svg" alt="Workflow" /> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            No problem! Enter your email address below and we'll send you a link to reset it.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleForgotPassword)} className="mt-8 space-y-6">
          {/* Hidden input for accessibility or honeypot, if needed */}
          {/* <input type="hidden" name="remember" defaultValue="true" /> */}

          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Input Field */}
            <div>
              <Input
                label="Email address" // Clearer label
                labelClassName="sr-only" // Hide label visually, but keep for screen readers if Input component supports it
                id="email-address" // Added id for label association
                type="email"
                placeholder="Enter your email address"
                autoComplete="email" // Helps with browser autofill
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                // Enhanced styling for input field
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:z-10 sm:text-sm dark:border-gray-600`}
              />
              {errors.email && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition duration-150 ease-in-out"
              disabled={loading}
            >
              {/* Loading indicator inside button */}
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Password Reset Link'
              )}
            </Button>
          </div>
        </form>

        {/* Status Message Area */}
        {message && (
          <div className={`mt-4 p-3 rounded-md ${isSuccess ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'}`}>
            <p className={`text-sm font-medium text-center ${isSuccess ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {message}
            </p>
          </div>
        )}

        {/* Optional: Link back to Login */}
        <div className="text-sm text-center">
          <button
            onClick={() => navigate('/login')} // Assuming your login route is '/login'
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Remembered your password? Sign in
          </button>
        </div>

      </div>
    </div>
  );
}

export default ForgetPassword;