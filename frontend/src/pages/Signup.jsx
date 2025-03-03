import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Signup as SignupComponent } from '../components';

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
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
            onClick={() => navigate('/forgot-password')}
            className="px-4 mx-2 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            Forget
          </button>

          {/* Signup Button */}
          <button
            onClick={() => navigate('/login')}
            className="px-4 mx-2 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            Login
          </button>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="w-full rounded-lg shadow-2xl">
        <SignupComponent />
      </div>


    </div>
  );
}

export default Signup;