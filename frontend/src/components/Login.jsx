import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginStatus, setUserData } from "../store/authSlice";
import { Button, Input } from "./index";
import { useForm } from "react-hook-form";
import { auth, googleProvider } from "../utils/firebase";
import { FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import { signInWithPopup } from "firebase/auth";
import authService from "../AserverAuth/auth";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken(); // Get Firebase ID token

      // Send token to your backend
      const response = await authService.googleLogin(idToken);

      // Extract user data & tokens
      const { user: backendUser } = response.data;

      // Update Redux state
      dispatch(setUserData(backendUser));
      dispatch(setLoginStatus(true));

      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-in failed:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };





  const login = async (data) => {
    setError("");
    setLoading(true);
    try {
      // Perform login and get tokens
      const { accessToken, refreshToken } = await authService.login({
        emailOrUsername: data.email,
        password: data.password,
      });
  
      // // Get current user data
      const userData = await authService.getCurrentUser();
      
      // Update Redux store
      dispatch(setUserData(userData));
      dispatch(setLoginStatus(true));
  
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg bg-white rounded-xl p-8 shadow-2xl border border-gray-100">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
          <p className="text-center text-gray-600 mb-8">
            Don&apos;t have an account?&nbsp;
            <Link to="/signup" className="font-medium text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>

          {error && <div className="text-red-600 text-center mb-6">{error}</div>}

          <form onSubmit={handleSubmit(login)} className="space-y-6">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="input"
              {...register("email", { required: "Email is required" })}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                 
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-lg leading-0"
              >
                {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Sign In
            </Button>

            <div className="flex items-center justify-between my-6">
              <hr className="border-gray-300 flex-grow" />
              <span className="text-gray-500 mx-4">or</span>
              <hr className="border-gray-300 flex-grow" />
            </div>

            <Button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 bg-gray-200 text-black font-medium rounded-lg flex justify-center items-center gap-3 border border-gray-300 shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google Logo"
                className="w-6 h-6"
              />
              <span className="text-black">Login with Google</span>
            </Button>

            <p className="text-center text-sm text-gray-500">
              <Link to="/forgot-password" className="font-medium text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;

