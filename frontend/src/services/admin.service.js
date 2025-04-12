import axios from 'axios';
import conf from '../conf/conf.js'; // Adjust path as needed

class AdminService {
  constructor() {
    // Use environment variable for API URL, provide a fallback
    const baseURL = conf.apiUrl ? `${conf.apiUrl}/admin` : '/api/v1/admin';
    if (!conf.apiUrl) {
        console.warn("API URL configuration (VITE_API_URL or similar) not found in config. Using default '/api/v1/admin'. Ensure conf.js and .env are setup.");
    }

    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Send cookies with requests (ensure backend CORS allows credentials)
      withCredentials: true,
    });

  }

  // --- Dashboard Stats ---
  async getDashboardStats() {
     try {
       const response = await this.api.get('/stats');
       // Return the whole response data structure { success, data, message }
       // Let the calling component decide how to use success, data, message
       return response.data;
     } catch (error) {
       return this.handleError(error);
     }
  }

  // --- User Management ---

  /**
   * Fetches all users for admin management.
   * @returns {Promise<object>} Backend ApiResponse structure { success, data: [user...], message } or formatted error object.
   */
  async getAllUsers() {
    try {
      const response = await this.api.get('/users');
      return response.data; // Return the full ApiResponse object
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Toggles the isActive status of a specific user.
   * @param {string} userId - The ID of the user to update.
   * @returns {Promise<object>} Backend ApiResponse structure { success, data: { _id, isActive }, message } or formatted error object.
   */
  async toggleUserStatus(userId) {
    if (!userId) {
        console.error("toggleUserStatus Error: User ID is required.");
        // Return a consistent error structure
        return { success: false, status: 400, message: "User ID is required." };
    }
    try {
      // PATCH is suitable for partial updates like toggling status
      const response = await this.api.patch(`/users/${userId}/status`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deletes a specific user account.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<object>} Backend ApiResponse structure { success, data: { deletedUserId }, message } or formatted error object.
   */
  async deleteUser(userId) {
    if (!userId) {
        console.error("deleteUser Error: User ID is required.");
        return { success: false, status: 400, message: "User ID is required." };
    }
    try {
      const response = await this.api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // --- Video Management ---

  /**
   * Fetches all videos for admin management.
   * @returns {Promise<object>} Backend ApiResponse structure { success, data: [video...], message } or formatted error object.
   */
  async getAllVideos() {
    try {
      const response = await this.api.get('/videos');
      return response.data.data; // Return the full ApiResponse object
    } catch (error) {
      return this.handleError(error);
    }
  }

  
  async deleteVideo(videoId) {
    if (!videoId) {
      console.error("deleteVideo Error: Video ID is required.");
      return { success: false, status: 400, message: "Video ID is required." };
    }
    try {
      // Standard REST: DELETE request with ID in the URL path
      const response = await this.api.delete(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  
  async deleteVideos(videoIds) {
    // Input validation
    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      console.error("deleteVideos Error: An array of video IDs is required.");
      return { success: false, status: 400, message: "An array of video IDs is required." };
    }

    try {
      const response = await this.api.delete(`/bulk-delete`, {
          data: { videoIds: videoIds } // Send the array within an object key
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }


  // --- Error Handler (Keep as is or enhance) ---
  handleError(error) {
    console.error("AdminService API Error:", error); // Log the raw error
    let formattedError = {
      success: false,
      status: 500, // Default status
      message: 'An unknown error occurred',
      errorData: null // To store original error data if needed
    };

    if (error.response) {
      // Server responded with a status code outside 2xx
      formattedError = {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || error.response.statusText || 'An error occurred',
        errorData: error.response.data // Capture backend error details
      };
    } else if (error.request) {
      // Request made but no response received
      formattedError = {
        success: false,
        status: 503, // Service Unavailable is a common choice
        message: 'Cannot reach the server. Please check your connection or try again later.',
      };
    } else {
      // Error setting up the request or a client-side error
      formattedError.message = error.message || formattedError.message;
    }
    // Return the formatted error object so calling code can check success/status/message
    return formattedError;
  }
}

// Export a single instance
export const adminService = new AdminService();