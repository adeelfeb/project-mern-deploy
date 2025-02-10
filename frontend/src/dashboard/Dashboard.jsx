import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header2";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import { handleInputSubmitLogic } from "../utils/handleInputSubmitLogic";
import { setCurrentChat } from "../store/messageSlice.js";
import ToastNotification from "../components/toastNotification/ToastNotification.jsx"



function Dashboard() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const historyLimit = 20

  // Accessing state from Redux store
  const currentMessage = useSelector((state) => state.chatSlice.currentMessage);
  const chatId = useSelector((state) => state.chatSlice.currentChatId);
  const messages = useSelector((state) => state.chatSlice.messages);
  const isLoading = useSelector((state) => state.chatSlice.isLoading);
  const fileUrl = "";
  // const fileUrl = useSelector((state) => state.file?.currentFileData?.fileUrl || "");
  const  fileId = useSelector((state) => state.file?.currentFileData?.fileId || "");
  const fileName = useSelector((state) => state.file?.currentFileData?.fileName || null);
  const erroUpload = useSelector((state) => state.file?.fileUploadError || null);

    const [toastMessage, setToastMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    
      // Handle toast notification when fileName changes
      useEffect(() => {
        if (fileName) {
          setToastMessage(`${fileName} selected`);
          setIsError(false);
        }
        if (erroUpload === true) {
          setIsError(true);
          setToastMessage(`Error Selecting file. Try again.`);
        }
      }, [fileName, erroUpload]);

  // Generate unique chat ID on component mount
  useEffect(() => {
    if (!chatId) {
      const newChatId = uuidv4();
      dispatch(setCurrentChat(newChatId));
    }
  }, [chatId, dispatch]);

  const handleInputSubmit = (e) => {
    if (isLoading) return;

    handleInputSubmitLogic({
      e,
      currentMessage,
      dispatch,
      messages,
      isLoading,
      fileUrl,
      fileId,
      chatId,
      historyLimit
    });
  };
  

  return (
    <div className="flex flex-col h-screen">
      <Header inputText={currentMessage} />
      <div className="flex-1 overflow-y-hidden">
        <ChatBody />
      </div>
      <ChatInput
        handleInputSubmit={handleInputSubmit}
        inputRef={inputRef}
      />
      {toastMessage && (
              <div className="fixed top-0 left-0 w-full flex justify-center z-50">
                <ToastNotification
                  message={toastMessage}
                  duration={3000}
                  isSuccess={!isError}
                />
              </div>
            )}
    </div>
  );
}

export default Dashboard;
