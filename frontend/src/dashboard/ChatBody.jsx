import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";  // Import useSelector
import NoMessagesPlaceholder from "./NoMessagesPlaceholder";
import MessagesList from "./MessagesList";

const ChatBody = () => {
  // Fetch messages and isLoading from the Redux store
  const messages = useSelector((state) => state.chatSlice.messages);
  const isLoading = useSelector((state) => state.chatSlice.isLoading);

  // Dynamic height calculation based on number of messages
  const chatHeight = messages.length > 0 ? "calc(100vh - 8rem)" : "calc(100vh - 12rem)";

  return (
    <div className="relative flex justify-center flex-1 mt-2">
      <div
        className="w-full mx-auto"
        style={{ height: chatHeight }}  // Dynamically set the height based on messages
      >
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
            >
              <NoMessagesPlaceholder />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatBody;
