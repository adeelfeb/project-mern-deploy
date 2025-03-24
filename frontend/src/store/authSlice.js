// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     status: false, // Tracks login status
//     userData: {
//         _id: null,
//         username: null,
//         email: null,
//         fullname: null,
//         avatar: null,
//         coverImage: null,
//         watchHistory: [], // Video history in user data
//         createdAt: null,
//         updatedAt: null,
//         __v: null,
//     },
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         setLoginStatus: (state, action) => {
//             state.status = action.payload; // Set login status (true/false)
//         },
//         setUserData: (state, action) => {
//             state.userData = {
//                 _id: action.payload._id,
//                 username: action.payload.username,
//                 email: action.payload.email,
//                 fullname: action.payload.fullname,
//                 avatar: action.payload.avatar,
//                 coverImage: action.payload.coverImage,
//                 createdAt: action.payload.createdAt,
//                 updatedAt: action.payload.updatedAt,
//                 __v: action.payload.__v,
//             };
//         },
//         logout: (state) => {
//             state.status = false; // Reset login status
//             state.userData = { // Reset user data
//                 _id: null,
//                 username: null,
//                 email: null,
//                 fullname: null,
//                 avatar: null,
//                 coverImage: null,
//                 createdAt: null,
//                 updatedAt: null,
//                 __v: null,
//             };
//             state.userHistory = []; // Reset user history
//         },
//     },
// });

// export const {
//     setLoginStatus,
//     setUserData,
//     logout,
// } = authSlice.actions;

// export default authSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null, // Changed from empty object to null for better "logged out" state
    isCheckingAuth: false, // New state to track auth verification
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoginStatus: (state, action) => {
            state.status = action.payload;
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.status = true;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        },
        setCheckingAuth: (state, action) => {
            state.isCheckingAuth = action.payload;
        }
    },
});

export const { setLoginStatus, setUserData, logout, setCheckingAuth } = authSlice.actions;
export default authSlice.reducer;