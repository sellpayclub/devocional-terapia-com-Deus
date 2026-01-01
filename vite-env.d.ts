/// &lt;reference types="vite/client" /&gt;

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_OPENAI_API_KEY: string
    readonly VITE_ELEVEN_LABS_API_KEY: string
    readonly VITE_ELEVEN_LABS_VOICE_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
