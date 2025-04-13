import axios from 'axios';
import conf from '../conf/conf.js'; // Configuration file for the API URL
import Cookies from 'js-cookie';


class VideoService {
    constructor() {
        this.apiUrl = conf.apiUrl; 
    }

    

    async addVideo(videoUrl) {
      try {
        
          
          const response = await axios.post(
              `${this.apiUrl}/users/addVideo`, // API endpoint for adding the video
              { videoUrl }, // Send the video URL in the request body
              {
                  withCredentials: true, // No need to send cookies with this request
              }
          );
  
          // console.log('Server Response:', response.data); // Log the response from the server
          return response.data; // Return the response data (e.g., success message or video data)
      } catch (error) {
          // console.error('Error adding video to watch history:', error);
          
          if (error.response) {
              // Handle specific status codes
              const {  data } = error.response;
              // console.log('Server Error Response:', data.statusCode, "and data is:", data); // Log the error response from the server
  
              const statusCode = data.statusCode
            
              switch (statusCode) {
                  case 400:
                      return { statusCode, message: data.message || 'Bad Request' };
                  case 409:
                      // console.log("limit exceeded")
                      return { statusCode, message: data.message || 'Limit exceeded' };
                  case 404:
                      return { statusCode, message: data.message || 'Resource Not Found' };
                  case 502:
                      return { statusCode, message: 'Bad Gateway: Unable to connect to the external API' };
                  case 500:
                      return { statusCode, message: 'Internal Server Error: Please try again later' };
                  default:
                      return { statusCode, message: data.message || 'An unexpected error occurred' };
              }
          } else {
              console.log('Unknown Error:', error.message); // Log unknown errors
              return { status: 500, message: error.message || 'An unknown error occurred' };
          }
      }



    }






    async deleteVideos(videoIds) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.log('No access token found in localStorage');
          return null;
        }
    
        const response = await axios.delete(
          `${this.apiUrl}/users/delete-videos`, // New API endpoint for bulk deletion
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            data: { videoIds }, // Send array of video IDs in the request body
            withCredentials: true,
          }
        );
    
        return response.data;
      } catch (error) {
        console.error('Error deleting videos:', error);
        throw new Error(error.response ? error.response.data.message : error.message);
      }
    }





  async deleteVideo(videoId) {
    try {
        // console.log("Deleting video from history:", videoId);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.log('No access token found in localStorage');
            return null; // Return null if access token is not found
        }

        const response = await axios.delete(
            `${this.apiUrl}/users/delete-video`, // API endpoint for deleting from history
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`, // Attach the access token in the Authorization header
                    "Content-Type": "application/json"
                },
                data: { videoId }, // Send videoId in the request body
                withCredentials: true, // No need to send cookies with this request
            }
        );

        // console.log("Delete response:", response.data);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error deleting video from history:', error);
        throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
    }
}



async getAllVideos(page = 1, limit = 20) { // Add page and limit parameters with defaults
  try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
          console.error('Authentication Error: No access token found.');
          // Throwing an error is generally better for handling auth issues
          throw new Error('User is not authenticated. Please log in.');
      }

      // --- Construct URL with query parameters ---
      const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          // You could add other params here later if needed:
          // sortBy: 'createdAt',
          // sortOrder: 'desc'
      });
      // Ensure the route matches your backend setup for the paginated video list
      const url = `${this.apiUrl}/admin/videos?${params.toString()}`;

      // console.log(`Fetching videos from: ${url}`); // Log the URL being requested

      const response = await axios.get(
          url, // Use the constructed URL
          {
              headers: {
                  "Authorization": `Bearer ${accessToken}`,
                  // Content-Type is usually not needed for GET requests
                  // "Content-Type": "application/json"
              },
              // Ensure 'withCredentials' matches your backend CORS setup if using cookies elsewhere,
              // but likely true if only using Bearer tokens.
              withCredentials: true,
          }
      );

      // --- Process Backend Response ---
      // Axios puts the response body in `response.data`
      // Your backend ApiResponse wraps the actual data in another `data` field
      if (response.data && response.data.success && response.data.data) {
          // console.log("Paginated video data received successfully.");
          // Return the inner 'data' object which contains { docs, totalPages, page, etc. }
          return response.data.data;
      } else {
          // Handle cases where the API request might have succeeded (status 2xx)
          // but the backend indicates a logical failure (success: true or missing data)
          const serverMessage = response.data?.message || "Received invalid data structure from server.";
          console.warn("Warning fetching videos:", serverMessage, response.data);
          throw new Error(serverMessage);
      }

  } catch (error) {
      console.error('Error getting paginated videos:', error);

      // Construct a more informative error message
      let errorMessage = "An unknown error occurred while fetching videos.";
      if (error.response) {
          // Error response from server (status code outside 2xx)
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          console.error('Server Response Error:', error.response.status, error.response.data);
      } else if (error.request) {
          // Request was made but no response received (network error, CORS issue, etc.)
          errorMessage = "Could not connect to the server. Please check your network connection.";
          console.error('Network/Request Error:', error.request);
      } else if (error.message === 'User is not authenticated. Please log in.') {
           // Handle the specific authentication error thrown above
           errorMessage = error.message;
      }
       else {
          // Other errors (e.g., setup error, error thrown manually)
          errorMessage = error.message || errorMessage;
          console.error('Error:', error.message);
      }
      // Re-throw the processed error message
      throw new Error(errorMessage);
  }
}
// async getAllVideos() {
//   try {
//       const accessToken = localStorage.getItem('accessToken');
//       if (!accessToken) {
//           console.log('No access token found in localStorage');
//           return null; // Return null if access token is missing
//       }

//       const response = await axios.get(
//           `${this.apiUrl}/admin/videos`, // Ensure this matches your backend route
//           {
//               headers: {
//                   "Authorization": `Bearer ${accessToken}`,
//                   "Content-Type": "application/json"
//               },
//               withCredentials: true, // No cookies needed
//           }
//       );
//       // console.log("the response is:", response.data)

//       return response.data; // Return the video data
//   } catch (error) {
//       console.error('Error Getting videos:', error);
//       throw new Error(error.response ? error.response.data.message : error.message);
//   }
// }


  async deleteFromHistory(videoId) {
    try {
        // console.log("Deleting video from history:", videoId);
        
        

        const response = await axios.delete(
            `${this.apiUrl}/users/delete-from-history`, // API endpoint for deleting from history
            {
                
                data: { videoId }, // Send videoId in the request body
                withCredentials: true, // No need to send cookies with this request
            }
        );

        // console.log("Delete response:", response.data);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error deleting video from history:', error);
        throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
    }
}

  
  
    
    async getvideoDetails(videoId) {
        try {
            // console.log("Inside the get videoDetails:", videoId);
           
            
    
            const response = await axios.get(
                `${this.apiUrl}/users/videoDetails`, // API endpoint for getting the transcript
                {
                    
                  
                    params: { videoId }, // Pass videoId as a query parameter
                    withCredentials: true, // No need to send cookies with this request
                }
            );
            // console.log("transcript is:", response.data)
            return response.data; // Return the transcript data
        } catch (error) {
            console.error('Error fetching transcript:', error);
            throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
        }
    }


    async getTranscript(videoId) {
        try {
            // console.log("Inside the getTranscript:", videoId);
           
    
            const response = await axios.get(
                `${this.apiUrl}/users/transcript`, // API endpoint for getting the transcript
                {
                    params: { videoId }, // Pass videoId as a query parameter
                    withCredentials: true, // No need to send cookies with this request
                }
            );
            // console.log("transcript is:", response.data)
            return response.data; // Return the transcript data
        } catch (error) {
            console.error('Error fetching transcript:', error);
            throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
        }
    }


    async getSummary(videoId) {
        try {
          
          
    
          const response = await axios.get(
            `${this.apiUrl}/users/summary`, // API endpoint for getting the summary
            {
              
              params: { videoId }, // Pass videoId as a query parameter
              withCredentials: true, // No need to send cookies with this request
            }
          );
    
          return response.data; // Return the summary data
        } catch (error) {
          console.error('Error fetching summary:', error);
          throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
        }
      }   


    async getKeyConcepts(videoId) {
        try {
          
          
    
          const response = await axios.get(
            `${this.apiUrl}/users/keyconcept`, // API endpoint for getting the summary
            {
              params: { videoId }, // Pass videoId as a query parameter
              withCredentials: true, // No need to send cookies with this request
            }
          );
          // console.log("The api response was:", response.data.data)
    
          return response; // Return the summary data
        } catch (error) {
          console.error('Error fetching summary:', error);
          throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
        }
      }   
    
      async getqnas(videoId) {
        try {
          // console.log(  "The Video id is: ",videoId)
          const response = await axios.get(
            `${this.apiUrl}/users/qnas`, // API endpoint for getting the summary
            {
              params: { videoId }, // Pass videoId as a query parameter
              withCredentials: true, // No need to send cookies with this request
            }
          );
          // console.log("response of QNA is:", response.data)
          return response.data; 
        } catch (error) {
          if(error.response.data.status === 269){
            return error.response.data.message
          }
          console.error('Error fetching Quiz:', error);
          throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
        }
      }



      async getScore(videoId) {
        try {
          // console.log(  "The Video id is: ",videoId)
          
    
          const response = await axios.get(
            `${this.apiUrl}/users/score`, // API endpoint for getting the summary
            {
              
              params: { videoId }, // Pass videoId as a query parameter
              withCredentials: true, // No need to send cookies with this request
            }
          );
          // console.log("response of score is:", response.data)
          return response.data; 
        } catch (error) {
          // console.log('Error fetching Score:', error);
          return error.response
          
        }
      }




      async submitQuiz(videoId, quiz) {
        try {
          // console.log("video id:", videoId)
            
    
            const response = await axios.post(
                `${this.apiUrl}/users/qnas`, // API endpoint for submitting quiz
                { videoId, quiz }, // Send videoId and quiz inside the request body
                {
                    
                    withCredentials: true // No cookies needed
                }
            );
    
            return response;
        } catch (error) {
            console.error('Error Submitting Quiz:', error);
            throw new Error(error.response ? error.response.data.message : error.message); // Propagate the error
        }
    }
    

      
      async getCurrentUser() {
        try {
          

            const response = await axios.post(
                `${this.apiUrl}/users/current-user`, 
                {},
                {  withCredentials: true }
            );
            
            return response.data.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    }
      
    
      async getUserHistory() {
        try {
            
    
            const response = await axios.get(
                `${this.apiUrl}/users/history`, // API endpoint for getting the history
                {
                    
                    withCredentials: true, // No need to send cookies with this request
                }
            );
    
            // console.log('Server Response for get history:',  response.data); // Log response for debugging
            return response.data; // Return the full response
        } catch (error) {
            console.error('Error fetching user history:', error);
    
            if (error.response) {
                const { status, data } = error.response;
                console.log('Server Error Response:', data); // Log server response
    
                return {
                    status: data.statusCode || status,
                    message: data.message || data.messsage || 'An unexpected error occurred',
                    success: data.success || true,
                };
            } else {
                console.error('Unknown Error:', error.message);
                return { status: 500, message: error.message || 'An unknown error occurred', success: true };
            }
        }
    }
    

    async setNewPassword(newPassword) {
        try {
            // console.log("Passwords", oldPassword, newPassword)
        
          const oldPassword = null
    
          const response = await axios.patch(
            `${this.apiUrl}/users/change-password`,
            { oldPassword, newPassword },
            {
              withCredentials: true,
            }
          );
    
          return response.data;
        } catch (error) {
          console.error('Error changing password:', error);
          throw new Error(error.response ? error.response.data.message : error.message);
        }
      }


    async changeCurrentPassword(oldPassword, newPassword) {
        try {
            // console.log("Passwords", oldPassword, newPassword)
          
    
          const response = await axios.patch(
            `${this.apiUrl}/users/change-password`,
            { oldPassword, newPassword },
            {
              withCredentials: true,
            }
          );
    
          return response.data;
        } catch (error) {
          console.error('Error changing password:', error);
          throw new Error(error.response ? error.response.data.message : error.message);
        }
      }


    async checkUserPasswordStatus() {
        try {
    
          const response = await axios.patch(
            `${this.apiUrl}/users/check-password`,
            {  },
            {
              
              withCredentials: true,
            }
          );
          // console.log("The repsonse was:", response)
    
          return response.data;
        } catch (error) {
          console.error('Error checking password:', error);
          throw new Error(error.response ? error.response.data.message : error.message);
        }
      }
    
      async updateAccountDetails(data) {
        try {
         
          const response = await axios.patch(
            `${this.apiUrl}/users/update-account`,
            data, // Send only the provided fields
            {
              withCredentials: true,
            }
          );
      
          return response.data;
        } catch (error) {
          console.error('Error updating account details:', error);
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          throw new Error(errorMessage);
        }
      }
      
    
      async updateUserAvatar(file) {
        try {
          
    
          const formData = new FormData();
          formData.append('avatar', file);
    
          const response = await axios.patch(`${this.apiUrl}/users/update-avatar`, formData, {
           
            withCredentials: true,
          });
    
          return response.data;
        } catch (error) {
          console.error('Error updating avatar:', error);
          throw new Error(error.response ? error.response.data.message : error.message);
        }
      }
    



    
    
}

const videoService = new VideoService();
export default videoService;


