// import React, { useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { v4 as uuidv4 } from "uuid";
// import ChatBody from "./ChatBody";
// import ChatInput from "./ChatInput";
// import { handleInputSubmitLogic } from "../utils/handleInputSubmitLogic";
// import { setCurrentChat } from "../store/messageSlice.js";

// function Dashboard() {
//   const inputRef = useRef(null);
//   const dispatch = useDispatch();
//   const historyLimit = 20;

//   const currentMessage = useSelector((state) => state.chatSlice.currentMessage);
//   const chatId = useSelector((state) => state.chatSlice.currentChatId);
//   const messages = useSelector((state) => state.chatSlice.messages);
//   const isLoading = useSelector((state) => state.chatSlice.isLoading);
//   const fileUrl = "";
//   const fileId = useSelector((state) => state.file?.currentFileData?.fileId || "");
  
//   useEffect(() => {
//     if (!chatId) {
//       const newChatId = uuidv4();
//       dispatch(setCurrentChat(newChatId));
//     }
//   }, [chatId, dispatch]);

//   return (
//     <div className="flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 mt-2">
//     {/* Chat Body - Scrollable */}
//     <div className="flex-1 overflow-y-auto space-y-4">
//       <ChatBody />
//     </div>
  
//   </div>

//   );
// }

// export default Dashboard;


import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ChatBody from "./ChatBody";
import { setCurrentChat } from "../store/messageSlice.js";

function Dashboard() {
  const dispatch = useDispatch();
  const chatId = useSelector((state) => state.chatSlice.currentChatId);

  // Generate a new chat ID if none exists
  useEffect(() => {
    if (!chatId) {
      const newChatId = uuidv4();
      dispatch(setCurrentChat(newChatId));
    }
  }, [chatId, dispatch]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <ChatBody />
      </div>
    </div>
  );
}

export default Dashboard;