// utils/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApVr2D_DYfugoamD5Pgp1mOP_FxNYO2xE",
  authDomain: "auth-75fcb.firebaseapp.com",
  projectId: "auth-75fcb",
  storageBucket: "auth-75fcb.appspot.com", // Fix storage URL typo
  messagingSenderId: "245965060083",
  appId: "1:245965060083:web:8e834a273b1bc25c090486",
  measurementId: "G-WK7ZE6EQ51"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export authentication and Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (optional)
if (typeof window !== "undefined") {
  getAnalytics(app);
}

export { auth, googleProvider };
