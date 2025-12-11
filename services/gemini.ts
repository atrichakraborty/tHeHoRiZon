import { GoogleGenAI, Modality, Type } from "@google/genai";
import { GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Science: Knowledge Base Entry Generator
export const organizeResearch = async (notes: string, type: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Transform the following raw notes into a structured scientific knowledge base entry of type "${type}". 
      Input Notes: ${notes}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING, description: "Detailed content in Markdown format" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING }
          },
          required: ["title", "content", "tags", "category"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Science API Error:", error);
    return null;
  }
};

// 2. Education: Adaptive Learning Engine
export const generateEduResponse = async (
  topic: string, 
  level: string, 
  style: string = "Standard",
  mode: "explain" | "quiz" | "analogy" | "application" = "explain"
): Promise<string> => {
  try {
    let systemInstruction = `You are an expert tutor. Target audience: ${level}. Style: ${style}.`;
    let prompt = "";

    switch(mode) {
      case 'quiz':
        systemInstruction += " Create a 3-question multiple-choice quiz to test understanding of the concept. Include the correct answers at the very end.";
        prompt = `Generate a quiz for: ${topic}`;
        break;
      case 'analogy':
        systemInstruction += " Create a creative and intuitive analogy to explain the concept.";
        prompt = `Give me an analogy for: ${topic}`;
        break;
      case 'application':
        systemInstruction += " Explain the real-world practical applications of this concept. Why does it matter?";
        prompt = `Real-world applications of: ${topic}`;
        break;
      default:
        systemInstruction += " Explain the concept clearly using structure, examples, and key terms.";
        prompt = `Explain: ${topic}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { systemInstruction },
    });
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Edu API Error:", error);
    return "Error generating content.";
  }
};

// 3. Accessibility: Vision & TTS
export const describeImage = async (base64Image: string, mimeType: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: "Describe this image in detail for visually impaired users. Focus on layout, colors, and key text." }
        ]
      },
    });
    return response.text || null;
  } catch (error) {
    console.error("Vision API Error:", error);
    return null;
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS API Error:", error);
    return null;
  }
};

// 4. Health: Predictive Health Monitoring
export const analyzeHealthRisks = async (patientData: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following patient data to identify potential health risks. Provide a risk assessment for a healthcare provider.
      Patient Data: ${patientData}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Critical"] },
            riskScore: { type: Type.INTEGER, description: "0-100 scale" },
            identifiedRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            alerts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Urgent warnings" },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["riskLevel", "riskScore", "identifiedRisks", "recommendations"]
        }
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Health API Error:", error);
    return null;
  }
};

// 5. Business: Professional Writing
export const generateBusinessEmail = async (draftPoints: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Draft a professional email based on these points: ${draftPoints}`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Business API Error:", error);
    return "Error generating email.";
  }
};

// 6. Technology: Auto-Documentation
export const generateDocumentation = async (code: string, model: string = "gemini-3-pro-preview"): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model, 
      contents: `Generate clear, concise documentation for the following code. 
      Include:
      1. Overview
      2. Function/Class Signatures
      3. Parameters & Return Values
      4. Usage Examples
      
      Output in standard Markdown.
      
      Code:
      ${code}`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Tech API Error:", error);
    return "Error generating documentation.";
  }
};