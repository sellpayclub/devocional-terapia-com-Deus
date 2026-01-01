import OpenAI from "openai";
import { API_KEY, SYSTEM_INSTRUCTION } from "../constants";
import { DevotionalContent } from "../types";

// Inicializa o cliente OpenAI
// 'dangerouslyAllowBrowser: true' permite rodar direto no front-end (Vercel/Browser)
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true 
});

// Tempo máximo de espera para a IA responder (15 segundos)
const TIMEOUT_MS = 15000;

export const generateDevotional = async (topic?: string): Promise<DevotionalContent> => {
  console.log("✝️ Iniciando geração de devocional...");
  
  try {
    const userPrompt = topic 
      ? `Gere um devocional específico sobre o tema: ${topic}.` 
      : `Gere o devocional do dia de hoje. Algo inspirador para começar ou terminar o dia.`;

    // Promessa da API
    const fetchPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Promessa de Timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout: A conexão demorou muito.")), TIMEOUT_MS)
    );

    // Corrida: quem terminar primeiro ganha. Se o timeout ganhar, lança erro.
    const completion: any = await Promise.race([fetchPromise, timeoutPromise]);

    const contentString = completion.choices[0].message.content;

    if (!contentString) {
      throw new Error("Resposta vazia da IA");
    }

    console.log("✅ Devocional gerado com sucesso!");
    return JSON.parse(contentString) as DevotionalContent;

  } catch (error: any) {
    console.error("❌ Erro ao gerar com OpenAI:", error);
    
    let errorMessage = "Erro de conexão.";
    if (error.message) errorMessage = error.message;
    if (error.status === 401) errorMessage = "Chave de API inválida.";
    if (error.status === 429) errorMessage = "Muitos acessos. Tente mais tarde.";
    if (error.status === 500) errorMessage = "Erro no servidor da IA.";

    // Fallback amigável - Este objeto tem a flag isFallback: true
    // O App.tsx vai detectar isso e permitir tentar de novo.
    return {
      title: "Deus está no Controle",
      verse: "Salmos 46:1",
      reflection: `(Não conseguimos gerar o devocional novo agora devido a: ${errorMessage}. Clique em 'Tentar Novamente' acima).\n\nEnquanto isso, lembre-se: Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia. Mesmo quando a tecnologia falha ou o dia parece confuso, a paz de Deus permanece acessível a nós através de uma simples oração. Respire fundo e confie.`,
      application: "Tente atualizar a página ou clicar no botão de recarregar.",
      prayer: "Senhor, acalma meu coração e renova minhas forças. Amém.",
      isFallback: true
    } as DevotionalContent;
  }
};