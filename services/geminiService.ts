import { GoogleGenAI, Type, Schema } from "@google/genai";
import { API_KEY, SYSTEM_INSTRUCTION } from "../constants";
import { DevotionalContent } from "../types";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const devotionalSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    verse: { type: Type.STRING },
    reflection: { type: Type.STRING },
    application: { type: Type.STRING },
    prayer: { type: Type.STRING },
  },
  required: ["title", "verse", "reflection", "application", "prayer"],
};

export const generateDevotional = async (topic?: string): Promise<DevotionalContent> => {
  try {
    const prompt = topic 
      ? `Gere um devocional específico sobre o tema: ${topic}.` 
      : `Gere o devocional do dia de hoje. Algo inspirador para começar ou terminar o dia.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Efficient for text generation
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: devotionalSchema,
        temperature: 0.7, // Creativity balanced with coherence
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DevotionalContent;
    }
    throw new Error("Resposta vazia da IA");
  } catch (error) {
    console.error("Erro ao gerar devocional:", error);
    // Fallback safe content in case of API failure/quota
    return {
      title: "Paz em meio à tempestade",
      verse: "João 14:27",
      reflection: "Houve um erro ao conectar com o servidor. Mas lembre-se: A paz de Deus excede todo entendimento. Respire fundo, feche os olhos e saiba que Ele está no controle, mesmo quando a tecnologia falha.",
      application: "Tire 5 minutos de silêncio agora.",
      prayer: "Senhor, acalma meu coração."
    };
  }
};