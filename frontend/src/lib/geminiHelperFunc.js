
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






export const startChatWithMessage = async (message, updateCallback) => {
  const chat = model.startChat({
    history: [], // No need to pass history here since it's already in the prompt
  });

  try {
    // If the message contains an image URL, encode it
    let encodedMessage = message;

    // Start streaming the response
    const result = await chat.sendMessageStream([encodedMessage[0]]);

    let responseText = "";

    // Stream chunks in real-time
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      responseText += chunkText;

      // Use the callback to update the UI with streamed chunks
      if (updateCallback) {
        updateCallback(responseText); // Pass the accumulated response to the callback
      }
    }

    return responseText;
  } catch (error) {
    console.error("Error during chat session:", error);

    if (error.message.includes("blocked due to SAFETY")) {
      throw new Error("Your message was flagged as unsafe. Please modify the input and try again.");
    }

    throw new Error("An unexpected error occurred during the chat session.");
  }
};



// export const startChatWithMessage = async (message, updateCallback) => {
//   const chat = model.startChat({
//     history: [], // No need to pass history here since it's already in the prompt
//   });

//   try {
//     // If the message contains an image URL, encode it
//     let encodedMessage = message;

  

//     // Start streaming the response
//     const result = await chat.sendMessageStream([encodedMessage[0]]);

//     let responseText = "";

//     // Stream chunks in real-time
//     for await (const chunk of result.stream) {
//       const chunkText = chunk.text();
//       responseText += chunkText;

//       // Use the callback to update the UI with streamed chunks
//       if (updateCallback) {
//         updateCallback(chunkText); // Pass the current chunk to the callback
//       }
//     }

//     return responseText;
//   } catch (error) {
//     console.error("Error during chat session:", error);

//     if (error.message.includes("blocked due to SAFETY")) {
//       throw new Error("Your message was flagged as unsafe. Please modify the input and try again.");
//     }

//     throw new Error("An unexpected error occurred during the chat session.");
//   }
// };