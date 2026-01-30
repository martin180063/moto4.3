import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Convert File to Base64 string
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes an image using gemini-3-pro-preview
 * Used for "Motorcycle Check" - Analyze parts or issues
 */
export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

/**
 * Edits/Generates image variants using gemini-2.5-flash-image
 * Used for "Travel Photos" - Apply filters or edits
 */
export const editImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string | null> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });

    // Check for inline image data in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
         return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    
    // Fallback if the model returns text instead of an image
    if (response.text) {
        console.warn("Model returned text instead of image:", response.text);
    }
    
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};