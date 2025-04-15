// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import {Signup as SignupComponent } from '../components';
// import HeaderForLogin from './HeaderForLogin';

// function Signup() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center ">
   
//       <HeaderForLogin  navigate={navigate}/>

//       {/* Signup Form */}
//       <div className="w-full rounded-lg shadow-2xl">
//         <SignupComponent />
//       </div>


//     </div>
//   );
// }

// export default Signup;


import React from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming SignupComponent is the form component located at '../components/Signup'
import { Signup as SignupComponent } from '../components';

import SignupHeader from './SignupHeader';

function SignupPage() { // Renamed slightly for clarity (optional)
  const navigate = useNavigate();

  return (
    // Apply page background and layout controls here
    <div className="  bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center  pt-4 sm:pt-4">

      {/* Render the Header */}
      <SignupHeader navigate={navigate} />

      {/* Signup Card Container - Centered horizontally by items-center */}
      {/* Add margin-top for spacing from the header */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Add padding *around* the SignupComponent */}
        <div className="p-6 md:p-8">
          {/* Render the actual Signup Form Component */}
          <SignupComponent />
        </div>
      </div>

      {/* Optional: Footer text */}
      <p className="text-center text-gray-500 text-xs mt-8">
           ©{new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>

    </div>
  );
}

// Make sure default export matches the desired name if you renamed the function
export default SignupPage; // or export default Signup;