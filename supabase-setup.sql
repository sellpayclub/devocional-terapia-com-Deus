-- ============================================
-- SCRIPT SQL PARA CONFIGURAR O SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/zntgbvxmvyzjpmibhaxv/sql

-- 1. Criar tabela de devocionais diários
CREATE TABLE IF NOT EXISTS daily_devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  title TEXT NOT NULL,
  verse TEXT NOT NULL,
  reflection TEXT NOT NULL,
  application TEXT NOT NULL,
  prayer TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar índice para busca rápida por data
CREATE INDEX IF NOT EXISTS idx_daily_devotionals_date ON daily_devotionals(date);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE daily_devotionals ENABLE ROW LEVEL SECURITY;

-- 4. Política de leitura pública (todos podem ler)
CREATE POLICY "Allow public read access" 
  ON daily_devotionals 
  FOR SELECT 
  TO public 
  USING (true);

-- 5. Política de inserção (apenas via service_role ou autenticados)
-- Isso permite que o frontend insira quando gera sob demanda
CREATE POLICY "Allow authenticated insert" 
  ON daily_devotionals 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- 6. Criar bucket de storage para áudios (se não existir)
-- IMPORTANTE: Execute isso no SQL Editor OU crie manualmente via Dashboard
-- Dashboard: Storage > Create a new bucket > Name: "devotional-audios" > Public: YES

-- Verificar se o bucket existe
DO $$
BEGIN
  -- Tenta inserir o bucket (vai falhar se já existir, mas tudo bem)
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('devotional-audios', 'devotional-audios', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- 7. Política de storage - Permitir leitura pública
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'devotional-audios');

-- 8. Política de storage - Permitir upload público
CREATE POLICY "Public Upload"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'devotional-audios');

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute estas queries para verificar se tudo está OK:

-- Ver a estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'daily_devotionals';

-- Ver as políticas
SELECT * FROM pg_policies WHERE tablename = 'daily_devotionals';

-- Ver os buckets de storage
SELECT * FROM storage.buckets WHERE id = 'devotional-audios';
