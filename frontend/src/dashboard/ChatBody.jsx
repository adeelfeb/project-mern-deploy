
import { AnimatePresence, motion } from "framer-motion";
import NoMessagesPlaceholder from "./NoMessagesPlaceholder";
import MessagesList from "./MessagesList";
import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./ChatInput";
import { handleInputSubmitLogic } from "../utils/handleInputSubmitLogic";
import { setCurrentChat } from "../store/messageSlice.js";

const ChatBody = () => {
  // Fetch messages and isLoading from the Redux store
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
    <div className="flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300  ">
      {/* Chat Body - Scrollable */}
      <div className="flex-1 overflow-y-auto ">
        <AnimatePresence mode="wait">
          {messages.length > 0 ? (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <MessagesList />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="h-full flex items-center justify-center p-2"
            >
              <NoMessagesPlaceholder />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  
      {/* Chat Input - Fixed at Bottom */}
      <div className="sticky bottom-10 bg-white p-4  w-full max-w-full md:max-w-2xl lg:max-w-3xl mx-auto">
        <ChatInput handleInputSubmit={handleInputSubmit} inputRef={inputRef} />
      </div>
    </div>
  );
};

export default ChatBody;