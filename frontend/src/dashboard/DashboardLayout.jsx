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
      <Header /> {/* Ensure the Header is outside the scrollable area */}
  
      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the Left */}
        <aside className={`${isSidebarOpen ? 'w-20' : 'w-0'} bg-[#fff4f4] transition-all duration-300 flex flex-col h-full`}>
          <ChatList onLogout={handleLogout} />
        </aside>
  
        {/* Main Content Area on the Right */}
        <main className="flex-1 bg-white overflow-y-auto">
          {/* Content starts below the header */}
          <div className=" h-full"> {/* Adjust pt-[64px] to match the header height */}
            {isDashboardHome ? <DashboardContent /> : <Outlet />}
          </div>
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