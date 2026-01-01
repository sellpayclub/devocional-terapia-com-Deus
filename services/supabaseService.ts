import { createClient } from '@supabase/supabase-js'
import { DevotionalContent } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface DailyDevotional {
  id: string
  date: string
  title: string
  verse: string
  reflection: string
  application: string
  prayer: string
  audio_url: string | null
  created_at: string
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD no horário do Brasil (UTC-3)
 */
const getTodayBrazil = (): string => {
  const now = new Date()
  // Converte para horário do Brasil (UTC-3)
  const brazilTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  return brazilTime.toISOString().split('T')[0]
}

/**
 * Limpa devocionais antigos (de dias anteriores) para não acumular no banco
 * Também remove os arquivos de áudio do Storage
 */
const cleanupOldDevotionals = async (): Promise<void> => {
  try {
    const today = getTodayBrazil()

    // Busca devocionais antigos (data diferente de hoje)
    const { data: oldDevotionals, error: fetchError } = await supabase
      .from('daily_devotionals')
      .select('*')
      .neq('date', today)

    if (fetchError) {
      console.error('⚠️ Erro ao buscar devocionais antigos:', fetchError)
      return
    }

    if (!oldDevotionals || oldDevotionals.length === 0) {
      return // Nada para limpar
    }

    console.log(`🧹 Limpando ${oldDevotionals.length} devocional(is) antigo(s)...`)

    // Remove arquivos de áudio do Storage
    for (const devotional of oldDevotionals) {
      if (devotional.audio_url) {
        const fileName = `${devotional.date}.mp3`
        await supabase.storage
          .from('devotional-audios')
          .remove([fileName])
      }
    }

    // Remove registros do banco
    const { error: deleteError } = await supabase
      .from('daily_devotionals')
      .delete()
      .neq('date', today)

    if (deleteError) {
      console.error('⚠️ Erro ao deletar devocionais antigos:', deleteError)
    } else {
      console.log('✅ Devocionais antigos removidos com sucesso!')
    }
  } catch (error) {
    console.error('⚠️ Erro na limpeza de devocionais:', error)
  }
}

/**
 * Busca o devocional do dia no Supabase
 * Retorna null se não encontrar
 */
export const getDailyDevotionalFromSupabase = async (): Promise<DailyDevotional | null> => {
  try {
    const today = getTodayBrazil()

    // Limpa devocionais antigos (de dias anteriores) para não acumular no banco
    await cleanupOldDevotionals()

    const { data, error } = await supabase
      .from('daily_devotionals')
      .select('*')
      .eq('date', today)
      .single()

    if (error) {
      // Se não encontrou, não é erro crítico
      if (error.code === 'PGRST116') {
        console.log('📅 Nenhum devocional encontrado para hoje ainda')
        return null
      }
      console.error('❌ Erro ao buscar devocional:', error)
      return null
    }

    console.log('✅ Devocional do dia encontrado no Supabase!')
    return data
  } catch (error) {
    console.error('❌ Erro na conexão com Supabase:', error)
    return null
  }
}

/**
 * Salva um novo devocional no Supabase
 * Usado quando geramos sob demanda (primeiro usuário do dia)
 */
export const saveDailyDevotionalToSupabase = async (
  content: DevotionalContent,
  audioUrl?: string
): Promise<DailyDevotional | null> => {
  try {
    const today = getTodayBrazil()

    const { data, error } = await supabase
      .from('daily_devotionals')
      .insert({
        date: today,
        title: content.title,
        verse: content.verse,
        reflection: content.reflection,
        application: content.application,
        prayer: content.prayer,
        audio_url: audioUrl || null
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar devocional:', error)
      return null
    }

    console.log('✅ Devocional salvo no Supabase!')
    return data
  } catch (error) {
    console.error('❌ Erro ao salvar no Supabase:', error)
    return null
  }
}

/**
 * Faz upload do áudio para o Supabase Storage
 * Retorna a URL pública do áudio
 */
export const uploadAudioToSupabase = async (audioBlob: Blob): Promise<string | null> => {
  try {
    const today = getTodayBrazil()
    const fileName = `${today}.mp3`

    // Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from('devotional-audios')
      .upload(fileName, audioBlob, {
        contentType: 'audio/mpeg',
        upsert: true // Substitui se já existir
      })

    if (uploadError) {
      console.error('❌ Erro ao fazer upload do áudio:', uploadError)
      return null
    }

    // Pega a URL pública
    const { data } = supabase.storage
      .from('devotional-audios')
      .getPublicUrl(fileName)

    console.log('✅ Áudio salvo no Supabase Storage!')
    return data.publicUrl
  } catch (error) {
    console.error('❌ Erro no upload do áudio:', error)
    return null
  }
}

/**
 * Atualiza o audio_url de um devocional existente
 */
export const updateDevotionalAudioUrl = async (
  devotionalId: string,
  audioUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('daily_devotionals')
      .update({ audio_url: audioUrl })
      .eq('id', devotionalId)

    if (error) {
      console.error('❌ Erro ao atualizar URL do áudio:', error)
      return false
    }

    console.log('✅ URL do áudio atualizada!')
    return true
  } catch (error) {
    console.error('❌ Erro ao atualizar áudio:', error)
    return false
  }
}
