
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
//           <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//         </div>
//       )}

//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
//         <div className="w-full max-w-lg bg-white rounded-xl p-8 shadow-2xl border border-gray-100">
//           <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Create Your Account</h2>
//           <p className="text-center text-gray-600 mb-8">
//             Already have an account?&nbsp;
//             <Link to="/login" className="font-medium text-blue-500 hover:underline">
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
//                 {...register("username", { required: "Username is required" })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />

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




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setLoginStatus, setUserData } from '../store/authSlice';
import { Button, Input } from './index';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiImage, FiEye, FiEyeOff } from 'react-icons/fi'; // Importing FiImage, FiEye, and FiEyeOff from react-icons
import { auth, googleProvider } from "../utils/firebase"; // ✅ Import once
import { signInWithPopup } from "firebase/auth";
import authService from '../AserverAuth/auth';

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [avatar, setAvatar] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // Show password form after Google Sign-In
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

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

  const create = async (data) => {
    setError("");
    setLoading(true);
    try {
      const userData = await authService.createAccount({
        ...data,
        avatar,
        coverImage: null,
      });

      if (userData) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          dispatch(setUserData(currentUser));
          dispatch(setLoginStatus(true));
          navigate("/dashboard");
        }
      }
    } catch (error) {
      // Check if error has response and extract backend message
      if (error.response && error.response.data) {
        setError(error.response.data.messsage || "Something went wrong. Please try again.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="w-full max-w-lg bg-white rounded-xl p-8 shadow-2xl border border-gray-100">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Create Your Account</h2>
          <p className="text-center text-gray-600 mb-8">
            Already have an account?&nbsp;
            <Link to="/login" className="font-medium text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>

          {error && (
            <div className="text-red-600 text-center mb-6">
              {error}
            </div>
          )}

          {showPasswordForm ? (
            <form onSubmit={handleSubmit(create)} className="space-y-6">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Set a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[!@#$%^&*])/,
                      message: "Password must contain at least one special character",
                    },
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
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
              <Button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Set Password
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(create)} className="space-y-6">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                {...register("fullname", { required: "Full Name is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[!@#$%^&*])/,
                      message: "Password must contain at least one special character",
                    },
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
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
              <Input
                label="Username"
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Username can only contain letters, numbers, and underscores (_)",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}

              <div className="mt-4">
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Avatar (Optional)
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500 border rounded-lg p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="avatar" className="ml-3 flex items-center cursor-pointer border-2 p-2 rounded-lg">
                    <FiImage className="text-gray-500 text-xl" />
                    <span className="ml-2 text-sm text-gray-700">Avatar</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create Account
              </Button>
            </form>
          )}
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
            <span className='text-black'>Sign up with Google</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Signup;