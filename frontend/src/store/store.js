// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import fileSlice from "./fileSlice.js"
import chatSlice from "./messageSlice.js"

const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileSlice,
    chatSlice: chatSlice
  },
});

export default store;
