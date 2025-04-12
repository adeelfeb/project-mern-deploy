import React, { useState, useEffect } from 'react';
// Removed FaChartLine as it's not used for basic stats
import { FaUsers, FaVideo, FaCog, FaBell, FaFileUpload, FaUserCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service'; // Adjust path as needed

// --- Simplified StatCard Component ---
// Removed the 'change' prop and associated display logic
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex items-center space-x-4">
    {/* Icon wrapper for consistent sizing */}
    <div className="text-3xl p-3 rounded-full bg-gray-100 text-gray-600">
       {icon}
    </div>
    {/* Text content */}
    <div>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-800">{value ?? '...'}</p> {/* Added nullish coalescing */}
    </div>
  </div>
);


// --- Updated AdminDashboard Component ---
const AdminDashboard = () => {
  const [stats, setStats] = useState(null); // State for { totalUsers, activeUsers, totalVideos }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
    // Fetch dashboard data on component mount
    useEffect(() => {
      const fetchDashboardData = async () => {
        setLoading(true);
        setError(null); // Reset error on fetch attempt
        try {
          // Assuming adminService.getDashboardStats() returns the object you logged:
          // { success: true, data: { activeUsers: ..., totalUsers: ... }, message: ..., statusCode: ... }
          const statsResponse = await adminService.getDashboardStats();
          // console.log("Admin Stats API Response:", statsResponse);
  
          // --- CORRECTED LOGIC ---
          // Check only the main success flag from the response object
          if (statsResponse.success && statsResponse.data) { // Check if data object exists too
              // Access the stats data directly from statsResponse.data
              setStats(statsResponse.data);
          }
          // Handle cases where fetching failed (caught by catch block)
          // Or where success is false in the response
          else {
               throw new Error(statsResponse.message || 'Failed to fetch dashboard statistics or received invalid data.');
          }
        } catch (err) {
           console.error("Error fetching dashboard data:", err);
           // Set a user-friendly error message
           setError({ message: err.message || "An error occurred while loading dashboard data." });
        } finally {
          setLoading(false);
        }
      };
  
      fetchDashboardData();
    }, []); // Empty dependency array means this runs once on mount

  // Quick actions (static data - kept as is)
  const quickActions = [
    { icon: <FaUsers className="text-blue-500" />, title: 'Manage Users', link: '/admin/users' },
    { icon: <FaVideo className="text-green-500" />, title: 'View Content', link: '/admin/videos' },
    { icon: <FaFileUpload className="text-purple-500" />, title: 'Upload Video', link: '/admin/upload-video' },
    { icon: <FaCog className="text-yellow-500" />, title: 'Settings', link: '/admin/settings' }
  ];

  // --- Loading State ---
  if (loading) {
    return (
      // Centered loading spinner within the container
      <div className="flex items-center justify-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg h-full flex flex-col items-center justify-center">
        <p className="font-semibold mb-2">Error loading dashboard:</p>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()} // Simple retry by reloading page
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Main Dashboard Content ---
  return (
    // --- Parent Height Control ---
    // h-full: Takes full height of its parent container.
    // overflow-y-auto: Enables vertical scrollbar ONLY if content exceeds the container height.
    // bg-gray-50: Optional light background for the dashboard area.
    <div className="p-4 sm:p-6 h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        {/* Bell icon kept for potential future notifications */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <FaBell className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards - Updated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Display stats only when loaded */}
        {stats ? (
          <>
            <StatCard
              icon={<FaUsers className="text-blue-500" />}
              title="Total Users"
              value={stats.totalUsers}
            />
            <StatCard
              // Using a different icon for Active Users for clarity
              icon={<FaUserCheck className="text-green-500" />}
              title="Active Users"
              value={stats.activeUsers}
            />
            <StatCard
              icon={<FaVideo className="text-purple-500" />}
              title="Total Videos"
              value={stats.totalVideos}
            />
          </>
        ) : (
           // Optional: Show placeholders or nothing if stats haven't loaded but not in loading/error state
           <p className="text-gray-500 col-span-full">Stats data is unavailable.</p>
        )}
      </div>

      {/* Quick Actions - Kept as is */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
        {/* Responsive grid for quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              to={action.link}
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;