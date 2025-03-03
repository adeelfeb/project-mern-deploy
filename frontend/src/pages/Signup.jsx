// import React from 'react'
// import { Footer, Signup as SignupComponent } from '../components'
// function Signup() {
//   return (
//     <div>
//     <div className='min-h-screen flex items-center justify-center'>
//         <SignupComponent/>
//     </div>
//     <Footer/>
//     </div>
//   )
// }

// export default Signup



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer, Signup as SignupComponent } from '../components';

function Signup() {
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
        <SignupComponent />
      </div>


    </div>
  );
}

export default Signup;