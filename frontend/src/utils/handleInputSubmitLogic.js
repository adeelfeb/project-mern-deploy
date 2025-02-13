import { startChatWithMessage, generateContentWithRetry } from "../lib/geminiHelperFunc";
import uploadService from "../AserverAuth/serviceUpload";
import { addMessage, setLoading } from "../store/messageSlice.js";
import getUserData from "../AserverAuth/getUserData.js";

export const handleInputSubmitLogic = async ({
  e,
  currentMessage,
  messages,
  isLoading,
  dispatch,
  fileUrl,
  fileId,
  chatId,
  historyLimit = 10, // Default limit for previous chats
}) => {
  if ((e.key === "Enter" || e.type === "click") && !isLoading) {
    if (!currentMessage.trim() && !fileUrl) {
      console.warn("Input is empty and no file is provided.");
      return;
    }

    // Dispatch user message first
    const userMessage = {
      role: "user",
      text: currentMessage,
    };
    dispatch(addMessage(userMessage)); // Add message to store

    dispatch(setLoading(true)); // Set loading state

    try {
      // Fetch vector data based on the current message
      let relevantChunks = [];
      try {
        const response = await getUserData.getVectorData(fileId, currentMessage);
        console.log("The Vector response for this query was:", response);

        // Check if vector data is retrieved successfully
        if (response?.status === 200 && Array.isArray(response?.data)) {
          relevantChunks = response.data
            .map((item) => item?.metadata?.chunk)
            .filter(Boolean); // Extract and filter chunks
        } else {
          console.warn("Failed to retrieve vector data or no relevant chunks found.");
        }
      } catch (error) {
        if(error.status === 404){
          console.log(error.message)
        }
        else{
          console.error("Error fetching vector data:", error);
        }
      }

      // Limit the history to the most recent entries
      const limitedHistory = messages.slice(-historyLimit);

      // Format the limited history into a readable string
      const formattedHistory = limitedHistory
        .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
        .join("\n");

      // Format relevant context from vector data (if available)
      const formattedContext = relevantChunks.length
        ? relevantChunks.map((chunk) => `- ${chunk}`).join("\n")
        : "No relevant context available.";

      // Create an enhanced prompt with history and context
      const enhancedPrompt = `
      Conversation History:
      ${formattedHistory}

      Relevant Context:
      ${formattedContext}

      User Query:
      ${currentMessage}

      Task:
      Based on the conversation history and the relevant context provided, answer the user's query accurately.
      `;

      // console.log("the prompt:", enhancedPrompt);

      // Call the chat API with enhanced prompt
      const aiResponse = await startChatWithMessage([enhancedPrompt]);

      // Dispatch model response
      const modelMessage = { role: "model", text: aiResponse };
      dispatch(addMessage(modelMessage)); // Add AI response message
      dispatch(setLoading(false)); // Stop loading

      // Format messages for optional upload
      const formattedMessages = [
        ...messages, // old messages, will update after redux action
        userMessage,
        modelMessage,
      ].map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
        image: message.image || null,
      }));

      await uploadService.addChatHistory(formattedMessages, fileId); // Optional upload
    } catch (error) {
      console.error("Error during chat submission:", error);

      // Fallback logic: Use only the conversation history and user query
      const limitedHistory = messages.slice(-historyLimit);
      const formattedHistory = limitedHistory
        .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
        .join("\n");

      const fallbackPrompt = `
      Conversation History:
      ${formattedHistory}

      User Query:
      ${currentMessage}

      Task:
      Based on the conversation history provided, answer the user's query accurately.
      `;

      console.log("Fallback prompt:", fallbackPrompt);

      const fallbackResponse = await generateContentWithRetry([fallbackPrompt]); // Fallback logic
      const fallbackMessage = { role: "model", text: fallbackResponse };
      dispatch(addMessage(fallbackMessage)); // Add fallback message
    } finally {
      dispatch(setLoading(false)); // Stop loading
    }
  }
};