const isNode = typeof process !== 'undefined' && process.versions?.node; // Check if running in Node.js

const conf = {
    apiUrl: (() => {
        const baseUrl = isNode ? process.env.VITE_API_URL : import.meta.env.VITE_API_URL;
        return baseUrl?.endsWith('/api/v1') ? baseUrl : `${baseUrl || 'http://localhost:3000'}/api/v1`;
    })(),
    PORT: 5000,
    googleClientId: isNode ? process.env.VITE_GOOGLE_CLIENT_ID : import.meta.env.VITE_GOOGLE_CLIENT_ID,
    googleRedirectUri: isNode ? process.env.VITE_GOOGLE_REDIRECT_URI : import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    jwtSecret: isNode ? process.env.VITE_JWT_SECRET : import.meta.env.VITE_JWT_SECRET,
    clerkFrontendApi: isNode ? process.env.VITE_CLERK_FRONTEND_API : import.meta.env.VITE_CLERK_FRONTEND_API,
    clerkApiKey: isNode ? process.env.VITE_CLERK_API_KEY : import.meta.env.VITE_CLERK_API_KEY,
    clerkPublishableKey: isNode ? process.env.VITE_CLERK_PUBLISHABLE_KEY : import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    imageKitPublicKey: isNode ? process.env.VITE_IMAGE_KIT_PUBLIC_KEY : import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY,
    imageKitEndpoint: isNode ? process.env.VITE_IMAGE_KIT_ENDPOINT : import.meta.env.VITE_IMAGE_KIT_ENDPOINT,
    googleAiApiKey: isNode ? process.env.VITE_GOOGLE_AI_API_KEY : import.meta.env.VITE_GOOGLE_AI_API_KEY,
    ngrokApiKey: isNode ? process.env.VITE_NGROK_AI_API_KEY : import.meta.env.VITE_NGROK_AI_API_KEY,

    // Firebase Configuration
    firebaseConfig: {
        type: isNode ? process.env.VITE_FIREBASE_TYPE : import.meta.env.VITE_FIREBASE_TYPE,
        projectId: isNode ? process.env.VITE_FIREBASE_PROJECT_ID : import.meta.env.VITE_FIREBASE_PROJECT_ID,
        privateKeyId: isNode ? process.env.VITE_FIREBASE_PRIVATE_KEY_ID : import.meta.env.VITE_FIREBASE_PRIVATE_KEY_ID,
        privateKey: isNode
            ? process.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : import.meta.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: isNode ? process.env.VITE_FIREBASE_CLIENT_EMAIL : import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
        clientId: isNode ? process.env.VITE_FIREBASE_CLIENT_ID : import.meta.env.VITE_FIREBASE_CLIENT_ID,
        authUri: isNode ? process.env.VITE_FIREBASE_AUTH_URI : import.meta.env.VITE_FIREBASE_AUTH_URI,
        tokenUri: isNode ? process.env.VITE_FIREBASE_TOKEN_URI : import.meta.env.VITE_FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: isNode
            ? process.env.VITE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL
            : import.meta.env.VITE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: isNode
            ? process.env.VITE_FIREBASE_CLIENT_X509_CERT_URL
            : import.meta.env.VITE_FIREBASE_CLIENT_X509_CERT_URL,
        universeDomain: isNode ? process.env.VITE_FIREBASE_UNIVERSE_DOMAIN : import.meta.env.VITE_FIREBASE_UNIVERSE_DOMAIN,
    }
};

export default conf;
