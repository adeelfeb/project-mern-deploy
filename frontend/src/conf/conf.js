// const conf = {
//     apiUrl: (() => {
//         const baseUrl = String(import.meta.env.VITE_API_URL) || 'http://localhost:3000';
//         return baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;
//     })(),
//     googleClientId: String(import.meta.env.VITE_GOOGLE_CLIENT_ID),
//     googleRedirectUri: String(import.meta.env.VITE_GOOGLE_REDIRECT_URI),
//     jwtSecret: String(import.meta.env.VITE_JWT_SECRET),
//     clerkFrontendApi: String(import.meta.env.REACT_APP_CLERK_FRONTEND_API),
//     clerkApiKey: String(import.meta.env.REACT_APP_CLERK_API_KEY),
//     clerkPublishableKey: String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY),
//     imageKitPublicKey: String(import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY),
//     imageKitEndpoint: String(import.meta.env.VITE_IMAGE_KIT_ENDPOINT),
//     googleAiApiKey: String(import.meta.env.VITE_GOOGLE_AI_API_KEY),
//     ngrokApiKey: String(import.meta.env.VITE_NGROK_AI_API_KEY),
// };

// export default conf;


const isNode = typeof process !== 'undefined' && process.env; // Check if running in Node.js

const conf = {
    apiUrl: (() => {
        const baseUrl = isNode ? process.env.VITE_API_URL : import.meta.env.VITE_API_URL;
        return baseUrl?.endsWith('/api/v1') ? baseUrl : `${baseUrl || 'http://localhost:3000'}/api/v1`;
    })(),
    PORT: 5000,
    googleClientId: isNode ? process.env.VITE_GOOGLE_CLIENT_ID : import.meta.env.VITE_GOOGLE_CLIENT_ID,
    googleRedirectUri: isNode ? process.env.VITE_GOOGLE_REDIRECT_URI : import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    jwtSecret: isNode ? process.env.VITE_JWT_SECRET : import.meta.env.VITE_JWT_SECRET,
    clerkFrontendApi: isNode ? process.env.REACT_APP_CLERK_FRONTEND_API : import.meta.env.REACT_APP_CLERK_FRONTEND_API,
    clerkApiKey: isNode ? process.env.REACT_APP_CLERK_API_KEY : import.meta.env.REACT_APP_CLERK_API_KEY,
    clerkPublishableKey: isNode ? process.env.VITE_CLERK_PUBLISHABLE_KEY : import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    imageKitPublicKey: isNode ? process.env.VITE_IMAGE_KIT_PUBLIC_KEY : import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY,
    imageKitEndpoint: isNode ? process.env.VITE_IMAGE_KIT_ENDPOINT : import.meta.env.VITE_IMAGE_KIT_ENDPOINT,
    googleAiApiKey: isNode ? process.env.VITE_GOOGLE_AI_API_KEY : import.meta.env.VITE_GOOGLE_AI_API_KEY,
    ngrokApiKey: isNode ? process.env.VITE_NGROK_AI_API_KEY : import.meta.env.VITE_NGROK_AI_API_KEY,
};

export default conf;
