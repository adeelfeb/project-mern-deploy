// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import fileSlice from "./fileSlice.js"
import chatSlice from "./messageSlice.js"
import currentVideoReducer from "./currentVideoSlice"; // Import the slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileSlice,
    chatSlice: chatSlice,
    currentVideo: currentVideoReducer,
  },
});

export default store;
