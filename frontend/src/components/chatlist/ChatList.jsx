// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useSidebar } from '../../contexts/SidebarContext';
// import { LuPlus } from "react-icons/lu";
// import { IoIosLogOut } from "react-icons/io";
// import { BiHomeAlt } from "react-icons/bi";
// import { TfiReload } from "react-icons/tfi";
// import { PiTreeStructureLight } from "react-icons/pi";
// import { CiSettings } from "react-icons/ci";
// import authService from '../../AserverAuth/auth';
// import { BiChat } from "react-icons/bi"; // Import the chat icon
// import { BiUpload } from "react-icons/bi";


// function ChatList() {
//   const { isSidebarOpen } = useSidebar();
//   const [currentUser, setCurrentUser] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const user = await authService.getCurrentUser();
//         setCurrentUser(user);
//       } catch (error) {
//         console.error("Error fetching current user:", error);
//       }
//     };
//     fetchCurrentUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await authService.logout();
//       // The redirect happens inside authService.logout()
//     } catch (error) {
//       console.error("Logout failed:", error);
//       // Fallback cleanup if API call fails
//       localStorage.clear();
//       sessionStorage.clear();
//       window.location.href = "/login";
//     }
//   };

//   const handleReload = () => {
//     sessionStorage.clear();
//     window.location.reload();
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className={`
//       bg-gray-50 border-r shadow-md flex flex-col h-screen transition-all duration-300
//       ${isSidebarOpen ? 'w-20 p-2 ' : 'hidden'}
//     `}>
      
//       {/* Navigation Links */}
//       <div className="flex flex-col flex-1 gap-4 mt-2">
//         <Link to="/dashboard/input-url" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/dashboard/uploadpdf') ? 'bg-gray-100' : ''}`}>
//           <LuPlus className="w-4 h-4" />
//           <span className="text-xs mt-1 text-gray-600">Input</span>
//         </Link>

//         <Link
//           to="/dashboard/upload-video"
//           className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${
//             isActive("/dashboard/upload-video") ? "bg-gray-100" : ''
//           }`}
//         >
//           <BiUpload className="w-4 h-4 text-gray-600" /> {/* Upload icon */}
//           <span className="text-xs mt-1 text-gray-600">Upload</span>
//         </Link>

//         <Link to="/dashboard/user-history" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/dashboard/user-history') ? 'bg-gray-100' : ''}`}>
//           <PiTreeStructureLight className="w-4 h-4 rotate-90" />
//           <span className="text-xs mt-1 text-gray-600">History</span>
//         </Link>

//         <Link
//           to="/dashboard/chat"
//           className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${
//             isActive("/dashboard/chat") ? "bg-gray-100" : ''
//           }`}
//         >
//           <BiChat className="w-5 h-5 text-gray-600" /> 
//           <span className="text-xs mt-1 text-gray-600">Chat</span>
//         </Link>

//         <button onClick={handleReload} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200">
//           <TfiReload className="w-4 h-4" />
//           <span className="text-xs mt-1 text-gray-600">Reload</span>
//         </button>
//       </div>

//       {/* Bottom Section - User Avatar & Settings */}
//       <div className="flex flex-col items-center p-2 gap-4 border-t">
//         {currentUser && (
//           <img
//             src={currentUser.avatar || '/default-avatar.png'}
//             alt="User Avatar"
//             className="w-8 h-8 rounded-full border"
//           />
//         )}
//         <Link to="/dashboard/settings" className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200">
//           <CiSettings className="w-4 h-4" />
//           <span className="text-xs mt-1 text-gray-600">Settings</span>
//         </Link>
//         <button onClick={handleLogout} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 text-red-500">
//           <IoIosLogOut className="w-4 h-4" />
//           <span className="text-xs mt-1 text-gray-600">Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatList;





import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { LuPlus } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { BiHomeAlt } from "react-icons/bi";
import { TfiReload } from "react-icons/tfi";
import { PiTreeStructureLight } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import { BiChat } from "react-icons/bi";
import { BiUpload } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Spinner icon
import authService from '../../AserverAuth/auth';

function ChatList() {
  const { isSidebarOpen } = useSidebar();
  const [currentUser, setCurrentUser] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await authService.logout();
      // Redirect happens inside logout
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleReload = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`
      bg-gray-50 border-r shadow-md flex flex-col h-screen transition-all duration-300
      ${isSidebarOpen ? 'w-20 p-2' : 'hidden'}
    `}>
      <div className="flex flex-col flex-1 gap-4 mt-2">
        <Link to="/dashboard/input-url" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/dashboard/uploadpdf') ? 'bg-gray-100' : ''}`}>
          <LuPlus className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Input</span>
        </Link>

        <Link to="/dashboard/upload-video" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive("/dashboard/upload-video") ? "bg-gray-100" : ''}`}>
          <BiUpload className="w-4 h-4 text-gray-600" />
          <span className="text-xs mt-1 text-gray-600">Upload</span>
        </Link>

        <Link to="/dashboard/user-history" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/dashboard/user-history') ? 'bg-gray-100' : ''}`}>
          <PiTreeStructureLight className="w-4 h-4 rotate-90" />
          <span className="text-xs mt-1 text-gray-600">History</span>
        </Link>

        <Link to="/dashboard/chat" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive("/dashboard/chat") ? "bg-gray-100" : ''}`}>
          <BiChat className="w-5 h-5 text-gray-600" />
          <span className="text-xs mt-1 text-gray-600">Chat</span>
        </Link>

        <button onClick={handleReload} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200">
          <TfiReload className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Reload</span>
        </button>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center p-2 gap-4 border-t">
        {currentUser && (
          <img
            src={currentUser.avatar || '/default-avatar.png'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border"
          />
        )}
        <Link to="/dashboard/settings" className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200">
          <CiSettings className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className={`flex flex-col items-center justify-center p-2 rounded-md ${
            logoutLoading ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-200'
          } text-red-500`}
        >
          {logoutLoading ? (
            <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
          ) : (
            <IoIosLogOut className="w-4 h-4" />
          )}
          <span className="text-xs mt-1 text-gray-600">
            {logoutLoading ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ChatList;
