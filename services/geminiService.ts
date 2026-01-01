import OpenAI from "openai";
import { API_KEY, SYSTEM_INSTRUCTION } from "../constants";
import { DevotionalContent } from "../types";

// Inicializa o cliente OpenAI
// 'dangerouslyAllowBrowser: true' permite rodar direto no front-end (Vercel/Browser)
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true 
});

export const generateDevotional = async (topic?: string): Promise<DevotionalContent> => {
  console.log("✝️ Iniciando geração de devocional...");
  console.log("🤖 Motor de IA: OpenAI (GPT-4o-mini)");
  
  try {
    const userPrompt = topic 
      ? `Gere um devocional específico sobre o tema: ${topic}.` 
      : `Gere o devocional do dia de hoje. Algo inspirador para começar ou terminar o dia.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }, // Garante JSON perfeito
      temperature: 0.7,
    });

    const contentString = completion.choices[0].message.content;

    if (!contentString) {
      throw new Error("Resposta vazia da IA");
    }

    console.log("✅ Devocional gerado com sucesso!");
    return JSON.parse(contentString) as DevotionalContent;

  } catch (error: any) {
    console.error("❌ Erro ao gerar com OpenAI:", error);
    
    let errorMessage = "Erro desconhecido.";
    if (error.message) errorMessage = error.message;
    if (error.status === 401) errorMessage = "Chave de API inválida (401).";
    if (error.status === 429) errorMessage = "Limite de conta ou saldo excedido (429).";
    if (error.status === 500) errorMessage = "Erro no servidor da OpenAI (500).";

    // Fallback amigável
    return {
      title: "Deus está no Controle",
      verse: "Isaías 41:10",
      reflection: `(Nota Técnica: Ocorreu um erro na conexão com a OpenAI: ${errorMessage}. Tente novamente mais tarde).\n\nNeste momento, talvez a conexão tenha falhado, mas a conexão com Deus nunca cai. Ele diz: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.' Respire fundo e sinta essa paz agora.`,
      application: "Tire um momento de silêncio e repita o versículo em voz alta.",
      prayer: "Senhor, mesmo quando as coisas não funcionam como esperado, eu confio em Ti. Amém.",
      isFallback: true
    } as DevotionalContent;
  }
};