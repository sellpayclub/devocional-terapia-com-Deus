import { DevotionalContent } from "../types";
import { ELEVEN_LABS_API_KEY, ELEVEN_LABS_VOICE_ID } from "../constants";

// Limpa caracteres Markdown (*, _, #) para a leitura ficar limpa
const cleanMarkdown = (text: string) => {
  return text
    .replace(/\*/g, "") // Remove asteriscos
    .replace(/_/g, "")  // Remove underlines
    .replace(/#/g, "")  // Remove hashs
    .replace(/\n\n/g, ". "); // Troca quebras de linha duplas por ponto
};

// Monta o texto completo para ser lido
const buildTextToRead = (content: DevotionalContent): string => {
  return `
    ${content.title}.
    
    Versículo de hoje: ${content.verse}.
    
    ${cleanMarkdown(content.reflection)}
    
    Aplicação prática: ${cleanMarkdown(content.application)}.
    
    Vamos orar? 
    ${cleanMarkdown(content.prayer)}
  `;
};

/**
 * Gera áudio e retorna Blob (para upload no Supabase)
 * Usado quando geramos o devocional compartilhado
 */
export const generateAudioBlob = async (content: DevotionalContent): Promise<Blob> => {
  try {
    const textToRead = buildTextToRead(content);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: textToRead,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ElevenLabs Error:", errorData);
      throw new Error("Falha ao gerar áudio");
    }

    // Retorna o blob diretamente
    const blob = await response.blob();
    return blob;

  } catch (error) {
    console.error("Erro no serviço de áudio:", error);
    throw error;
  }
};

/**
 * Gera áudio e retorna URL local (para uso imediato no navegador)
 * Usado para devocionais por tema (individuais)
 */
export const generateAudio = async (content: DevotionalContent): Promise<string> => {
  try {
    const blob = await generateAudioBlob(content);
    // Converte a resposta (blob de áudio) em uma URL tocável no browser
    const audioUrl = URL.createObjectURL(blob);
    return audioUrl;

  } catch (error) {
    console.error("Erro no serviço de áudio:", error);
    throw error;
  }
};