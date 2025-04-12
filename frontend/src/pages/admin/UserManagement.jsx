import React, { useState, useEffect, useCallback } from 'react';
import { FiUserCheck, FiUserX, FiTrash2, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi'; // Keep icons needed here
import { adminService } from '../../services/admin.service'; // Adjust path
// Removed date-fns import from here, moved to UserRow
// import { formatDistanceToNow } from 'date-fns';

// Import the memoized UserRow component
import UserRow from './UserRow'; // Assuming UserRow is in the same directory or adjust path



function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [actionType, setActionType] = useState(null);

    const fetchUsers = useCallback(async (showLoader = true) => {
        if (showLoader) setLoading(true);
        setError(null);
        setUpdatingUserId(null);
        setActionType(null);
        try {
            const response = await adminService.getAllUsers();
            if (response.success && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch users or invalid data format.");
            }
        } catch (err) {
            setError(err.message || "An error occurred while fetching users.");
            setUsers([]);
        } finally {
            if (showLoader) setLoading(false);
        }
    }, []); // fetchUsers doesn't need dependencies here

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- Wrap handlers in useCallback ---
    const handleToggleStatus = useCallback(async (userId, currentStatus) => {
        setUpdatingUserId(userId);
        setActionType('status');
        const actionText = currentStatus ? "Deactivate" : "Activate";

        // Move confirm inside useCallback if preferred, or keep outside if confirmation logic might change
        if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) {
            setUpdatingUserId(null);
            setActionType(null);
            return;
        }

        try {
            const response = await adminService.toggleUserStatus(userId);
            if (response.success && response.data) {
                 // Use functional update to avoid dependency on 'users' state
                 setUsers(prevUsers =>
                     prevUsers.map(user =>
                         user._id === userId ? { ...user, isActive: response.data.isActive } : user
                     )
                 );
                // console.log(response.message);
            } else {
                throw new Error(response.message || `Failed to ${actionText} user.`);
            }
        } catch (err) {
            setError(`Error: ${err.message}`); // Still set global error for now
        } finally {
            setUpdatingUserId(null);
            setActionType(null);
        }
    }, []); // Empty dependency array: this function doesn't depend on component state/props

    const handleDeleteUser = useCallback(async (userId) => {
        setUpdatingUserId(userId);
        setActionType('delete');

        if (!window.confirm("Are you sure you want to PERMANENTLY DELETE this user? This action cannot be undone.")) {
            setUpdatingUserId(null);
            setActionType(null);
            return;
        }

        try {
            const response = await adminService.deleteUser(userId);
            if (response.success) {
                 // Use functional update
                 setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                // console.log(response.message);
            } else {
                throw new Error(response.message || "Failed to delete user.");
            }
        } catch (err) {
            setError(`Error: ${err.message}`); // Still set global error for now
        } finally {
            setUpdatingUserId(null);
            setActionType(null);
        }
    }, []); // Empty dependency array

    // --- Render Logic ---

    if (loading && users.length === 0) {
        // Loading indicator remains the same
        return ( <div className="flex justify-center items-center h-64"> <FiLoader className="animate-spin text-4xl text-blue-600" /> <span className='ml-3 text-lg text-gray-600'>Loading Users...</span> </div> );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-full rounded-lg shadow-sm">
            {/* Header remains the same */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
                <button onClick={() => fetchUsers(true)} disabled={loading} className="..." > <FiRefreshCw size={16} className={`...`} /> Refresh </button>
            </div>

            {/* Global Error display remains the same */}
            {error && !updatingUserId && ( <div className="...">...</div> )}

            {/* User Table/List */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* thead remains the same */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 && !loading ? (
                            <tr> <td colSpan="5" className="px-6 py-10 text-center text-gray-500"> No users found. </td> </tr>
                        ) : (
                            // --- Use the UserRow component ---
                            users.map((user) => (
                                <UserRow
                                    key={user._id} // Key must be here
                                    user={user}
                                    onToggleStatus={handleToggleStatus} // Pass memoized handler
                                    onDeleteUser={handleDeleteUser}     // Pass memoized handler
                                    isUpdating={updatingUserId === user._id} // Pass boolean indicating if this row is updating
                                    actionType={updatingUserId === user._id ? actionType : null} // Pass action type only if updating this row
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement;