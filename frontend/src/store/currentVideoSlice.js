// import { createSlice } from "@reduxjs/toolkit";

// const currentVideoSlice = createSlice({
//   name: "currentVideo",
//   initialState: {
//     videoData: null,
//     userHistory: [],
//     quizResponses: {}, // Store user responses
//   },
//   reducers: {
//     setVideoData: (state, action) => {
//       state.videoData = action.payload;
//     },
//     clearVideoData: (state) => {
//       state.videoData = null;
//     },
//     setUserHistory: (state, action) => {
//       state.userHistory = action.payload;
//     },
//     clearUserHistory: (state) => {
//       state.userHistory = [];
//     },
//     addToUserHistory: (state, action) => {
//       state.userHistory.unshift(action.payload);
//     },
//     saveQuizResponse: (state, action) => {
//       state.quizResponses = action.payload; // Save responses globally
//     },
//   },
// });

// export const {
//   setVideoData,
//   clearVideoData,
//   setUserHistory,
//   clearUserHistory,
//   addToUserHistory,
//   saveQuizResponse,
// } = currentVideoSlice.actions;

// export default currentVideoSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const currentVideoSlice = createSlice({
//   name: "currentVideo",
//   initialState: {
//     videoData: null,
//     userHistory: [],
//     quizResponses: {},
//   },
//   reducers: {
//     setVideoData: (state, action) => {
//       state.videoData = action.payload;
//     },
//     clearVideoData: (state) => {
//       state.videoData = null;
//     },
//     setUserHistory: (state, action) => {
//       state.userHistory = action.payload;
//     },
//     clearUserHistory: (state) => {
//       state.userHistory = [];
//     },
//     addToUserHistory: (state, action) => {
//       state.userHistory.unshift(action.payload);
//     },
//     removeFromUserHistory: (state, action) => {
//       state.userHistory = state.userHistory.filter(video => video._id !== action.payload);
//     },
//   },
// });

// export const {
//   setVideoData,
//   clearVideoData,
//   setUserHistory,
//   clearUserHistory,
//   addToUserHistory,
//   removeFromUserHistory,
// } = currentVideoSlice.actions;

// export default currentVideoSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const currentVideoSlice = createSlice({
  name: "currentVideo",
  initialState: {
    videoData: null,
    userHistory: [],
    quizResponses: {}, // Store user responses
    transcript: null, // New field to hold the transcript
  },
  reducers: {
    setVideoData: (state, action) => {
      state.videoData = action.payload;
    },
    clearVideoData: (state) => {
      state.videoData = null;
    },
    setUserHistory: (state, action) => {
      state.userHistory = action.payload;
    },
    clearUserHistory: (state) => {
      state.userHistory = [];
    },
    addToUserHistory: (state, action) => {
      state.userHistory.unshift(action.payload);
    },
    removeFromUserHistory: (state, action) => {
      state.userHistory = state.userHistory.filter(video => video._id !== action.payload);
    },
    saveQuizResponse: (state, action) => {
      state.quizResponses = action.payload; // Save responses globally
    },
    setTranscript: (state, action) => { // New reducer to set the transcript
      state.transcript = action.payload;
    },
    clearTranscript: (state) => { // New reducer to clear the transcript
      state.transcript = null;
    },
  },
});

export const {
  setVideoData,
  clearVideoData,
  setUserHistory,
  clearUserHistory,
  addToUserHistory,
  removeFromUserHistory,
  saveQuizResponse,
  setTranscript, // Export the new action
  clearTranscript, // Export the new action
} = currentVideoSlice.actions;

export default currentVideoSlice.reducer;