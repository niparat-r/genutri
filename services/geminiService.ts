import { GoogleGenAI, Type } from "@google/genai";
import { AiHealthAnalysis } from "../types";

const resolveApiKey = () => {
  // Prefer Vite-exposed browser variables
  const clientEnvKey = typeof import.meta !== 'undefined'
    ? (
        import.meta.env.VITE_GEMINI_API_KEY ||
        import.meta.env.VITE_API_KEY ||
        import.meta.env.GEMINI_API_KEY ||
        import.meta.env.API_KEY
      )
    : undefined;

  // Fallback for Node environments (e.g., local tooling/tests)
  const nodeEnvKey = typeof process !== 'undefined'
    ? (process.env?.GEMINI_API_KEY || process.env?.API_KEY)
    : undefined;

  return clientEnvKey || nodeEnvKey || null;
};

const createClient = () => {
  const apiKey = resolveApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getHealthAnalysis = async (menuName: string): Promise<AiHealthAnalysis | null> => {
  const ai = createClient();
  if (!ai) {
    console.warn("API Key missing");
    return {
      nutriScore: 'N/A',
      healthTip: 'Please configure API_KEY to get AI insights.'
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the Thai dish "${menuName}". Provide a Nutri-Score (A, B, C, D, or E based on general healthiness) and a short health tip (max 15 words) in Thai language.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nutriScore: {
              type: Type.STRING,
              description: "The Nutri-Score letter (A-E)",
            },
            healthTip: {
              type: Type.STRING,
              description: "A short health tip in Thai, max 15 words",
            },
          },
          required: ["nutriScore", "healthTip"],
        },
      },
    });

    const text = typeof response.text === 'function' ? response.text() : response.text;
    if (!text) return null;

    return JSON.parse(text) as AiHealthAnalysis;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      nutriScore: '?',
      healthTip: 'ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้'
    };
  }
};
