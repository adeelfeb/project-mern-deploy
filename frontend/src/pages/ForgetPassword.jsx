import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../components';
import authService from '../AserverAuth/auth';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // To track success or error
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleForgotPassword = async (data) => {
    setLoading(true);
    setMessage(''); // Reset the message before making the request
    setIsSuccess(false); // Reset success state

    try {
      const response = await authService.forgetPassword(data.email);
      // console.log("The response was:", response);

      if (response.success) {
        setMessage(response.message); // Set success message
        setIsSuccess(true); // Mark as success
      } else {
        setMessage(response.message || 'Something went wrong. Please try again later.'); // Set error message
        setIsSuccess(false); // Mark as error
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('Something went wrong. Please try again later.'); // Set generic error message
      setIsSuccess(false); // Mark as error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gray-50">
      {/* Button Container */}
      <div className="w-full p-4 bg-gray-200 shadow-lg">
        <div className="flex justify-between space-x-4">
          {/* Homepage Button */}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            Homepage
          </button>

          {/* Login Button */}
          <div>
          <button
            onClick={() => navigate('/login')}
            className="px-4 mx-2 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            Login
          </button>

          {/* Signup Button */}
          <button
            onClick={() => navigate('/signup')}
            className="px-4 mx-2 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            Signup
          </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Form */}
      <div className="mx-auto w-full max-w-lg bg-white rounded-xl p-10 shadow-xl border border-gray-200 mt-8">
        <h2 className="text-center text-3xl font-bold leading-tight text-gray-800">Forgot Password</h2>
        <p className="mt-2 text-center text-base text-gray-600">
          Enter your email to receive a password reset link.
        </p>

        {/* Form for email input */}
        <form onSubmit={handleSubmit(handleForgotPassword)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}

            <Button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>

        {/* Message after form submission */}
        {message && (
          <p className={`mt-4 text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;