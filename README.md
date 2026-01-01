# 📖 Terapia com Deus - Devocional Diário

Um aplicativo de devocional diário com IA, desenvolvido para proporcionar momentos de reflexão e conexão espiritual.

## ✨ Funcionalidades

- **Devocional Diário**: Conteúdo gerado por IA com reflexões bíblicas personalizadas
- **Temas Específicos**: Escolha temas como Ansiedade, Medo, Esperança, Fé, Descanso, Gratidão, Perdão e Confiança em Deus
- **Áudio Narrado**: Ouça o devocional com voz natural gerada por IA
- **Diário Pessoal**: Anote suas reflexões e sentimentos
- **Compartilhamento**: Compartilhe o devocional com amigos
- **Offline-First**: Cache local para acesso mesmo sem internet
- **Backend Supabase**: Devocionais compartilhados entre todos os usuários para reduzir custos de API

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **IA**: OpenAI GPT-4 para geração de conteúdo
- **Áudio**: ElevenLabs para narração
- **Backend**: Supabase (Database + Storage)
- **Estilo**: Tailwind CSS
- **PWA**: Service Worker para instalação

## 📋 Pré-requisitos

- Node.js 18+
- Conta Supabase (gratuita)
- API Keys: OpenAI e ElevenLabs

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd devocional-terapia-com-Deus-1
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas chaves:
```env
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon-supabase
VITE_OPENAI_API_KEY=sua-chave-openai
VITE_ELEVEN_LABS_API_KEY=sua-chave-elevenlabs
VITE_ELEVEN_LABS_VOICE_ID=33B4UnXyTNbgLmdEDh5P
```

4. **Configure o Supabase**

Execute o script SQL no SQL Editor do Supabase:
- Acesse: https://supabase.com/dashboard/project/SEU_PROJETO/sql
- Cole e execute o conteúdo de `supabase-setup.sql`

5. **Execute o projeto**
```bash
npm run dev
```

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

## 🏗️ Estrutura do Projeto

```
├── App.tsx                      # Componente principal
├── components/                  # Componentes React
│   ├── LoadingBook.tsx         # Animação de carregamento
│   └── NotificationRequest.tsx # Solicitação de notificações
├── services/                    # Serviços de integração
│   ├── geminiService.ts        # Geração de conteúdo (OpenAI)
│   ├── elevenLabsService.ts    # Geração de áudio
│   ├── storageService.ts       # Cache local (localStorage)
│   └── supabaseService.ts      # Backend compartilhado
├── types.ts                     # Definições TypeScript
├── constants.ts                 # Constantes da aplicação
└── supabase-setup.sql          # Script de configuração do banco
```

## 🔄 Fluxo de Dados

1. **Primeiro Acesso do Dia**:
   - Busca no Supabase
   - Se não encontrar, gera novo devocional + áudio
   - Salva no Supabase para todos os usuários
   - Salva no cache local

2. **Acessos Subsequentes**:
   - Carrega do cache local (offline-first)
   - Busca áudio do Supabase em background

3. **Limpeza Automática**:
   - Devocionais antigos são removidos automaticamente
   - Mantém apenas o devocional do dia atual

## 🎨 Design

O design foi inspirado em aplicativos de leitura como Kindle, com:
- Paleta de cores quentes (âmbar, dourado)
- Tipografia serif para títulos
- Animações suaves
- Interface minimalista e focada na leitura

## 📱 PWA (Progressive Web App)

O app pode ser instalado em dispositivos móveis:
- Ícones personalizados
- Splash screen
- Funciona offline
- Notificações (em desenvolvimento)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto é de uso pessoal.

## 👤 Autora

**Talita Paixão**

---

Desenvolvido com ❤️ e fé
