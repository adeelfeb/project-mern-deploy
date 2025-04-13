

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     status: false,
//     OuserData: null, // Changed from empty object to null for better "logged out" state
//     isCheckingAuth: false, // New state to track auth verification
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         setLoginStatus: (state, action) => {
//             state.status = action.payload;
//         },
//         setUserData: (state, action) => {
//             state.OuserData = action.payload;
//             state.status = true;
//         },
//         logout: (state) => {
//             state.status = false;
//             state.userData = null;
//         },
//         setCheckingAuth: (state, action) => {
//             state.isCheckingAuth = action.payload;
//         }
//     },
// });

// export const { setLoginStatus, setUserData, logout, setCheckingAuth, OuserData } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false, // Is the user logged in?
    userData: null, // Holds the actual user data object when logged in
    isCheckingAuth: false, // Tracks if an initial auth check is in progress
    isAdmin: false, // <-- New state property, defaulting to false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action to potentially set login status directly (less common)
        setLoginStatus: (state, action) => {
            state.status = Boolean(action.payload); // Ensure boolean
        },
        // Action called typically after successful login
        setUserData: (state, action) => {
            state.userData = action.payload; // Store the user object
            state.status = true; // Set logged-in status
            // **Crucially, determine admin status from the user data payload**
            // Adjust 'action.payload.isAdmin' or 'action.payload.role'
            // based on how your backend sends the admin information.
            state.isAdmin = Boolean(action.payload?.isAdmin || action.payload?.role === 'admin');
        },
        // Action called on logout
        logout: (state) => {
            state.status = false;
            state.OuserData = null; // Clear user data
            state.isAdmin = false; // <-- Reset isAdmin on logout
        },
        // Action to track auth verification process
        setCheckingAuth: (state, action) => {
            state.isCheckingAuth = Boolean(action.payload); // Ensure boolean
        },
        // <-- New reducer specifically to set/update the isAdmin flag
        setIsAdmin: (state, action) => {
            // Expects a boolean payload (true or false)
            state.isAdmin = Boolean(action.payload);
        }
    },
});

// Export the action creators
export const {
    setLoginStatus,
    setUserData,
    logout,
    setCheckingAuth,
    setIsAdmin // <-- Export the new action creator
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Note: You don't typically export state properties like OuserData directly from actions.
// You select them from the store state in your components using useSelector.