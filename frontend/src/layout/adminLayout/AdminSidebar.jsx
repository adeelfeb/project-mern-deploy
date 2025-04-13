import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuPlus } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { BiChat } from "react-icons/bi";
import { BiUpload } from "react-icons/bi";
import { PiTreeStructureLight } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUsersCog, FaBoxOpen, FaCog, FaVideo, FaPlusCircle  } from "react-icons/fa"; // Admin-specific icons
import authService from '../../AserverAuth/auth';

export const AdminSidebar = () => {
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
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleReload = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className={`
      bg-gray-50 border-r shadow-md flex flex-col h-screen transition-all duration-300 w-20 p-2
    `}>
      {/* Top Navigation */}
      <div className="flex flex-col flex-1 gap-4 mt-2">
        
        {/* Admin Dashboard Link */}
        <Link 
          to="/admin/dashboard" 
          className={`flex flex-col items-center justify-center p-2 rounded-md mt-8 hover:bg-gray-200 ${isActive('/admin/dashboard') ? 'bg-gray-100' : ''}`}
        >
          <FaBoxOpen className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Dashboard</span>
        </Link>
        

        {/* User Management Link */}
        <Link 
          to="/admin/users" 
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/users') ? 'bg-gray-100' : ''}`}
        >
          <FaUsersCog className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Edit</span>
        </Link>


        <Link 
          to="/admin/videos" 
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/videos') ? 'bg-gray-100' : ''}`}
        >
          <FaVideo className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Videos</span>
        </Link>

        <Link 
          to="/admin/add" 
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/add') ? 'bg-gray-100' : ''}`}
        >
          <FaPlusCircle className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Add</span>
        </Link>

        <br />
        <br />

        {/* Input URL Link */}
        <Link 
          to="/admin/input-url" 
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/input-url') ? 'bg-gray-100' : ''}`}
        >
          <LuPlus className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Input</span>
        </Link>

        {/* Upload Video Link */}
        <Link 
          to="/admin/upload-video" 
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/upload-video') ? 'bg-gray-100' : ''}`}
        >
          <BiUpload className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Upload</span>
        </Link>
        

        {/* User History */}
        <Link 
          to="/admin/history"  
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/history') ? 'bg-gray-100' : ''}`}
        >
          <PiTreeStructureLight className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">History</span>
        </Link>


        {/* Regular User Features (optional) */}
        <Link 
          to="/admin/chat" 
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/chat') ? 'bg-gray-100' : ''}`}
        >
          <BiChat className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Chat</span>
        </Link>

      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center p-2 gap-4 border-t">
        {currentUser && (
          <img
            src={currentUser.avatar || '/default-avatar.png'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border"
          />
        )}

        {/* Admin Settings */}
        <Link 
          to="/admin/settings" 
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 ${isActive('/admin/settings') ? 'bg-gray-100' : ''}`}
        >
          <FaCog className="w-4 h-4" />
          <span className="text-xs mt-1 text-gray-600">Settings</span>
        </Link>

        {/* Logout Button */}
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
};