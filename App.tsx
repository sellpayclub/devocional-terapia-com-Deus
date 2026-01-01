import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Heart, PenLine, ChevronRight, Share2, ArrowLeft, Sun, Copy, Home, RefreshCw, ExternalLink, PlayCircle, PauseCircle, Loader2, MessageCircle, Send, ShoppingCart } from 'lucide-react';
import { DevotionalContent, AppView, TOPICS_LIST, Note, ChatMessage } from './types';
import { generateDevotional } from './services/geminiService';
import { generateAudio, generateAudioBlob } from './services/elevenLabsService';
import { getDailyDevotional, saveDailyDevotional, saveNote, getNotes, deleteNote } from './services/storageService';
import { getDailyDevotionalFromSupabase, saveDailyDevotionalToSupabase, uploadAudioToSupabase } from './services/supabaseService';
import { sendChatMessage } from './services/biblicalChatService';
import { LoadingBook } from './components/LoadingBook';
import { NotificationRequest } from './components/NotificationRequest';
import { SalesLanding } from './components/SalesLanding';

function App() {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [currentDevotional, setCurrentDevotional] = useState<DevotionalContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Audio States
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initial Load
  useEffect(() => {
    setNotes(getNotes());

    // Simulate Notification Check
    const checkNotification = () => {
      const hour = new Date().getHours();
      if (hour === 8 && Notification.permission === 'granted') {
        // Logic to trigger notification
      }
    };
    checkNotification();
  }, []);

  // Limpa o áudio ao mudar de devocional ou sair da tela
  useEffect(() => {
    stopAudio();
    return () => stopAudio();
  }, [currentDevotional, view]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const loadDaily = async (forceRefresh = false) => {
    setActiveTopic(null);

    // 1. Tenta cache local primeiro (offline-first) - Apenas se não estiver forçando refresh
    if (!forceRefresh) {
      const cached = getDailyDevotional();
      if (cached && !cached.isFallback) {
        console.log('📦 Usando devocional do cache local');
        setCurrentDevotional(cached);
        setAudioUrl(null); // Será carregado do Supabase depois
        setLoading(false);

        // Busca o áudio do Supabase em background (se existir)
        getDailyDevotionalFromSupabase().then(supabaseData => {
          if (supabaseData?.audio_url) {
            setAudioUrl(supabaseData.audio_url);
          }
        });

        return;
      }
    }

    setLoading(true);
    setCurrentDevotional(null);
    setAudioUrl(null);

    try {
      console.log('🌐 Buscando devocional do Supabase...');

      // 2. Busca do Supabase (compartilhado entre todos)
      let supabaseDevotional = await getDailyDevotionalFromSupabase();

      // 3. Se não encontrou no Supabase, GERA e SALVA (primeiro usuário do dia)
      if (!supabaseDevotional) {
        console.log('⚡ Gerando novo devocional para todos os usuários...');

        // Gera o devocional
        const freshDevotional = await generateDevotional();

        // Se gerou com sucesso (não é fallback)
        if (!freshDevotional.isFallback) {
          console.log('🎤 Gerando áudio compartilhado...');

          // Gera o áudio
          let audioUrl: string | null = null;
          try {
            const audioBlob = await generateAudioBlob(freshDevotional);
            audioUrl = await uploadAudioToSupabase(audioBlob);
          } catch (audioError) {
            console.error('⚠️ Erro ao gerar/salvar áudio, mas devocional será salvo:', audioError);
          }

          // Salva no Supabase
          supabaseDevotional = await saveDailyDevotionalToSupabase(freshDevotional, audioUrl || undefined);

          // Salva no cache local também
          saveDailyDevotional(freshDevotional);

          console.log('✅ Devocional e áudio salvos no Supabase!');
        } else {
          // Se falhou, mostra o fallback mas não salva
          setCurrentDevotional(freshDevotional);
          setLoading(false);
          return;
        }
      }

      // 4. Se encontrou no Supabase, converte e exibe
      if (supabaseDevotional) {
        const content: DevotionalContent = {
          title: supabaseDevotional.title,
          verse: supabaseDevotional.verse,
          reflection: supabaseDevotional.reflection,
          application: supabaseDevotional.application,
          prayer: supabaseDevotional.prayer,
          isFallback: false
        };

        // Salva no cache local
        saveDailyDevotional(content);
        setCurrentDevotional(content);

        // Se tem áudio, carrega
        if (supabaseDevotional.audio_url) {
          setAudioUrl(supabaseDevotional.audio_url);
        }

        console.log('✅ Devocional carregado do Supabase!');
      }

    } catch (error) {
      console.error('❌ Erro ao carregar devocional:', error);

      // Fallback: Tenta gerar localmente
      const fallbackDevotional = await generateDevotional();
      setCurrentDevotional(fallbackDevotional);

      // Salva no cache se não for fallback de erro
      if (!fallbackDevotional.isFallback) {
        saveDailyDevotional(fallbackDevotional);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartDaily = () => {
    setView(AppView.DAILY);
    loadDaily();
  };

  const handleStartTopics = () => {
    setView(AppView.TOPICS);
  };

  const handleTopicSelect = async (topic: string) => {
    setActiveTopic(topic);
    setCurrentDevotional(null);
    setAudioUrl(null);
    setLoading(true);
    setView(AppView.DAILY);

    const fresh = await generateDevotional(topic);
    setCurrentDevotional(fresh);
    setLoading(false);
  };

  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    const updated = saveNote(noteInput);
    setNotes(updated);
    setNoteInput('');
    alert('Anotação salva com carinho!');
  };

  const handleShare = async () => {
    if (!currentDevotional) return;

    // Texto completo formatado para compartilhamento (WhatsApp, etc)
    const textToShare = `📖 *Devocional: Terapia com Deus*\n\n*${currentDevotional.title}*\n_"${currentDevotional.verse}"_\n\n${currentDevotional.reflection}\n\n*Aplicação:* ${currentDevotional.application}\n\n*Oração:* ${currentDevotional.prayer}\n\n_Gerado pelo App Terapia com Deus_`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentDevotional.title,
          text: textToShare
        });
      } catch (err) {
        // Shared cancelled
      }
    } else {
      // Fallback: Copiar para área de transferência
      navigator.clipboard.writeText(textToShare);
      alert("Devocional copiado para a área de transferência!");
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput.trim(),
      isUser: true,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await sendChatMessage(userMessage.text, chatMessages);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: Date.now()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleToggleAudio = async () => {
    if (!currentDevotional) return;

    // Se já tem áudio carregado, apenas toca/pausa
    if (audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
      return;
    }

    // Se não tem, gera
    setIsAudioLoading(true);
    try {
      const url = await generateAudio(currentDevotional);
      setAudioUrl(url);
      // Pequeno delay para garantir que o elemento <audio> renderizou com a nova URL
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    } catch (e) {
      alert("Não foi possível gerar o áudio agora.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  // --- VIEWS ---

  const renderLandingView = () => (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-between animate-fadeIn">

      {/* Background Image Layer with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.postimg.cc/MGNXmP1D/fundo-devocional.png"
          alt="Sunset Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-900/40 to-orange-500/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="z-10 w-full flex-1 flex flex-col items-center justify-center px-6 text-center pt-20">

        <p className="font-serif text-white/90 text-2xl italic tracking-wide drop-shadow-md mb-2">
          Terapia diária com
        </p>

        <h1 className="font-serif text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-500 font-black drop-shadow-xl tracking-tight mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          DEUS!
        </h1>

        <div className="w-24 h-1 bg-yellow-400/80 rounded-full mb-8 shadow-lg"></div>

        <p className="font-serif text-white text-lg md:text-xl font-light tracking-wider drop-shadow-md max-w-xs leading-relaxed">
          Um Devocional para Acalmar o Coração
        </p>
        <p className="font-sans text-yellow-100/80 text-xs uppercase tracking-[0.3em] mt-4 mb-12 drop-shadow-sm">
          365 Dias de Encontro com Deus
        </p>

        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={handleStartDaily}
            className="w-full bg-white/10 backdrop-blur-md border border-white/40 text-white font-serif text-lg py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
          >
            <Sun size={24} className="text-yellow-300" />
            <span className="font-semibold drop-shadow-md">Ler Devocional de Hoje</span>
          </button>

          <button
            onClick={handleStartTopics}
            className="w-full bg-black/20 backdrop-blur-md border border-white/20 text-white/90 font-serif text-lg py-4 rounded-full hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Heart size={20} className="text-pink-300" />
            <span>Escolher Tema</span>
          </button>

          <button
            onClick={() => setView(AppView.CHAT)}
            className="w-full bg-gradient-to-r from-amber-900/30 to-amber-800/30 backdrop-blur-md border border-amber-400/40 text-amber-50 font-serif text-lg py-4 rounded-full hover:from-amber-900/40 hover:to-amber-800/40 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <MessageCircle size={20} className="text-amber-200" />
            <span>Conversar com GPT Bíblico</span>
          </button>
        </div>
      </div>

      <div className="z-10 pb-8 pt-4 w-full text-center">
        <p className="font-serif text-white/60 text-sm italic">Autora: Talita Paixão</p>
      </div>
    </div>
  );

  const renderReadingView = () => {
    // Show loading if state is loading OR if we are in daily view but have no content yet
    if (loading) return <LoadingBook />;

    // Se não estiver carregando e não tiver conteúdo (raro), mostra mensagem padrão
    if (!currentDevotional) return <div className="p-10 text-center text-warmGray">Carregando...</div>;

    // Gera o link para o BibleGateway
    const bibleUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(currentDevotional.verse)}&version=NVI-PT`;

    return (
      <div className="animate-fadeIn pb-24">
        {activeTopic && (
          <button
            onClick={() => { setActiveTopic(null); loadDaily(); }}
            className="mb-4 flex items-center text-accent text-sm font-semibold"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar ao Dia
          </button>
        )}

        {/* --- ÁREA DE TRATAMENTO DE ERRO --- */}
        {/* Se for Fallback, mostramos um aviso destacado e o botão de tentar de novo */}
        {currentDevotional.isFallback && (
          <div className="bg-red-50 border-2 border-red-100 rounded-xl p-6 mb-8 text-center shadow-sm animate-pulse">
            <h3 className="text-red-800 font-bold mb-2">Falha na conexão</h3>
            <p className="text-red-700/80 text-sm mb-4">
              Não foi possível gerar o devocional fresquinho agora. Verifique sua internet.
            </p>
            <button
              onClick={() => loadDaily(true)} // Força o refresh ao clicar
              className="w-full bg-red-100 hover:bg-red-200 text-red-800 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              Tentar Gerar Novamente
            </button>
          </div>
        )}

        <header className="mb-8 text-center border-b-2 border-goldLight pb-6">
          <span className="block text-accent uppercase tracking-widest text-xs font-bold mb-2">
            {activeTopic ? `Série: ${activeTopic}` : 'Devocional Diário'}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-ink font-bold leading-tight mb-4">
            {currentDevotional.title}
          </h1>

          <div className="flex flex-col items-center gap-4">
            <div className="inline-block border-y border-gold py-2 px-4 bg-orange-50/50 hover:bg-orange-100/50 transition-colors cursor-pointer group rounded-sm">
              <a
                href={bibleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif italic text-lg text-amber-900 group-hover:text-amber-700 transition flex items-center justify-center gap-2"
                title="Ler capítulo completo na Bíblia Online"
              >
                "{currentDevotional.verse}"
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-50 transition-opacity text-gold" />
              </a>
            </div>

            {/* AUDIO PLAYER */}
            {!currentDevotional.isFallback && (
              <div className="w-full max-w-xs">
                <button
                  onClick={handleToggleAudio}
                  disabled={isAudioLoading}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full transition-all duration-300 shadow-sm border
                    ${isPlaying
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-goldLight text-ink hover:border-gold hover:shadow-md'
                    }`}
                >
                  {isAudioLoading ? (
                    <Loader2 size={24} className="animate-spin text-gold" />
                  ) : isPlaying ? (
                    <PauseCircle size={24} className="text-amber-700" fill="currentColor" fillOpacity={0.2} />
                  ) : (
                    <PlayCircle size={24} className="text-gold" />
                  )}

                  <span className="font-sans font-bold text-sm uppercase tracking-wide">
                    {isAudioLoading ? "Gerando Áudio..." : isPlaying ? "Pausar Leitura" : "Ouvir Devocional"}
                  </span>
                </button>
                {/* Elemento de áudio invisível */}
                {audioUrl && (
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                )}
              </div>
            )}
          </div>
        </header>

        <article className="prose prose-lg prose-p:font-body prose-p:text-ink prose-p:leading-relaxed max-w-none">
          {currentDevotional.reflection.split('\n').map((para, i) => (
            para.trim() && <p key={i} className="mb-4 indent-6 text-justify leading-8">{para}</p>
          ))}
        </article>

        <div className="mt-8 bg-white p-6 rounded-xl border border-goldLight shadow-sm">
          <h3 className="font-sans font-bold text-accent uppercase text-sm mb-2">Aplicação Prática</h3>
          <p className="font-body text-ink">{currentDevotional.application}</p>
        </div>

        <div className="mt-6 bg-gradient-to-br from-amber-900 to-amber-800 text-orange-50 p-6 rounded-xl shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Heart size={100} fill="currentColor" />
          </div>
          <h3 className="font-serif text-xl mb-3 relative z-10 text-goldLight">Oração</h3>
          <p className="font-body italic relative z-10 font-light leading-relaxed">"{currentDevotional.prayer}"</p>
        </div>

        {/* Quick Note Action */}
        <div className="mt-12">
          <h3 className="font-serif text-xl text-ink mb-4 flex items-center gap-2">
            <PenLine size={20} className="text-gold" /> Anotar sentimento
          </h3>
          <textarea
            className="w-full p-4 rounded-lg bg-white border border-goldLight focus:border-gold outline-none font-body text-ink resize-none h-32 shadow-inner"
            placeholder="O que Deus falou com você hoje?"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-gold hover:text-amber-700 transition rounded-lg border border-transparent hover:border-goldLight"
            >
              <Share2 size={20} />
              <span className="text-sm font-bold">Compartilhar</span>
            </button>
            <button
              onClick={handleSaveNote}
              className="bg-gold text-white px-6 py-2 rounded-full font-sans font-bold hover:bg-amber-600 transition shadow-sm hover:shadow-md"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTopicsView = () => (
    <div className="pb-24 animate-fadeIn">
      <h2 className="font-serif text-3xl text-ink font-bold mb-6">Como está seu coração?</h2>
      <p className="text-warmGray mb-8">Escolha um tema para receber uma palavra específica de Deus para este momento.</p>

      <div className="grid grid-cols-1 gap-3">
        {TOPICS_LIST.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicSelect(topic)}
            className="flex items-center justify-between p-5 bg-white rounded-xl border border-goldLight/50 hover:border-gold hover:shadow-md transition-all group text-left"
          >
            <span className="font-serif text-lg text-ink font-medium group-hover:text-amber-900 transition">{topic}</span>
            <ChevronRight className="text-goldLight group-hover:text-gold transition" size={20} />
          </button>
        ))}
      </div>
    </div>
  );

  const renderNotesView = () => (
    <div className="pb-24 animate-fadeIn">
      <h2 className="font-serif text-3xl text-ink font-bold mb-6">Meu Diário</h2>
      {notes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-goldLight/50 rounded-xl">
          <PenLine size={48} className="mx-auto text-goldLight mb-4" />
          <p className="text-warmGray">Você ainda não tem anotações.</p>
          <p className="text-sm text-gold mt-2">Escreva algo no final do devocional.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-5 rounded-lg border border-orange-100 shadow-sm relative group transition hover:shadow-md">
              <span className="text-[10px] text-gold font-bold uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full">{note.date}</span>
              <p className="mt-3 font-body text-ink whitespace-pre-wrap leading-relaxed">{note.text}</p>
              <button
                onClick={() => setNotes(deleteNote(note.id))}
                className="absolute top-4 right-4 text-warmGray/50 hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderChatView = () => (
    <div className="pb-32 animate-fadeIn flex flex-col h-[calc(100vh-180px)]">
      <div className="mb-6">
        <h2 className="font-serif text-3xl text-ink font-bold mb-2">GPT Bíblico</h2>
        <p className="text-warmGray text-sm">Converse com a IA sobre a Palavra de Deus. Peça conselhos, orientação ou tire dúvidas sobre a Bíblia.</p>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {chatMessages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-goldLight/50 rounded-xl">
            <MessageCircle size={48} className="mx-auto text-goldLight mb-4" />
            <p className="text-warmGray mb-2">Comece uma conversa</p>
            <p className="text-sm text-gold">Pergunte algo sobre a Bíblia ou peça um conselho espiritual</p>
            <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
              <p className="text-xs text-warmGray italic">💡 Exemplos:</p>
              <p className="text-xs text-ink bg-white p-2 rounded border border-goldLight">"Como lidar com a ansiedade segundo a Bíblia?"</p>
              <p className="text-xs text-ink bg-white p-2 rounded border border-goldLight">"O que a Bíblia diz sobre perdão?"</p>
            </div>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${message.isUser
                  ? 'bg-gradient-to-br from-amber-900 to-amber-800 text-white'
                  : 'bg-white border border-goldLight text-ink'
                  }`}
              >
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-gold" />
                    <span className="text-xs font-bold text-gold uppercase tracking-wider">GPT Bíblico</span>
                  </div>
                )}
                <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <span className={`text-[10px] mt-2 block ${message.isUser ? 'text-orange-200' : 'text-warmGray'}`}>
                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-goldLight p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-gold" />
                <span className="text-sm text-warmGray">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="sticky bottom-20 bg-paper pt-4 border-t border-goldLight">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
            placeholder="Digite sua pergunta..."
            disabled={isChatLoading}
            className="flex-1 px-4 py-3 rounded-full bg-white border border-goldLight focus:border-gold outline-none font-body text-ink disabled:opacity-50"
          />
          <button
            onClick={handleSendChatMessage}
            disabled={!chatInput.trim() || isChatLoading}
            className="bg-gold text-white p-3 rounded-full hover:bg-amber-600 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // Se estiver na Landing, renderiza sem navegação
  if (view === AppView.LANDING) {
    return renderLandingView();
  }

  // Se estiver na Sales, renderiza a landing page de vendas
  if (view === AppView.SALES) {
    return <SalesLanding />;
  }

  // Layout Principal (Leitura, Temas, Notas)
  return (
    <div className="min-h-screen bg-paper selection:bg-goldLight selection:text-ink">
      <NotificationRequest />

      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-goldLight/50 px-6 py-4 flex justify-between items-center transition-all shadow-sm">
        <span className="font-serif font-bold text-xl text-ink tracking-tight flex items-center gap-2">
          {/* Ícone pequeno de pomba ou cruz */}
          <span className="text-gold">✝</span>
          Terapia com Deus
        </span>

        {/* Botão Home/Capa Explicito */}
        <button
          onClick={() => setView(AppView.LANDING)}
          className="w-10 h-10 rounded-full bg-white border border-goldLight flex items-center justify-center text-warmGray hover:text-gold hover:border-gold transition shadow-sm"
          aria-label="Voltar para o Início"
        >
          <Home size={20} />
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-6 pt-6">
        {view === AppView.DAILY && renderReadingView()}
        {view === AppView.TOPICS && renderTopicsView()}
        {view === AppView.NOTES && renderNotesView()}
        {view === AppView.CHAT && renderChatView()}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-goldLight pb-safe pt-2 px-6 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={() => {
              setView(AppView.DAILY);
              // Importante: Se clicar em "Leitura", tenta carregar o dia atual do cache se não estiver forçando
              if (!activeTopic) loadDaily();
            }}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 w-20 ${view === AppView.DAILY ? 'text-amber-900 -translate-y-1' : 'text-warmGray hover:text-amber-700'}`}
          >
            <BookOpen size={24} strokeWidth={view === AppView.DAILY ? 2.5 : 1.5} />
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${view === AppView.DAILY ? 'opacity-100' : 'opacity-70'}`}>Leitura</span>
          </button>

          <button
            onClick={() => setView(AppView.TOPICS)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 w-20 ${view === AppView.TOPICS ? 'text-amber-900 -translate-y-1' : 'text-warmGray hover:text-amber-700'}`}
          >
            <Heart size={24} strokeWidth={view === AppView.TOPICS ? 2.5 : 1.5} />
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${view === AppView.TOPICS ? 'opacity-100' : 'opacity-70'}`}>Temas</span>
          </button>

          <button
            onClick={() => setView(AppView.NOTES)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 w-20 ${view === AppView.NOTES ? 'text-amber-900 -translate-y-1' : 'text-warmGray hover:text-amber-700'}`}
          >
            <PenLine size={24} strokeWidth={view === AppView.NOTES ? 2.5 : 1.5} />
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${view === AppView.NOTES ? 'opacity-100' : 'opacity-70'}`}>Diário</span>
          </button>

          <button
            onClick={() => setView(AppView.CHAT)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 w-20 ${view === AppView.CHAT ? 'text-amber-900 -translate-y-1' : 'text-warmGray hover:text-amber-700'}`}
          >
            <MessageCircle size={24} strokeWidth={view === AppView.CHAT ? 2.5 : 1.5} />
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${view === AppView.CHAT ? 'opacity-100' : 'opacity-70'}`}>Chat</span>
          </button>
        </div>
      </nav>

      {/* Safe area spacer */}
      <div className="h-24"></div>
    </div>
  );
}

export default App;