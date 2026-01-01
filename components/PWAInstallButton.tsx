import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        if (isStandalone) {
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

        // For iOS, show button if not standalone (native prompt not supported, but we show instructions)
        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            setIsVisible(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    if (!isVisible && !showIOSInstructions) return null;

    return (
        <>
            {isVisible && (
                <button
                    onClick={handleInstallClick}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-accent text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in-up hover:scale-105 transition-transform duration-200"
                    style={{ boxShadow: '0 4px 14px rgba(166, 93, 87, 0.4)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="font-semibold font-sans whitespace-nowrap">Baixar Aplicativo</span>
                </button>
            )}

            {showIOSInstructions && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-end justify-center pb-safe p-4 animate-fade-in" onClick={() => setShowIOSInstructions(false)}>
                    <div
                        className="bg-paper p-6 rounded-t-2xl md:rounded-2xl max-w-sm w-full shadow-2xl relative animate-slide-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setShowIOSInstructions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-xl font-serif font-bold text-ink mb-3 pr-8">Instalar no iPhone</h3>
                        <p className="text-gray-600 mb-5 text-sm leading-relaxed">Siga os passos abaixo para instalar o app na sua tela de início:</p>
                        <ol className="space-y-4 text-sm text-ink font-medium">
                            <li className="flex items-start gap-3">
                                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                                <span>Toque no botão <span className="inline-flex align-middle mx-1 text-[#007AFF]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg></span> (Compartilhar) na barra inferior do Safari.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                                <span>Role para baixo e toque em <span className="font-bold">"Adicionar à Tela de Início"</span>.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                                <span>Confirme clicando em <span className="font-bold text-[#007AFF]">"Adicionar"</span> no canto superior direito.</span>
                            </li>
                        </ol>
                        <div className="mt-6 text-center">
                            <button onClick={() => setShowIOSInstructions(false)} className="text-accent text-sm font-semibold hover:underline">
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
