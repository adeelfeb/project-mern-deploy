import React from "react";
import { BsChatLeftText } from "react-icons/bs";
import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useSidebar } from "../contexts/SidebarContext";

const Header = ({ inputText, currentModel = "📑Watch To Work" }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  
  // Redux selector for current PDF (file name)
  const fileName = useSelector((state) => state.file?.currentFileData?.fileName || "");

  // Function to truncate text
  const truncateText = (text, maxLength = 15) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="sticky top-0 flex items-center justify-between bg-[#fff4f4] border-b border-gray-300 px-4 sm:px-6 lg:px-8">
  {/* Sidebar Toggle Button */}
  <button
    onClick={toggleSidebar}
    title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
    className="flex flex-col items-center p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
  >
    {isSidebarOpen ? (
      <LuPanelRightOpen className="w-5 h-5 text-gray-700" />
    ) : (
      <LuPanelLeftOpen className="w-5 h-5 text-gray-700" />
    )}
    <span className="text-xs text-gray-700">Menu</span>
  </button>


  {/* Current Model Section */}
  <div className="flex-1 text-gray-800 font-medium text-right truncate">
    {currentModel ? (
      <span className="text-green-600 hover:text-green-700 transition-colors duration-200">
         {truncateText(currentModel)} {/* Added emoji for design */}
      </span>
    ) : (
      <span className="text-gray-500 italic">🚫 No Model</span>
    )}
  </div>
</div>
  );
};

export default Header;
