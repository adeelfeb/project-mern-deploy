import axios from 'axios';
import conf from '../conf/conf.js';  // Configuration file for the API URL
import Cookies from 'js-cookie';


export class AuthService {
    constructor() {
        this.apiUrl = conf.apiUrl;  // API base URL from the configuration (e.g., `http://localhost:8000/api/v1`)
    }
    

    async uploadVideo (videoFile){
        try {
          // Prepare FormData for the request
          const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return null;
          const formData = new FormData();
          formData.append("video", videoFile);
            // console.log("inside uploadVideo fucntion", this.apiUrl)
          // Send the request to the backend
          const response = await axios.post(`${this.apiUrl}/users/upload-video`, formData, 
            { headers: { "Authorization": `Bearer ${accessToken}` }, withCredentials: false }
          );
          
      
          if (response.data.success) {
            // console.log("the resposne was ", response.data)
            return response.data.data; // Return video details
          }
        } catch (error) {
          // Extract and return only the error message
          console.log("the errror was:", error)
          const errorMessage = error.response?.data?.message || "Video upload failed. Please try again.";
          throw new Error(errorMessage);
        }
      };


      

    async createAccount({ email, password, fullname, username, avatar, coverImage }) {
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            formData.append("fullname", fullname);
            formData.append("username", username);
    
            if (avatar) formData.append("avatar", avatar);
            if (coverImage) formData.append("coverImage", coverImage);
    
            const response = await axios.post(`${this.apiUrl}/users/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
    
            if (response.data.success) {
                const { temporaryToken } = response.data.data;
                return await this.loginWithTemporaryToken({ temporaryToken });
            }
        } catch (error) {
            console.error("Error while creating account:", error);
            
            // Extracting error message from response
            const errorMessage = error.response?.data?.message || "Error Creating Account. Try again later.";
            
            // Displaying error message on frontend
            // alert(errorMessage);
            throw new Error(errorMessage);
        }
    }
    
    



    async loginWithTemporaryToken({ temporaryToken }) {
        try {
            // console.log( "The temporary token login step" ,temporaryToken)
            const response = await axios.post(`${this.apiUrl}/users/login-with-temp-token`, { token: temporaryToken }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: false,
            });
            

            const { accessToken, refreshToken } = response.data.data || {};
            // console.log("Now in the user Data step in the loginWithTemporaryToken :")
            if (accessToken, refreshToken) {
                // Store the access and refresh tokens
                // console.log("accesss and refresh token", accessToken, refreshToken)
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            }
        
            return {accessToken, refreshToken}; // Return only user data
        } catch (error) {
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    }

    async login(data) {
        try {
            const { emailOrUsername, password } = data;

            // Determine if the input is an email
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);

            // Prepare the payload based on the input type
            const payload = isEmail 
                ? { email: emailOrUsername, password } 
                : { username: emailOrUsername, password };

            const response = await axios.post(
                `${this.apiUrl}/users/login`, 
                payload, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            // Handle the successful response
            // console.log("Login successful:", response.data);
            
    
            const { accessToken, refreshToken } = response.data.data || {};
            if (accessToken && refreshToken) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            }
            return { accessToken, refreshToken };
        } catch (error) {
            // Custom error handling based on status codes
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    throw new Error("Invalid password. Please try again.");
                } else if (status === 404) {
                    throw new Error("User not found. Please check your email or username.");
                } else {
                    throw new Error(data.message || "An error occurred. Please try again.");
                }
            } else {
                throw new Error(error.message || "Network error. Please try again.");
            }
        }
    }

    
    async googleLogin(idToken) {
        try {
            // console.log("the firebase idToken:", idToken)
            const response = await axios.post(`${this.apiUrl}/users/google-auth`, { idToken }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            // console.log("the response was:", response)

            const { accessToken, refreshToken } = response.data.data || {};
            if (accessToken && refreshToken) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            }

            
            // return { accessToken, refreshToken };

            return response.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    }


    async forgetPassword(email) {
        try {
            // console.log("the firebase idToken:", email)
            const response = await axios.post(`${this.apiUrl}/users/forget-password`, { email }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            
            return response.data;
        } catch (error) {
            if(error.response.data.statusCode === 401){
                return error.response.data
                
            }
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    }
    
    async getCurrentUser() {
        try {
            const response = await axios.post(
                `${this.apiUrl}/users/current-user`, 
                {},
                {withCredentials: true }
            );
            // console.log("Inside the current user auth.js Function getCurrentUser:", response.data.data)
            return response.data.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    }

    async logout() {
        try {
            await axios.post(`${this.apiUrl}/users/logout`, {}, { 
                withCredentials: true 
            });
    
            // Clear ALL client-side storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear cookies more aggressively
            const cookies = document.cookie.split(";");
            for (const cookie of cookies) {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = `${name.trim()}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure`;
            }
    
            // Force a hard refresh to clear all memory state
            window.location.href = "/login"; // or your login route
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }

    // async logout() {
    //     try {
    //         await axios.post(`${this.apiUrl}/users/logout`, {}, { 
    //             withCredentials: true 
    //         });
    
    //         // Clear local storage
    //         localStorage.removeItem('accessToken');
    //         localStorage.removeItem('refreshToken');
            
    //         // Additional step: Clear cookies by setting expired date
    //         document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    //         document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            
    //         // Optional: Force reload to ensure all state is cleared
    //         window.location.reload();
            
    //     } catch (error) {
    //         console.error('Error logging out:', error);
    //         throw new Error(error.response ? error.response.data.message : error.message);
    //     }
    // }
}

const authService = new AuthService();
export default authService;
