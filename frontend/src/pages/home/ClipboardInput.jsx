import React, { useState, useRef } from "react";

const ClipboardInput = () => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleInputClick = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setValue(clipboardText);
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        ref={inputRef}
        type="text"
        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        placeholder="Click to paste from clipboard"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={handleInputClick}
      />
    </div>
  );
};

export default ClipboardInput;
