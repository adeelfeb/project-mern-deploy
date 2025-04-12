


import React, { useEffect, useState } from "react";
import VideoService from "../../AserverAuth/config.js"; // Assuming correct path

// Simple Spinner component (optional, but nice for loading)
const Spinner = () => (
  <div className="flex justify-center items-center h-20">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function CurrentUserDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Explicit loading state
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true); // Start loading
      setError(""); // Clear previous errors
      try {
        // Make sure the service method returns the data structure you posted
        // If it returns { statusCode, data, message }, you might need user.data
        const response = await VideoService.getCurrentUser();

        // --- IMPORTANT: Adjust based on actual response structure ---
        // If VideoService.getCurrentUser() returns the user object directly:
        const user = response;
        // If it returns an object like { statusCode: 200, data: { user object }, message: ... }
        // const user = response?.data;
        // -----------------------------------------------------------

        // console.log("User details response:", user); // Log the exact data received

        if (user && typeof user === 'object' && user.email) { // Basic check if user data looks valid
          setUserDetails(user);
        } else {
          // Handle cases where the data might be nested or response structure is different
          console.error("Unexpected user data structure:", response);
          setError("Failed to retrieve valid user data structure.");
        }

      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.message || "An unexpected error occurred while fetching user details.");
        setUserDetails(null); // Clear any stale data on error
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchUserDetails();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to format timestamp to a more readable local format
  const formatDateToLocal = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      // Example: "December 4, 2024, 3:38 AM" (adjust options as needed)
      return new Intl.DateTimeFormat(navigator.language || 'en-US', { // Use browser language preference
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        // timeZoneName: 'short' // Optionally show timezone
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", timestamp, e);
      return "Invalid Date";
    }
  };

  // Helper component for displaying details neatly
  const DetailItem = ({ label, value, className = "" }) => (
    <div className={`py-2 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  );

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Loading User Details...</h2>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-300 rounded-lg shadow-md text-red-700">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!userDetails) {
    // This case might occur if loading finished but userDetails is still null (e.g., API returned null/empty)
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow-md text-yellow-700">
        <h2 className="text-xl font-semibold mb-2">No User Data</h2>
        <p>Could not find details for the current user.</p>
      </div>
    );
  }

  // --- Successful Data Display ---
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
       {/* Optional Cover Image */}
       {userDetails.coverImage && (
         <div className="h-32 sm:h-40 bg-gray-200">
            <img
                src={userDetails.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
            />
         </div>
       )}

      <div className="p-4 sm:p-6">
        {/* Avatar and Name Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-5 -mt-16 sm:-mt-20">
          <img
            src={userDetails.avatar}
            alt={`${userDetails.fullname}'s Avatar`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md" // Added border & shadow
          />
          <div className="text-center sm:text-left pt-4 sm:pt-0">
            <h1 className="text-2xl font-bold text-gray-800">{userDetails.fullname}</h1>
            <p className="text-sm text-gray-500">@{userDetails.username}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <dl className="divide-y divide-gray-200"> {/* Use definition list for semantics */}
            <DetailItem label="Email" value={userDetails.email} />
            <DetailItem
              label="Account Status"
              value={
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  userDetails.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userDetails.isActive ? "Active" : "Inactive"}
                </span>
              }
            />
             <DetailItem
                label="Role"
                value={userDetails.isAdmin ? "Administrator" : "User"}
            />
            <DetailItem
                label="Login Method"
                value={userDetails.authProvider?.charAt(0).toUpperCase() + userDetails.authProvider?.slice(1) || "N/A"} // Capitalize
            />
             <DetailItem
                label="Watch History"
                value={`${userDetails.watchHistory?.length ?? 0} videos watched`}
            />
            <DetailItem
              label="Account Created"
              value={formatDateToLocal(userDetails.createdAt)}
              className="border-b-0" // Remove border below last item
            />
             <DetailItem
              label="Profile Last Updated"
              value={formatDateToLocal(userDetails.updatedAt)}
              className="border-b-0" // Remove border below last item
            />
             {/* Note: We don't display hasPassword - it's not the password itself */}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default CurrentUserDetails;