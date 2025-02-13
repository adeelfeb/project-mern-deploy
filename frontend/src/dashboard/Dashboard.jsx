import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import { handleInputSubmitLogic } from "../utils/handleInputSubmitLogic";
import { setCurrentChat } from "../store/messageSlice.js";

function Dashboard() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const historyLimit = 20;

  const currentMessage = useSelector((state) => state.chatSlice.currentMessage);
  const chatId = useSelector((state) => state.chatSlice.currentChatId);
  const messages = useSelector((state) => state.chatSlice.messages);
  const isLoading = useSelector((state) => state.chatSlice.isLoading);
  const fileUrl = "";
  const fileId = useSelector((state) => state.file?.currentFileData?.fileId || "");
  
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
      historyLimit,
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 mt-2">
    {/* Chat Body - Scrollable */}
    <div className="flex-1 overflow-y-auto space-y-4">
      <ChatBody />
    </div>
  
    {/* Chat Input - Fixed at Bottom */}
    {/* <div className="sticky bottom-0 bg-white p-4 border-t border-gray-300 w-full max-w-full md:max-w-2xl lg:max-w-3xl mx-auto">
      <ChatInput handleInputSubmit={handleInputSubmit} inputRef={inputRef} />
    </div> */}
  </div>

  );
}

export default Dashboard;
