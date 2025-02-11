// import { setLoginStatus, setUserData } from '../store/authSlice.js';
// import React, { useState } from 'react';
// import authService from '../AserverAuth/auth';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button, Input, Logo } from './index.js';
// import { useDispatch } from 'react-redux';
// import { useForm } from 'react-hook-form';
// import { FiImage } from 'react-icons/fi'; // Importing FiImage from react-icons
// import conf from '../conf/conf';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// function Signup() {
//     const navigate = useNavigate();
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const dispatch = useDispatch();
//     const { register, handleSubmit } = useForm();
//     const [avatar, setAvatar] = useState(null);



//     const handleGoogleSuccess = async (credentialResponse) => {
//         const { credential } = credentialResponse;
//         setLoading(true); // Start loading
//         try {
//             const response = await authService.googleLogin({ tokenId: credential });
//             console.log('Backend response:', response);
            
//             // Assuming successful login also retrieves user data
//             const userData = await authService.getCurrentUser();
//             dispatch(setUserData(userData));
//             dispatch(setLoginStatus(true));

//         } catch (error) {
//             console.error('Login failed:', error);
//             setError(error.response ? error.response.data.message : error.message);
//         } finally {
//             setLoading(false); // Stop loading
//         }
//     };

//     const handleGoogleFailure = () => {
//         console.error('Google Login Failed');
//     };

//     const create = async (data) => {
//         setError("");
//         setLoading(true); // Start loading
//         try {
//             // Include avatar if selected
//             const userData = await authService.createAccount({
//                 ...data,
//                 avatar,
//             });

//             if (userData) {
//                 const userData = await authService.getCurrentUser();
//                 if (userData) {
//                     dispatch(setUserData(userData));
//                     dispatch(setLoginStatus(true));
//                 }
//             }
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false); // Stop loading
//         }
//     };

//     const handleAvatarChange = (e) => {
//         setAvatar(e.target.files[0]);
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             {loading ? (
//                 <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
//                     <div className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
//                 </div>
//             ) : null}

//             <div className="mx-auto w-full max-w-lg bg-white rounded-xl p-10 shadow-lg border border-gray-200">
                
//                 <h2 className="text-center text-2xl font-semibold text-gray-800">Sign up to create account</h2>
//                 <p className="mt-2 text-center text-base text-gray-600">
//                     Already have an account?&nbsp;
//                     <Link
//                         to="/login"
//                         className="font-medium text-blue-500  hover:underline"
//                     >
//                         Sign In
//                     </Link>
//                 </p>
//                 {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
//                 <br />

//                 <form onSubmit={handleSubmit(create)} className="space-y-5">
//                     <Input
//                         label="Full Name: "
//                         placeholder="Enter your full name"
//                         {...register("fullname", { required: true })}
//                     />
//                     <Input
//                         label="Email: "
//                         placeholder="Enter your email"
//                         type="email"
//                         {...register("email", {
//                             required: true,
//                             validate: {
//                                 matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
//                                     "Email address must be valid",
//                             },
//                         })}
//                     />
//                     <Input
//                         label="Password: "
//                         type="password"
//                         placeholder="Enter your password"
//                         {...register("password", { required: true })}
//                     />
//                     <Input
//                         label="Username: "
//                         placeholder="Enter your username"
//                         {...register("username", { required: true })}
//                     />
//                     {/* Avatar upload with FiImage icon */}
//                     <div className="mt-4">
//                         <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
//                             Avatar (Optional)
//                         </label>
//                         <div className="mt-2 flex items-center">
//                             <input
//                                 type="file"
//                                 id="avatar"
//                                 name="avatar"
//                                 accept="image/*"
//                                 onChange={handleAvatarChange}
//                                 className="block w-full text-sm text-gray-500 border rounded-lg p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                             <label htmlFor="avatar" className="ml-3 flex items-center cursor-pointer border-2 p-2 rounded-lg">
//                                 <FiImage className="text-gray-500 text-xl" />
//                                 <span className="ml-2 text-sm text-gray-700 ">Avatar</span>
//                             </label>
//                         </div>
//                     </div>

//                     <Button type="submit" className="w-full mt-6 bg-primary text-white rounded-lg py-3 hover:bg-primary-dark">
//                         Create Account
//                     </Button>
//                 </form>
//                 {/* Divider for Google Sign In */}
//                 <div className="mt-4 flex items-center justify-between">
//                     <hr className="border-gray-300 flex-grow" />
//                     <span className="text-gray-600 mx-4">or</span>
//                     <hr className="border-gray-300 flex-grow" />
//                 </div>

//                 {/* Google Login Button */}
//                 <div className="mt-4">
//                     <GoogleOAuthProvider clientId={conf.googleClientId}>
//                         <GoogleLogin
//                             onSuccess={handleGoogleSuccess}
//                             onError={handleGoogleFailure}
//                             useOneTap
//                             redirectUri={conf.googleRedirectUri}
//                             render={(renderProps) => (
//                                 <Button
//                                     onClick={renderProps.onClick}
//                                     disabled={renderProps.disabled}
//                                     className="w-full py-3 bg-red-600 text-white rounded-md flex justify-center items-center gap-2 hover:bg-red-700 transition-colors duration-200"
//                                 >
//                                     Sign up with Google
//                                 </Button>
//                             )}
//                         />
//                     </GoogleOAuthProvider>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Signup;




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setLoginStatus, setUserData } from '../store/authSlice';
import { Button, Input } from './index';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiImage } from 'react-icons/fi'; // Importing FiImage from react-icons
import conf from '../conf/conf';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion'; // For animations

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [avatar, setAvatar] = useState(null);

    // Handle Google Login Success
    const handleGoogleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        setLoading(true);
        try {
            const response = await authService.googleLogin({ tokenId: credential });
            console.log('Backend response:', response);

            const userData = await authService.getCurrentUser();
            dispatch(setUserData(userData));
            dispatch(setLoginStatus(true));
            navigate("/dashboard");
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleFailure = () => {
        console.error('Google Login Failed');
    };

    // Handle Signup
    const create = async (data) => {
        setError("");
        setLoading(true);
        try {
            const userData = await authService.createAccount({
                ...data,
                avatar,
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
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Avatar Change
    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            )}

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg bg-white rounded-xl p-8 shadow-2xl border border-gray-100"
                >
                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Create Your Account</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Already have an account?&nbsp;
                        <Link to="/login" className="font-medium text-blue-500 hover:underline">
                            Sign In
                        </Link>
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-center mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

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
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Input
                            label="Username"
                            placeholder="Enter your username"
                            {...register("username", { required: "Username is required" })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {/* Avatar Upload */}
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

                    {/* Divider for Google Sign In */}
                    <div className="mt-6 flex items-center justify-between">
                        <hr className="border-gray-300 flex-grow" />
                        <span className="text-gray-500 mx-4">or</span>
                        <hr className="border-gray-300 flex-grow" />
                    </div>

                    {/* Google Login Button */}
                    <div className="mt-6">
                        <GoogleOAuthProvider clientId={conf.googleClientId}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                                useOneTap
                                render={(renderProps) => (
                                    <Button
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                        className="w-full py-3 bg-red-600 text-white rounded-lg flex justify-center items-center gap-2 hover:bg-red-700 transition-colors duration-200"
                                    >
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                            alt="Google Logo"
                                            className="w-5 h-5"
                                        />
                                        Sign up with Google
                                    </Button>
                                )}
                            />
                        </GoogleOAuthProvider>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default Signup;