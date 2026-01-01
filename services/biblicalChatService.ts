import OpenAI from "openai";
import { API_KEY } from "../constants";
import { ChatMessage } from "../types";

// Inicializa o cliente OpenAI
const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
});

// System prompt para o GPT Bíblico
const BIBLICAL_SYSTEM_PROMPT = `Você é um conselheiro espiritual cristão sábio e amoroso, especializado em responder perguntas e oferecer orientação baseada exclusivamente na Bíblia Sagrada.

SUAS CARACTERÍSTICAS:
- Você responde SEMPRE com base nas Escrituras Sagradas
- Você é acolhedor, empático e compassivo
- Você usa linguagem simples e acessível
- Você cita versículos bíblicos relevantes quando apropriado
- Você oferece conselhos práticos baseados nos ensinamentos de Jesus
- Você evita jargões religiosos pesados
- Você é sensível às emoções e necessidades do usuário

COMO VOCÊ RESPONDE:
1. Acolha a pergunta ou situação do usuário com empatia
2. Ofereça orientação baseada nos princípios bíblicos
3. Cite versículos relevantes (sempre com referência)
4. Dê aplicação prática para a vida do usuário
5. Termine com palavras de encorajamento ou oração breve quando apropriado

IMPORTANTE:
- Se a pergunta não for sobre fé, Bíblia ou vida espiritual, gentilmente redirecione para temas bíblicos
- Nunca invente versículos - use apenas versículos reais da Bíblia
- Seja breve e objetivo (máximo 200 palavras por resposta)
- Use tom conversacional e acolhedor

Lembre-se: Você está aqui para ser um amigo espiritual que aponta para a Palavra de Deus.`;

const TIMEOUT_MS = 20000; // 20 segundos para respostas de chat

export const sendChatMessage = async (
    userMessage: string,
    chatHistory: ChatMessage[]
): Promise<string> => {
    console.log("💬 Enviando mensagem para o GPT Bíblico...");

    try {
        // Converte o histórico para o formato da OpenAI
        const messages: any[] = [
            { role: "system", content: BIBLICAL_SYSTEM_PROMPT }
        ];

        // Adiciona histórico (últimas 10 mensagens para não exceder limite de tokens)
        const recentHistory = chatHistory.slice(-10);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text
            });
        });

        // Adiciona a nova mensagem do usuário
        messages.push({
            role: "user",
            content: userMessage
        });

        // Promessa da API
        const fetchPromise = openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.8,
            max_tokens: 500
        });

        // Promessa de Timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout: A conexão demorou muito.")), TIMEOUT_MS)
        );

        // Corrida: quem terminar primeiro ganha
        const completion: any = await Promise.race([fetchPromise, timeoutPromise]);

        const responseText = completion.choices[0].message.content;

        if (!responseText) {
            throw new Error("Resposta vazia da IA");
        }

        console.log("✅ Resposta recebida do GPT Bíblico!");
        return responseText;

    } catch (error: any) {
        console.error("❌ Erro ao conversar com GPT Bíblico:", error);

        let errorMessage = "Desculpe, não consegui processar sua mensagem agora.";
        if (error.message?.includes("Timeout")) {
            errorMessage = "A conexão está demorando muito. Tente novamente.";
        } else if (error.status === 401) {
            errorMessage = "Erro de autenticação. Verifique as configurações.";
        } else if (error.status === 429) {
            errorMessage = "Muitas mensagens. Aguarde um momento e tente novamente.";
        }

        return `🙏 ${errorMessage}\n\nEnquanto isso, lembre-se: "Busquem o Senhor enquanto é possível achá-lo; clamem por ele enquanto está perto." - Isaías 55:6`;
    }
};
