
import model from "./gemini.js";


// Utility function to fetch and encode image data from URL
const encodeImageFromUrl = async (imageUrl) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
  }

  const fileBlob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1]; // Base64 string (without the data URL prefix)
      resolve({
        inlineData:{
          inlineData: {
            data: base64Data,  // Base64 image data
            mimeType: fileBlob.type,  // MIME type of the image (e.g., image/jpeg, image/png)
          }
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(fileBlob);
  });
};

// Function to handle retrying image processing
export const generateContentWithRetry = async (prompt, imageUrl = null, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      let response;
      
      if (imageUrl) {
        // Fetch and encode the image if imageUrl is provided
        const encodedImage = await encodeImageFromUrl(imageUrl);

        // Send the prompt and the encoded image data (wrapped in the expected format)
        response = await model.generateContent(prompt, encodedImage.inlineData);
      } else {
        response = await model.generateContent(prompt); // If no image, just send the prompt
      }

      if (response) {
        const aiText = response.response.candidates[0].content.parts[0].text;
        return aiText;
      }

      throw new Error("Invalid response format from Gemini");
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed. Error:`, error);

      if (attempt >= retries - 1) {
        throw error; // Re-throw the error if retries are exhausted
      }

      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Retry after 2 seconds
    }
  }
};



export const startChatWithMessage = async (message, history = [], updateCallback) => {
  // Ensure history is initialized with a default conversation if empty
  const chat = model.startChat({
    history: history.length
      ? history
      : [
          { role: "user", parts: [{ text: "Hello" }] },
          { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
        ],
  });

  try {
    // Format chat history into a readable string for the prompt
    const formattedHistory = history
      .map((entry) => `${entry.role === "user" ? "User" : "AI"}: ${entry.text}`)
      .join("\n");

    // If the message contains an image URL, encode it
    let encodedMessage = message;

    if (message[1] && message[1].startsWith("http")) {
      // If the message contains an image URL, fetch and encode it
      const encodedImage = await encodeImageFromUrl(message[1]);
      encodedMessage[1] = encodedImage.inlineData; // Replace the URL with the formatted base64 image data
    }

    // Construct the full prompt with history and the new message
    const fullPrompt = `${formattedHistory}\nUser: ${encodedMessage[0]}`;

    // Start streaming the response
    const result = await chat.sendMessageStream([fullPrompt]);

    let responseText = "";

    // Stream chunks in real-time
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      responseText += chunkText;

      // Use the callback to update the UI with streamed chunks
      if (updateCallback) {
        updateCallback(chunkText); // Pass the current chunk to the callback
      }
    }

    // Update the history with the user message and AI response
    history.push({ role: "user", text: message[0] || message }); // Handle both text and image data
    history.push({ role: "model", text: responseText });

    return responseText;
  } catch (error) {
    console.error("Error during chat session:", error);

    if (error.message.includes("blocked due to SAFETY")) {
      throw new Error("Your message was flagged as unsafe. Please modify the input and try again.");
    }

    throw new Error("An unexpected error occurred during the chat session.");
  }
};
