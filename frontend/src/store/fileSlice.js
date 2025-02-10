import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentFile: null,
  currentFileData: {
    fileId: null,
    fileUrl: null,
    fileName: null,
  },
  fileUploadError: false, // Flag for file upload error
  isUploaded: false, // Flag to indicate if a file has been uploaded successfully
};



const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setCurrentFile(state, action) {
      state.currentFile = action.payload;
    },
    setCurrentFileData(state, action) {
      state.currentFileData = {
        fileId: action.payload._id,
        fileUrl: action.payload.fileUrl,
        fileName: action.payload.fileName,
      };
    },
    setFileUploadSuccess(state) {
      state.isUploaded = true;
    },
    setFileUploadError(state, action) {
      state.fileUploadError = action.payload;
      if (action.payload) {
        state.isUploaded = false;
      }
    },
    resetFileState(state) {
      state.currentFile = null;
      state.currentFileData = {
        fileId: null,
        fileUrl: null,
        fileName: null,
      };
      state.fileUploadError = false;
      state.isUploaded = false;
    },
    resetUploadState(state) {
      state.isUploaded = false;
      state.fileUploadError = false;
    },
  },
});

export const {
  setCurrentFile,
  setCurrentFileData,
  setFileUploadSuccess,
  setFileUploadError,
  resetFileState,
  resetUploadState,
} = fileSlice.actions;

export default fileSlice.reducer;
