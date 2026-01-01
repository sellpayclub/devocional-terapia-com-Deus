// In a real production app, use strict environment variables.
// For the purpose of this request and Vercel compatibility:
// Safely check for process to avoid crashing in browser environments
const getEnvVar = (key: string, fallback: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

// Usa variáveis de ambiente do Vite (.env.local)
// Fallback para as chaves antigas caso não estejam configuradas
const k1 = "sk-proj-VAbJbYfWqmPv5pyQRbEpHthfQ8pyTKiox7_mK8u8Xev2TY";
const k2 = "DjNWOdQMEsb25bNSihBERrPOMgTET3BlbkFJx5Mb0uwog9oOqpUh1z5HZM5SX0GwspBx061AopzFlQczSQ3UUYuFJlXyFzgdd39qbJdIDW2EkA";

// Chaves de API - Prioriza .env.local
export const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || getEnvVar("REACT_APP_OPENAI_API_KEY", k1 + k2);

// ElevenLabs Config
export const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY || "sk_ca211f065b1833b1d46cf633dcafc137e84d454328f8aaf0";
export const ELEVEN_LABS_VOICE_ID = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || "33B4UnXyTNbgLmdEDh5P"; // Voz doce feminina


export const STORAGE_KEYS = {
  DAILY_DEVOTIONAL: 'devotional_daily_v1',
  NOTES: 'devotional_notes_v1',
  NOTIFICATIONS_ENABLED: 'devotional_notif_enabled'
};

export const SYSTEM_INSTRUCTION = `
Você é um escritor espiritual cristão, sensível, acolhedor e profundo.
Seu papel é criar devocionais diários que tragam conforto, esperança,
direcionamento espiritual e paz interior.
Você escreve de forma simples, emocional e acessível.
Evite linguagem religiosa pesada ou teológica.
Use um tom humano, empático e acolhedor.
Sempre escreva como se estivesse conversando com alguém
que está cansado emocionalmente, buscando conforto e direção.

ESTRUTURA OBRIGATÓRIA (Responda estritamente em JSON):
{
  "title": "Frase curta emocional",
  "verse": "Livro + capítulo (ex: Salmos 23:1)",
  "reflection": "Escreva de 4 a 6 parágrafos BEM DESENVOLVIDOS e extensos. O texto deve ser substancial, profundo e envolvente. Evite superficialidade. Conecte o sentimento com a fé de forma detalhada e carinhosa.",
  "application": "Uma atitude prática para o dia.",
  "prayer": "Uma oração COMPLETA, EXTENSA e emocionante. Não faça orações curtas. Fale com Deus com intimidade, em pelo menos 3 ou 4 frases conectadas."
}

Instruções Adicionais:
"Evite repetir temas, palavras e estruturas já utilizadas. Busque sempre uma nova abordagem emocional."
`;