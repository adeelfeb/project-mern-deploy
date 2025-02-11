// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { setLoginStatus, setUserData } from '../store/authSlice';
// import { Button, Input, Logo } from "./index";
// import { useDispatch } from "react-redux";
// import authService from "../AserverAuth/auth";
// import { useForm } from "react-hook-form";
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import conf from '../conf/conf';
// import {Header} from './index';

// function Login() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { register, handleSubmit } = useForm();
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false); // Loading state

//     // Success and failure handlers for Google Login
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

//     // Handle login attempt
//     const login = async (data) => {
//         setError(""); // Clear any previous errors
//         setLoading(true); // Start loading
//         try {
//             const { accessToken, refreshToken } = await authService.login({
//                 emailOrUsername: data.email,
//                 password: data.password
//             });

//             const userData = await authService.getCurrentUser();

//             // Dispatch the user data to Redux store
//             dispatch(setUserData(userData));
//             dispatch(setLoginStatus(true));

//             // Redirect to the dashboard after successful login
//             navigate("/dashboard");
//         } catch (error) {
//             setError(error.response ? error.response.data.message : error.message);
//         } finally {
//             setLoading(false); // Stop loading
//         }
//     };

//     return (

//         <>
//     {/* <Header/> */}
//     <div className='flex items-center justify-center w-full min-h-screen bg-gray-50'>
//     {loading && ( // Conditional rendering for loading screen
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
//             <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//         </div>
//     )}

//     <div className='mx-auto w-full max-w-lg bg-white rounded-xl p-10 shadow-xl border border-gray-200'>
        
//         <h2 className="text-center text-3xl font-bold leading-tight text-gray-800">Sign in to your account</h2>
//         <p className="mt-2 text-center text-base text-gray-600">
//             Don&apos;t have an account?&nbsp;
//             <Link to="/signup" className="font-medium text-blue-500 transition-all duration-200 hover:underline">
//                 Sign Up
//             </Link>
//         </p>
//         {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

//         <form onSubmit={handleSubmit(login)} className='mt-8'>
//             <div className='space-y-5'>
//                 <Input
//                     label="Email / Username"
//                     placeholder="Enter your email or username"
//                     type="text"
//                     {...register("email", { required: "Email or Username is required" })}
//                     className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
//                 />
//                 <Input
//                     label="Password"
//                     type="password"
//                     placeholder="Enter your password"
//                     {...register("password", { required: "Password is required" })}
//                     className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
//                 />
                
//                 {/* Sign In Button */}
//                 <Button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
//                     Sign In
//                 </Button>

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
//                                     Sign in with Google
//                                 </Button>
//                             )}
//                         />
//                     </GoogleOAuthProvider>
//                 </div>

//                 {/* Forgot Password */}
//                 <p className="mt-4 text-center text-sm text-gray-500">
//                     <Link to="/forgot-password" className="font-medium text-blue-500 hover:underline">
//                         Forgot Password?
//                     </Link>
//                 </p>
//             </div>
//         </form>
//     </div>
// </div>


// </>

        
//     );
// }

// export default Login;





import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setLoginStatus, setUserData } from '../store/authSlice';
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../AserverAuth/auth";
import { useForm } from "react-hook-form";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import conf from '../conf/conf';
import { motion } from 'framer-motion'; // For animations

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

    // Handle Email/Password Login
    const login = async (data) => {
        setError("");
        setLoading(true);
        try {
            const { accessToken, refreshToken } = await authService.login({
                emailOrUsername: data.email,
                password: data.password
            });

            const userData = await authService.getCurrentUser();
            dispatch(setUserData(userData));
            dispatch(setLoginStatus(true));
            navigate("/dashboard");
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message);
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

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg bg-white rounded-xl p-8 shadow-2xl border border-gray-100"
                >
                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Don&apos;t have an account?&nbsp;
                        <Link to="/signup" className="font-medium text-blue-500 hover:underline">
                            Sign Up
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

                    <form onSubmit={handleSubmit(login)} className="space-y-6">
                        <Input
                            label="Email / Username"
                            placeholder="Enter your email or username"
                            type="text"
                            {...register("email", { required: "Email or Username is required" })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

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
                                        Sign in with Google
                                    </Button>
                                )}
                            />
                        </GoogleOAuthProvider>

                        <p className="text-center text-sm text-gray-500">
                            <Link to="/forgot-password" className="font-medium text-blue-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </>
    );
}

export default Login;