import axios from "axios";
import conf from "../conf/conf.js"; 


const apiUrl = `${conf.apiUrl}/videos`;

const ApiService = {
    async sendRequest(endpoint, data) {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                console.error('No access token found in localStorage');
                return { status: 401, message: 'Unauthorized: No access token found' };
            }

            const response = await axios.post(
                `${apiUrl}/${endpoint}`, // Ensures proper URL formatting
                data,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: false,
                }
            );

            console.log(`Response from ${endpoint}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error in ${apiUrl}:`, error);

            if (error.response) {
                const { status, data } = error.response;
                console.log('Server Error Response:', data);

                return {
                    status: data.statusCode || status,
                    message: data.message || 'An error occurred',
                    success: data.success ?? false,
                };
            } else {
                console.log('Unknown Error:', error.message);
                return { status: 500, message: error.message || 'An unknown error occurred' };
            }
        }
    },

    async addTranscript(id, english, original) {
        return this.sendRequest('/addTranscript', { id, english, original });
    },

    async addVideoDetails(id, title, thumbnailUrl, duration) { // Fixed typo
        return this.sendRequest('/addVideoDetails', { id, title, thumbnailUrl, duration });
    },

    async addSummary(id, original, english, Summary_eng) {
        return this.sendRequest('/addSummary', { id, original, english, Summary_eng });
    },

    async addQnas(id, Questions, mcqs) {
        return this.sendRequest('/addQnas', { id, Questions, mcqs });
    },

    async addKeyconcept(id, concept) {
        return this.sendRequest('/addKeyconcept', { id, concept });
    }
};

export default ApiService;
