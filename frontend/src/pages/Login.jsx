// import React from 'react';
// import {  Login as LoginComp } from '../components';

// function Login() {
//   return (
//     <div>
//     <div className="min-h-screen flex items-center justify-center">
//       <LoginComp />
//     </div>
//     </div>
//   );
// }

// export default Login;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import {  Login as LoginComp } from '../components';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      {/* Homepage Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 px-4 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
      >
        Homepage
      </button>

      {/* Signup Form */}
      <div className="w-full rounded-lg shadow-2xl p-6">
        <LoginComp />
      </div>


    </div>
  );
}

export default Login;