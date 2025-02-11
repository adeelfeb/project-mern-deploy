// import React, { useEffect, useState,  } from 'react';
// import { useDispatch } from 'react-redux';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import ChatList from "../components/chatlist/ChatList";
// import { useSidebar } from "../contexts/SidebarContext"; // Import the context
// import authService from '../AserverAuth/auth';
// import { useSelector } from 'react-redux';
// import DashboardContent from './DashBoardContent';
// import { resetUploadState } from '../store/fileSlice.js';
// import ToastNotification from "../components/toastNotification/ToastNotification.jsx"
// import Header from './Header2.jsx';

// // Custom Dashboard Component
// const DashboardComponent = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-full">
//       <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard</h1>
//       <p className="text-lg text-gray-600">Here you can upload your PDFs and interact with your chatbot.</p>
//       <div className="mt-8">
//         {/* Example Animation or Content */}
//         <div className="w-32 h-32 bg-blue-500 rounded-full animate-bounce"></div>
//       </div>
//     </div>
//   );
// };

// function DashboardLayout() {
//   const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication status
//   const [isUserLoggedOut, setIsUserLoggedOut] = useState(false); // Track logout status
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isSidebarOpen } = useSidebar(); // Access global state

//   const dispatch = useDispatch()
//   const isUploaded = useSelector((state) => state.file?.isUploaded || null);
//   const erroUpload = useSelector((state) => state.file?.fileUploadError || null);
  
//   const [toastMessage, setToastMessage] = useState(null);
//   const [isError, setIsError] = useState(false);
  
      
//         // Handle toast notification when fileName changes
//   useEffect(() => {
//     if (isUploaded) {
//       setToastMessage(`File Uploaded.`);
//       setIsError(false);

//       // Reset the state after the toast duration
//       setTimeout(() => {
//         dispatch(resetUploadState());
//         setToastMessage(null); // Clear the toast message
//       }, 3000); // Match the duration of your toast
//     }

//     if (erroUpload === true) {
//       setIsError(true);
//       setToastMessage(`Error Try again.`);

//       // Reset the state after the toast duration
//       setTimeout(() => {
//         dispatch(resetUploadState());
//         setToastMessage(null); // Clear the toast message
//       }, 3000); // Match the duration of your toast
//     }
//   }, [isUploaded, erroUpload, dispatch]);



  

//   const handleLogout = () => {
//     setIsUserLoggedOut(true); // Set the state to reflect that the user is logged out
//     navigate("/login");
//   };

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       const currentUser = await authService.getCurrentUser();
//       if (currentUser) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuthentication();
//   }, []); // Only run once when the component mounts

//   useEffect(() => {
//     if (isUserLoggedOut) {
//       navigate('/login'); // Navigate to login page when logged out
//     }
//   }, [isUserLoggedOut, navigate]); // This effect only runs when the user logs out

//   if (isAuthenticated === null) return <div className="text-black">Loading....</div>;

//   const isDashboardHome = location.pathname === "/dashboard" ;

//   return (
//     <div className="flex h-screen">
//       <Header />
//       {/* Sidebar */}
//       <aside className="lg:w-1/8 bg-[#fff4f4] text-gray transition-all duration-300">
//         <ChatList onLogout={handleLogout} /> 
//       </aside>

//       {/* Main Content Area */}
//       <main
//         className={`flex-1 bg-white text-gray-200 ${isSidebarOpen ? 'ml-1/4' : 'ml-0'} lg:ml-1/4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
//       >
//         <div>{isDashboardHome ? <DashboardContent /> : <Outlet />}</div>
//       </main>
//     {toastMessage && (
//                         <div className="fixed top-0 left-0 w-full flex justify-center z-50">
//                           <ToastNotification
//                             message={toastMessage}
//                             duration={3000}
//                             isSuccess={!isError}
//                           />
//                         </div>
//                       )}
      
//     </div>
//   );
// }

// export default DashboardLayout;




import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ChatList from "../components/chatlist/ChatList";
import { useSidebar } from "../contexts/SidebarContext"; // Import the context
import authService from '../AserverAuth/auth';
import { useSelector } from 'react-redux';
import DashboardContent from './DashBoardContent';
import { resetUploadState } from '../store/fileSlice.js';
import ToastNotification from "../components/toastNotification/ToastNotification.jsx";
import Header from './Header2.jsx';

function DashboardLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isUserLoggedOut, setIsUserLoggedOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const isUploaded = useSelector((state) => state.file?.isUploaded || null);
  const erroUpload = useSelector((state) => state.file?.fileUploadError || null);

  const [toastMessage, setToastMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isUploaded) {
      setToastMessage(`File Uploaded.`);
      setIsError(false);
      setTimeout(() => {
        dispatch(resetUploadState());
        setToastMessage(null);
      }, 3000);
    }
    if (erroUpload === true) {
      setIsError(true);
      setToastMessage(`Error Try again.`);
      setTimeout(() => {
        dispatch(resetUploadState());
        setToastMessage(null);
      }, 3000);
    }
  }, [isUploaded, erroUpload, dispatch]);

  const handleLogout = () => {
    setIsUserLoggedOut(true);
    navigate("/login");
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isUserLoggedOut) {
      navigate('/login');
    }
  }, [isUserLoggedOut, navigate]);

  if (isAuthenticated === null) return <div className="text-black">Loading....</div>;

  const isDashboardHome = location.pathname === "/dashboard";

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the Left */}
        <aside className={`${isSidebarOpen ? 'w-20' : 'w-0'} bg-[#fff4f4] transition-all duration-300 flex flex-col h-full`}>
          <ChatList onLogout={handleLogout} />
        </aside>

        {/* Main Content Area on the Right */}
        <main className="flex-1 bg-white ">
      <Header />
          <div>{isDashboardHome ? <DashboardContent /> : <Outlet />}</div>
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50">
          <ToastNotification message={toastMessage} duration={3000} isSuccess={!isError} />
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;