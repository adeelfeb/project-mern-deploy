import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowUpLong } from "react-icons/fa6";
import { setCurrentMessage } from "../store/messageSlice"; // Import Redux action

const ChatInput = ({ handleInputSubmit, inputRef }) => {
  const dispatch = useDispatch();
  const currentMessage = useSelector((state) => state.chatSlice.currentMessage);
  
  const handleInputChange = (e) => {
    dispatch(setCurrentMessage(e.target.value)); // Update currentMessage in Redux
  };

  const resetTextArea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "40px"; // Reset to the initial height
    }
  };

  const handleSendMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of adding a new line
      if (currentMessage.trim() ) {
        handleInputSubmit(e); // Pass event to the handler
        dispatch(setCurrentMessage("")); // Clear currentMessage in Redux
        resetTextArea(); // Reset textarea height
      }
    }
  };

  const handleSendMessageClick = () => {
    if (currentMessage.trim()  ) {
      const syntheticEvent = { target: { value: currentMessage }, type: "click" }; // Simulated event
      handleInputSubmit(syntheticEvent); // Call the submit handler with the simulated event
      dispatch(setCurrentMessage("")); // Clear currentMessage in Redux
      resetTextArea(); // Reset textarea height
    }
  };
  
  
  const handleClickOutside = () => {
    inputRef.current?.focus();
  };

  const handleTextAreaInput = (e) => {
    const textArea = e.target;
    textArea.style.height = "auto"; // Reset the height
    const newHeight = textArea.scrollHeight;
    // Only expand if the new height is below the maxHeight
    textArea.style.height = newHeight > 200 ? "200px" : `${newHeight}px`;
  };

  return (
    <div className="w-full px-4 pb-4">
      <div
        onClick={handleClickOutside}
        className="flex flex-col space-y-2 bg-gray-100 rounded-3xl max-w-2xl mx-auto p-2 shadow-md"
      >
        <div className="flex items-center bg-gray-100 rounded-3xl px-4 py-2">
          
          {/* Input Field */}
          <textarea
            ref={inputRef}
            className="flex-1 bg-gray-100 outline-none text-black border-none text-base resize-none"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={handleInputChange} // Update Redux state when input changes
            onKeyDown={handleSendMessage}
            onInput={handleTextAreaInput} // Adjust textarea height on input
            rows={1} // Start with a single row
            style={{
              minHeight: "40px", // Prevent it from being too small
              maxHeight: "200px", // Limit the maximum height
              overflowY: "auto", // Allow scrolling if text exceeds height
              transition: "height 0.2s ease", // Smooth transition for height change
              paddingTop: "8px", // Reduced padding-top for less space above the input
              paddingBottom: "8px", // Reduced padding-bottom to balance
            }}
          />
          <div className="flex items-center justify-between text-black">
            <div className="flex items-center space-x-3">
              <div className="text-gray-500 text-sm">{`${currentMessage.length}/2000`}</div>
              <button
                onClick={handleSendMessageClick}
                className={`p-2 text-black rounded-full ${
                  currentMessage.length > 0 
                    ? "bg-white hover:bg-gray-200"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
              >
                <FaArrowUpLong className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
