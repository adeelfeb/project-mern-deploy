import axios from "axios";
import conf from "../conf/conf.js"; 


const apiUrl = `${conf.apiUrl}/videos`;

const ApiService = {
    async sendRequest(endpoint, data) {
        try {

            const response = await axios.post(
                `${apiUrl}/${endpoint}`, // Ensures proper URL formatting
                data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: false,
                }
            );

            // console.log(`Response from ${endpoint}:`, response.data);
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
    async setScore(scoreData) {
        // console.log("the data inside API service is:",scoreData )
        return this.sendRequest('/score', scoreData);
    },

    async addVideoDetails(id, title, thumbnailUrl, duration) { // Fixed typo
        return this.sendRequest('/addVideoDetails', { id, title, thumbnailUrl, duration });
    },

    async addSummary(id, original, english) {
        // console.log("inside the API service fucntion:", id)
        return this.sendRequest('/addSummary', { id, original, english });
    },

    async addQnas(id, formattedQuizData) {
        // console.log("inside the addKeyconcept function")
        return this.sendRequest('/addQnas-formated', { id, formattedQuizData});
    },

    async addKeyconcept(id, concept) {
        return this.sendRequest('/addKeyconcept', { id, concept });
    }
};

export default ApiService;
