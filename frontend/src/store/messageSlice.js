import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMessage: "", // Current input message
  messages: [], // List of chat messages, each with role and text
  currentChatId: 1, // Chat ID starts from 1
  isLoading: false, // Loading state
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    addMessage: (state, action) => {
      // Each message includes a role (user/model) and text
      state.messages.push({
        role: action.payload.role,
        text: action.payload.text,
      });
    },
    setCurrentChat: (state, action) => {
      // Update the chatId of the current chat
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearChat: (state) => {
      // Reset all fields to initial state
      state.currentMessage = "";
      state.messages = [];
      state.currentChatId = 1; // Reset to default chat ID
      state.isLoading = false;
    },
  },
});

export const {
  setCurrentMessage,
  addMessage,
  setCurrentChat,
  setLoading,
  clearChat, // Export the new action
} = chatSlice.actions;

export default chatSlice.reducer;
