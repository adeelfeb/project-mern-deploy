import React, { useState } from 'react'; // Import useState
import { formatDistanceToNow } from 'date-fns';
import { FiUserCheck, FiUserX, FiTrash2, FiLoader } from 'react-icons/fi';

// Removed FALLBACK_AVATAR constant

const UserRow = React.memo(({ user, onToggleStatus, onDeleteUser, isUpdating, actionType }) => {
    // State to track image loading error
    const [imgLoadError, setImgLoadError] = useState(false);

    const handleToggleClick = () => {
        onToggleStatus(user._id, user.isActive);
    };

    const handleDeleteClick = () => {
        onDeleteUser(user._id);
    };

    // Sets state when the primary image fails
    const handleImageError = () => {
        // Only set error state if it hasn't been set already for this instance
        if (!imgLoadError) {
             setImgLoadError(true);
        }
    };

    // Calculate initials for fallback
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };
    // Prioritize fullname, then username, then default 'U'
    const initials = getInitials(user.fullname) || user.username?.charAt(0)?.toUpperCase() || 'U';

    // Determine if we should even attempt to render the image tag
    const showImage = user.avatar && !imgLoadError;

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* User Info */}
            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        {/* --- Conditional Rendering for Avatar --- */}
                        {showImage ? (
                            // Render image tag only if we have a valid avatar URL and no error has occurred
                            <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatar} // Directly use the user's avatar URL
                                alt={`${user.username}'s avatar`}
                                onError={handleImageError} // Set error state on failure
                                loading="lazy"
                            />
                        ) : (
                            // Render fallback div if no avatar URL OR if image loading failed
                            <div
                                className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm"
                                title={user.fullname || user.username} // Tooltip for the fallback
                            >
                                {initials}
                            </div>
                        )}
                        {/* ------------------------------------------ */}
                    </div>
                    {/* Rest of user details */}
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate">{user.fullname}</div>
                        <div className="text-sm text-gray-500">@{user.username} {user.isAdmin && <span className="ml-1 text-xs font-semibold text-purple-600">(Admin)</span>}</div>
                    </div>
                </div>
            </td>
            {/* Other Table Cells (Email, Status, Joined, Actions) */}
            {/* ... (keep the rest of the cells as they were) ... */}
             <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell"> {/* Email */}
                 <div className="text-sm text-gray-900">{user.email}</div>
                 <div className="text-sm text-gray-500 capitalize">{user.authProvider}</div>
             </td>
             <td className="px-4 sm:px-6 py-4 whitespace-nowrap"> {/* Status */}
                 <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {user.isActive ? 'Active' : 'Inactive'}
                 </span>
             </td>
             <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell"> {/* Joined */}
                 {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
             </td>
             <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium"> {/* Actions */}
                 <div className="flex items-center justify-center gap-2 sm:gap-3">
                     <button onClick={handleToggleClick} disabled={isUpdating || user.isAdmin} className={`...`} > {/* Status Toggle */}
                         {isUpdating && actionType === 'status' ? <FiLoader className="animate-spin h-4 w-4" /> : user.isActive ? <FiUserX className="h-4 w-4" /> : <FiUserCheck className="h-4 w-4" />}
                     </button>
                     <button onClick={handleDeleteClick} disabled={isUpdating || user.isAdmin} className={`...`} > {/* Delete */}
                         {isUpdating && actionType === 'delete' ? <FiLoader className="animate-spin h-4 w-4" /> : <FiTrash2 className="h-4 w-4" />}
                     </button>
                 </div>
             </td>
        </tr>
    );
});

UserRow.displayName = 'UserRow';

export default UserRow; // Uncomment if in separate file