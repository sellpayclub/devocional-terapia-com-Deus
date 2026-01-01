import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, PenLine, ChevronRight, Share2, ArrowLeft, Sun, Copy, Home, RefreshCw, ExternalLink } from 'lucide-react';
import { DevotionalContent, AppView, TOPICS_LIST, Note } from './types';
import { generateDevotional } from './services/geminiService';
import { getDailyDevotional, saveDailyDevotional, saveNote, getNotes, deleteNote } from './services/storageService';
import { LoadingBook } from './components/LoadingBook';
import { NotificationRequest } from './components/NotificationRequest';

function App() {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [currentDevotional, setCurrentDevotional] = useState<DevotionalContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

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

  const loadDaily = async (forceRefresh = false) => {
    setActiveTopic(null);
    const cached = getDailyDevotional();
    
    // Se existe cache e não estamos forçando, usa o cache.
    // IMPORTANTE: Se o cache for um "Fallback" antigo (erro salvo incorretamente), ignoramos e tentamos de novo.
    if (cached && !forceRefresh && !cached.isFallback) {
      setCurrentDevotional(cached);
      setLoading(false);
    } else {
      setLoading(true);
      setCurrentDevotional(null); // Limpa para garantir que o Spinner apareça
      
      // Gera conteúdo novo
      const fresh = await generateDevotional();
      
      // Só salva no localStorage se for SUCESSO.
      // Se for erro (fallback), não salvamos, permitindo que o usuário tente de novo infinitamente.
      if (!fresh.isFallback) {
        saveDailyDevotional(fresh);
      }
      
      setCurrentDevotional(fresh);
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
        
        <h1 className="font-serif text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-500 font-black drop-shadow-xl tracking-tight mb-4" style={{textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>
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
          <p className="text-[10px] text-warmGray mt-1 tracking-wide opacity-0 hover:opacity-100 transition-opacity">Toque para ler o contexto</p>
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

  // Se estiver na Landing, renderiza sem navegação
  if (view === AppView.LANDING) {
    return renderLandingView();
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
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-goldLight pb-safe pt-2 px-6 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
            <button 
                onClick={() => {
                    setView(AppView.DAILY);
                    // Importante: Se clicar em "Leitura", tenta carregar o dia atual do cache se não estiver forçando
                    if(!activeTopic) loadDaily(); 
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
        </div>
      </nav>
      
      {/* Safe area spacer */}
      <div className="h-24"></div>
    </div>
  );
}

export default App;