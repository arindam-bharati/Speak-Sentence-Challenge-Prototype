import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponseSchema } from "../types";

// Safely retrieve API Key for Vite (import.meta.env) or Node (process.env)
const getApiKey = () => {
  try {
    // Check for Vite environment variable first
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY || '';
    }
    
    // Fallback to process.env (for Node/other setups)
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
    
    return '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const evaluateSentence = async (
  targetWords: string[],
  userTranscript: string
): Promise<GeminiResponseSchema> => {
  if (!apiKey) {
    console.error("API Key is missing. Returning mock data.");
    return mockEvaluation(targetWords, userTranscript);
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a language tutor. A student was given these target words: "${targetWords.join(', ')}".
      They spoke this sentence: "${userTranscript}".
      
      Evaluate their sentence based on:
      1. Did they use the target words (or close variations)?
      2. Is the grammar correct?
      3. Provide 2 distinct, natural sentences that use the target words correctly.
      
      Return a JSON object with feedback.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grammarCorrect: { type: Type.BOOLEAN },
            usedTargetWords: { type: Type.BOOLEAN },
            missingWords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            feedback: { type: Type.STRING },
            exampleSentences: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["grammarCorrect", "usedTargetWords", "missingWords", "feedback", "exampleSentences"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiResponseSchema;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock if API fails or key is invalid
    return mockEvaluation(targetWords, userTranscript);
  }
};

// Fallback logic for demo purposes if API key fails or network issues
const mockEvaluation = (targetWords: string[], transcript: string): GeminiResponseSchema => {
  const lowerTranscript = transcript.toLowerCase();
  const missing = targetWords.filter(w => !lowerTranscript.includes(w.toLowerCase()));
  
  return {
    grammarCorrect: missing.length === 0,
    usedTargetWords: missing.length === 0,
    missingWords: missing,
    feedback: missing.length > 0 
      ? `You missed the words: ${missing.join(", ")}.` 
      : "Good attempt, but watch your verb tense.",
    exampleSentences: [
      `I think we should go get some ${targetWords.includes('coffee') ? 'coffee' : 'food'}.`,
      `Would you like to go to a cafe with us?`
    ]
  };
};