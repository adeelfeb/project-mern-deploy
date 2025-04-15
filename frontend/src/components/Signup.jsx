
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { setLoginStatus, setUserData } from '../store/authSlice';
// import { Button, Input } from './index';
// import { useDispatch } from 'react-redux';
// import { useForm } from 'react-hook-form';
// import { FiImage, FiEye, FiEyeOff } from 'react-icons/fi'; // Importing FiImage, FiEye, and FiEyeOff from react-icons
// import { auth, googleProvider } from "../utils/firebase"; // ✅ Import once
// import { signInWithPopup } from "firebase/auth";
// import authService from '../AserverAuth/auth';

// function Signup() {
//   const navigate = useNavigate();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [avatar, setAvatar] = useState(null);
//   const [showPasswordForm, setShowPasswordForm] = useState(false); // Show password form after Google Sign-In
//   const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     setError(""); // Clear previous errors

//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       const idToken = await user.getIdToken(); // Get Firebase ID token

//       // Send token to your backend
//       const response = await authService.googleLogin(idToken);

//       // Extract user data & tokens
//       const { user: backendUser } = response.data;

//       // Update Redux state
//       dispatch(setUserData(backendUser));
//       dispatch(setLoginStatus(true));

//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Google Sign-in failed:", error);
//       setError(error.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const create = async (data) => {
//     setError("");
//     setLoading(true);
//     try {
//       const userData = await authService.createAccount({
//         ...data,
//         avatar,
//         coverImage: null,
//       });

//       if (userData) {
//         const currentUser = await authService.getCurrentUser();
//         if (currentUser) {
//           dispatch(setUserData(currentUser));
//           dispatch(setLoginStatus(true));
//           navigate("/dashboard");
//         }
//       }
//     } catch (error) {
//       // Check if error has response and extract backend message
//       if (error.response && error.response.data) {
//         setError(error.response.data.messsage || "Something went wrong. Please try again.");
//       } else {
//         setError(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAvatarChange = (e) => {
//     setAvatar(e.target.files[0]);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
//           <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
//         </div>
//       )}

//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
//         <div className="w-full max-w-lg bg-white rounded-xl p-8 shadow-2xl border border-gray-100">
//           <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Create Your Account</h2>
//           <p className="text-center text-gray-600 mb-8">
//             Already have an account?&nbsp;
//             <Link to="/login" className="font-medium text-indigo-500 hover:underline">
//               Sign In
//             </Link>
//           </p>

//           {error && (
//             <div className="text-red-600 text-center mb-6">
//               {error}
//             </div>
//           )}

//           {showPasswordForm ? (
//             <form onSubmit={handleSubmit(create)} className="space-y-6">
//               <div className="relative">
//                 <Input
//                   label="Password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Set a password"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters",
//                     },
//                     pattern: {
//                       value: /^(?=.*[!@#$%^&*])/,
//                       message: "Password must contain at least one special character",
//                     },
//                   })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-lg leading-0"
//                 >
//                   {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm">{errors.password.message}</p>
//               )}
//               <Button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//               >
//                 Set Password
//               </Button>
//             </form>
//           ) : (
//             <form onSubmit={handleSubmit(create)} className="space-y-6">
//               <Input
//                 label="Full Name"
//                 placeholder="Enter your full name"
//                 {...register("fullname", { required: "Full Name is required" })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               <Input
//                 label="Email"
//                 placeholder="Enter your email"
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               <div className="relative">
//                 <Input
//                   label="Password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters",
//                     },
//                     pattern: {
//                       value: /^(?=.*[!@#$%^&*])/,
//                       message: "Password must contain at least one special character",
//                     },
//                   })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-lg leading-0"
//                 >
//                   {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm">{errors.password.message}</p>
//               )}
//               <Input
//                 label="Username"
//                 placeholder="Enter your username"
//                 {...register("username", {
//                   required: "Username is required",
//                   pattern: {
//                     value: /^[a-zA-Z0-9_]+$/,
//                     message: "Username can only contain letters, numbers, and underscores (_)",
//                   },
//                 })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-sm">{errors.username.message}</p>
//               )}

//               <div className="mt-4">
//                 <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
//                   Avatar (Optional)
//                 </label>
//                 <div className="mt-2 flex items-center">
//                   <input
//                     type="file"
//                     id="avatar"
//                     name="avatar"
//                     accept="image/*"
//                     onChange={handleAvatarChange}
//                     className="block w-full text-sm text-gray-500 border rounded-lg p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <label htmlFor="avatar" className="ml-3 flex items-center cursor-pointer border-2 p-2 rounded-lg">
//                     <FiImage className="text-gray-500 text-xl" />
//                     <span className="ml-2 text-sm text-gray-700">Avatar</span>
//                   </label>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//               >
//                 Create Account
//               </Button>
//             </form>
//           )}
//           <div className="flex items-center justify-between my-6">
//             <hr className="border-gray-300 flex-grow" />
//             <span className="text-gray-500 mx-4">or</span>
//             <hr className="border-gray-300 flex-grow" />
//           </div>

//           <Button
//             onClick={handleGoogleLogin}
//             type="button"
//             className="w-full py-3 bg-gray-200 text-black font-medium rounded-lg flex justify-center items-center gap-3 border border-gray-300 shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200"
//           >
//             <img
//               src="https://developers.google.com/identity/images/g-logo.png"
//               alt="Google Logo"
//               className="w-6 h-6"
//             />
//             <span className='text-black'>Sign up with Google</span>
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Signup;







// components/Signup.jsx (or wherever your Signup form component lives)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setLoginStatus, setUserData } from '../store/authSlice'; // Adjust path if needed
import { Button, Input } from './index'; // Adjust path if needed
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import { auth, googleProvider } from "../utils/firebase"; // Adjust path if needed
import { signInWithPopup } from "firebase/auth";
import authService from '../AserverAuth/auth'; // Adjust path if needed

// Ensure the function name matches the export used in the page component
function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [avatar, setAvatar] = useState(null);
  // const [showPasswordForm, setShowPasswordForm] = useState(false); // Keep if needed for Google flow
  const [showPassword, setShowPassword] = useState(false);

  // --- Your existing functions (handleGoogleLogin, create, handleAvatarChange, togglePasswordVisibility) remain here ---
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

      // Let App.js/routing handle redirection based on state
      // navigate("/dashboard"); // Usually remove direct navigation here

    } catch (error) {
      console.error("Google Sign-in failed:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const create = async (data) => {
    setError("");
    setLoading(true);
    try {
      // Ensure avatar is included correctly if it exists
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("username", data.username);
      if (avatar) {
        formData.append("avatar", avatar);
      }
      // Add coverImage if you have it: formData.append("coverImage", data.coverImage);

      // Call backend service with FormData
      const userDataResponse = await authService.createAccount(formData); // Pass FormData
      


        // Assuming createAccount returns the necessary user data or success status
      if (userDataResponse) { // Check if response indicates success
        // Optionally login the user immediately after signup
        const loginResponse = await authService.login({ emailOrUsername: data.email, password: data.password });
         if (loginResponse) {
            const currentUser = await authService.getCurrentUser();
             if (currentUser) {
              dispatch(setUserData(currentUser));
              dispatch(setLoginStatus(true));
              // Let App.js/routing handle navigation
              // navigate("/dashboard");
             }
         } else {
             // Handle case where signup succeeded but auto-login failed
             navigate("/login"); // Redirect to login page
         }

        }
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Signup failed. Please try again.";
      setError(errorMessage);
      console.error("Signup error:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
       setAvatar(e.target.files[0]);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // --- End functions ---

  return (
    // Use React Fragment as the top-level wrapper if needed (e.g., for the loading overlay)
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* REMOVED: The outer layout div (min-h-screen, flex, bg-gradient, etc.) */}
      {/* REMOVED: The card div (w-full, max-w-lg, bg-white, rounded, shadow, p-8) */}

      {/* Start directly with the content that goes INSIDE the card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-2 border-round">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Create Your Account
            </h2>
        </div>


      <p className="text-center text-sm text-gray-600 mb-6 sm:mb-8"> {/* Adjusted margin/size */}
        Already have an account? 
        <Link to="/login" className="font-medium text-indigo-500 hover:underline">
          Sign In
        </Link>
      </p>

      {error && (
        <div className="text-red-600 text-center mb-6 p-3 bg-red-100 rounded-md border border-red-300"> {/* Enhanced error styling */}
          {error}
        </div>
      )}

      {/* Removed the showPasswordForm logic unless specifically needed for a Google sign-up flow */}
      <form onSubmit={handleSubmit(create)} className="space-y-5 sm:space-y-6"> {/* Adjusted spacing */}
        {/* --- Input Fields --- */}
        <div> {/* Wrap input + error */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            {...register("fullname", { required: "Full Name is required" })}
            aria-invalid={errors.fullname ? "true" : "false"}
            className={errors.fullname ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} // Error styling
          />
          {errors.fullname && <p className="text-red-500 text-xs mt-1" role="alert">{errors.fullname.message}</p>}
        </div>

         <div> {/* Wrap input + error */}
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid email address",
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
             className={errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} // Error styling
          />
           {errors.email && <p className="text-red-500 text-xs mt-1" role="alert">{errors.email.message}</p>}
        </div>


        <div className="relative"> {/* Wrap input + error + toggle button */}
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              // Optional: Add regex pattern for complexity if desired
              // pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, message: "..." }
            })}
            aria-invalid={errors.password ? "true" : "false"}
            className={errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} // Error styling
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700" // Adjust 'top-7' based on Input style
             aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
           {errors.password && <p className="text-red-500 text-xs mt-1" role="alert">{errors.password.message}</p>}
        </div>


        <div> {/* Wrap input + error */}
          <Input
            label="Username"
            placeholder="Enter your username"
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[a-zA-Z0-9_]{3,20}$/, // Example: 3-20 alphanumeric chars + underscore
                message: "Username must be 3-20 characters (letters, numbers, _)",
              },
              // Optional: Add async validation to check if username is taken
            })}
             aria-invalid={errors.username ? "true" : "false"}
             className={errors.username ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} // Error styling
          />
          {errors.username && <p className="text-red-500 text-xs mt-1" role="alert">{errors.username.message}</p>}
        </div>

        {/* --- Avatar Input --- */}
        <div>
           <label htmlFor="avatar-input" className="block text-sm font-medium text-gray-700 mb-1">
               Avatar (Optional)
           </label>
            <Input
                id="avatar-input" // Match label's htmlFor
                type="file"
                accept="image/png, image/jpeg, image/jpg" // Be specific about accepted types
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                // Use onChange directly, no need for register if manually handling state
                onChange={handleAvatarChange}
            />
             {/* Optional: Preview image */}
             {/* {avatar && <img src={URL.createObjectURL(avatar)} alt="Avatar preview" className="mt-2 h-16 w-16 rounded-full object-cover"/>} */}
        </div>


        {/* --- Submit Button --- */}
        <Button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      {/* --- OR Divider and Google Button --- */}
      {/* <div className="flex items-center justify-between my-6">
        <hr className="border-gray-300 flex-grow" />
        <span className="text-gray-500 text-sm mx-4">OR</span>
        <hr className="border-gray-300 flex-grow" />
      </div>

      <Button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full py-3 bg-white text-gray-700 font-medium rounded-lg flex justify-center items-center gap-3 border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={loading}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          className="w-5 h-5" // Slightly smaller logo
        />
        <span>Sign up with Google</span>
      </Button> */}
      {/* --- End Content --- */}
    </>
  );
}

// Make sure the export name is correct
export default Signup;