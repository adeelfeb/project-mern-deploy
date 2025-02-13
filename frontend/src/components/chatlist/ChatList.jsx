import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { LuPlus } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { BiHomeAlt } from "react-icons/bi";
import { TfiReload } from "react-icons/tfi";
import { PiTreeStructureLight } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import authService from '../../AserverAuth/auth';
import { BiChat } from "react-icons/bi"; // Import the chat icon

function ChatList() {
  const { isSidebarOpen } = useSidebar();
  const [currentUser, setCurrentUser] = useState(null);
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
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const handleReload = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`
      bg-gray-50 border-r shadow-md flex flex-col h-screen transition-all duration-300
      ${isSidebarOpen ? 'w-20 p-2 ' : 'hidden'}
    `}>
      
      {/* Top Heading - Summarize Logo */}
      <div className="flex items-center justify-center p-2 border-b">
        <h1 className="text-lg font-bold text-gray-800">YS</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-1 gap-4 mt-4">
        <Link to="/dashboard/input-url" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/dashboard/uploadpdf') ? 'bg-gray-100' : ''}`}>
          <LuPlus className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Input</span>
        </Link>

        {/* <Link to="/dashboard/chat" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/dashboard/chat') ? 'bg-gray-100' : ''}`}>
          <BiHomeAlt className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Chat</span>
        </Link> */}


      <Link
          to="/dashboard/chat"
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${
            isActive("/dashboard/chat") ? "bg-gray-100" : ''
          }`}
        >
          <BiChat className="w-5 h-5 text-gray-600" /> 
          <span className="text-xs mt-1 text-gray-600">Chat</span>
        </Link>

  
        <Link to="/dashboard/user-history" className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/dashboard/user-history') ? 'bg-gray-100' : ''}`}>
          <PiTreeStructureLight className="w-4 h-4 rotate-90" />
          <span className="text-xs mt-1 text-gray-600">History</span>
        </Link>
        <button onClick={handleReload} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200">
          <TfiReload className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Reload</span>
        </button>

      </div>

      {/* Bottom Section - User Avatar & Settings */}
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
        <button onClick={handleLogout} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 text-red-500">
          <IoIosLogOut className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default ChatList;