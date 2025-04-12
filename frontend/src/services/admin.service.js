// admin.service.js
import axios from 'axios';
import conf from '../conf/conf.js'; // Adjust path as needed

class AdminService {
  constructor() {
    // Make sure conf.apiUrl is correctly defined
    const baseURL = conf.apiUrl ? `${conf.apiUrl}/admin` : '/api/v1/admin'; // Fallback or error handling needed if conf.apiUrl is missing
    if (!conf.apiUrl) {
        console.warn("API URL not found in config, using default '/api/v1/admin'. Ensure conf.js and .env are setup.");
    }

    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Keep true if your backend CORS setup allows it and if needed for other requests
    });

    // Request Interceptor (keep as is)
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken'); // Or wherever you store the token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
          console.warn("AdminService: No access token found for request.");
          // Optionally cancel request or let backend handle unauthorized
      }
      return config;
    }, (error) => {
       return Promise.reject(error);
    });
  }

  // --- Existing methods ---
  async getDashboardStats() {
    // ... (keep existing code)
     try {
       const response = await this.api.get('/stats');
       return response.data; // Let component handle response.data.success and response.data.data
     } catch (error) {
       return this.handleError(error);
     }
  }

  // --- NEW METHODS ---

  /**
   * Fetches all users for admin management.
   * @returns {Promise<object>} Backend ApiResponse structure { success, data: [user...], message }
   */
  async getAllUsers() {
    try {
      const response = await this.api.get('/users');
      return response.data; // Return the full ApiResponse object {success, data, message}
    } catch (error) {
      return this.handleError(error); // Let handleError format the error response
    }
  }

  /**
   * Toggles the isActive status of a specific user.
   * @param {string} userId - The ID of the user to update.
   * @returns {Promise<object>} Backend ApiResponse structure { success, data: { _id, isActive }, message }
   */
  async toggleUserStatus(userId) {
    if (!userId) return Promise.reject({ success: false, message: "User ID is required."});
    try {
      const response = await this.api.patch(`/users/${userId}/status`);
      return response.data; // Return the full ApiResponse object
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deletes a specific user account.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<object>} Backend ApiResponse structure { success, data: { deletedUserId }, message }
   */
  async deleteUser(userId) {
    if (!userId) return Promise.reject({ success: false, message: "User ID is required."});
    try {
      const response = await this.api.delete(`/users/${userId}`);
      return response.data; // Return the full ApiResponse object
    } catch (error) {
      return this.handleError(error);
    }
  }

  // --- Error Handler (Keep as is) ---
  handleError(error) {
    console.error("AdminService API Error:", error); // Log the raw error
    let formattedError = {
      success: false,
      status: 500, // Default status
      message: 'An unknown error occurred',
    };

    if (error.response) {
      // Server responded with a status code outside 2xx
      formattedError = {
        success: false,
        status: error.response.status,
        // Use the message from the backend's ApiResponse if available
        message: error.response.data?.message || error.response.statusText || 'An error occurred',
        // Optionally include full data for debugging
        // errorData: error.response.data
      };
    } else if (error.request) {
      // Request made but no response received
      formattedError = {
        success: false,
        status: 503, // Service Unavailable
        message: 'The server could not be reached. Please try again later.',
      };
    } else {
      // Error setting up the request or manual error thrown
      formattedError.message = error.message || formattedError.message;
    }
    return formattedError; // Return the formatted error object
  }
}

export const adminService = new AdminService();