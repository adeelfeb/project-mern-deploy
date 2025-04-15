// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import {  Login as LoginComp } from '../components';

// function Login() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center ">
//       {/* Homepage Button */}
//       <div className="w-full p-4 bg-gray-200 shadow-lg">
//         <div className="flex justify-between space-x-4">
//           {/* Homepage Button */}
//           <button
//             onClick={() => navigate('/')}
//             className="px-4 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
//           >
//             Homepage
//           </button>

//           {/* Login Button */}
//           <div>
//           <button
//             onClick={() => navigate('/forgot-password')}
//             className="px-4 mx-2 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
//           >
//             Forget
//           </button>

//           {/* Signup Button */}
//           <button
//             onClick={() => navigate('/signup')}
//             className="px-4 mx-2 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
//           >
//             Signup
//           </button>
//           </div>
//         </div>
//       </div>

//       {/* Signup Form */}
//       <div className="w-full rounded-lg shadow-2xl">
//         <LoginComp />
//       </div>


//     </div>
//   );
// }

// export default Login;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Login as LoginComp } from '../components'; // Assuming LoginComp is your form fields component
import HeaderForLogin from './HeaderForLogin'; // Make sure the path is correct

function Login() {
  // Initialize navigate here in the parent component
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">

      {/* Render HeaderForLogin and pass the navigate function as a prop */}
      <HeaderForLogin navigate={navigate} />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Card Header */}
        {/* Adjusted padding slightly for better balance, e.g., p-6 */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Welcome Back!
            </h2>
             <p className="text-purple-100 text-center text-sm mt-2">
                Please login to your account.
             </p>
        </div>


        <div className="p-6 md:p-8"> {/* <--- Increased padding here from p-2 */}
          <LoginComp />
        </div>
      </div>

       {/* Optional: Footer text */}
       <p className="text-center text-gray-500 text-xs mt-8">
           ©{new Date().getFullYear()} Your Company Name. All rights reserved.
       </p>
    </div>
  );
}

export default Login;