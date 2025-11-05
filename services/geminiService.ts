import { GoogleGenAI, Modality } from "@google/genai";
import { UploadedImage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const generateImageWithFlash = async (image: UploadedImage, prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: image.base64,
            mimeType: image.mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated from the model.");
};

export const analyzeImageWithFlash = async (image: UploadedImage): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [{
                inlineData: {
                    data: image.base64,
                    mimeType: image.mimeType,
                }
            }, {
                text: "Describe this image in detail. What is the subject, what are they wearing, and what is the background? Be descriptive and engaging."
            }]
        }
    });
    return response.text;
};

export const analyzeImageWithProThinking = async (image: UploadedImage): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [{
                inlineData: {
                    data: image.base64,
                    mimeType: image.mimeType,
                }
            }, {
                text: `Perform a deep, complex analysis of this image. Consider the following aspects:
                1.  **Composition and Framing:** How is the subject placed? What do the angles and focus suggest?
                2.  **Lighting and Color:** Describe the lighting scheme (e.g., natural, studio, high-key, low-key). How do the colors and tones contribute to the mood?
                3.  **Subject and Emotion:** What emotions does the subject convey? What story might their expression and posture be telling?
                4.  **Symbolism and Subtext:** Are there any symbolic elements in the clothing, background, or objects? What deeper meanings or cultural references might be present?
                5.  **Technical Aspects:** Comment on the likely photographic technique, potential camera settings, and overall image quality.
                Provide a comprehensive, structured analysis.`
            }]
        },
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};
