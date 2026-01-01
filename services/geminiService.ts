import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";
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
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: devotionalSchema,
        temperature: 0.7,
        // Desativar filtros de segurança rigorosos para permitir textos religiosos/emocionais sem bloqueio indevido
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      },
    });

    // Tratamento robusto da resposta
    let jsonString = response.text;
    
    if (!jsonString) {
      throw new Error("Resposta vazia da IA");
    }

    // Remove formatação markdown se houver (```json ... ```)
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString) as DevotionalContent;

  } catch (error) {
    console.error("Erro ao gerar devocional:", error);
    
    // Fallback amigável em caso de erro
    return {
      title: "Deus está no Controle",
      verse: "Isaías 41:10",
      reflection: "Neste momento, talvez a conexão tenha falhado, mas a conexão com Deus nunca cai. Ele diz: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.' Respire fundo e sinta essa paz agora.",
      application: "Tire um momento de silêncio e repita o versículo em voz alta.",
      prayer: "Senhor, mesmo quando as coisas não funcionam como esperado, eu confio em Ti. Amém."
    };
  }
};