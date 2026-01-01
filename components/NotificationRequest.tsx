import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { STORAGE_KEYS } from '../constants';

export const NotificationRequest: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) return;
    const hasRequested = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    if (Notification.permission === 'default' && !hasRequested) {
      setShow(true);
    }
  }, []);

  const handleEnable = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification("Devocional: Terapia com Deus", {
        body: "Notificações ativadas! Enviaremos uma palavra de paz pela manhã.",
        icon: "https://picsum.photos/192/192"
      });
    }
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 p-4">
      <div className="bg-white/95 backdrop-blur shadow-lg border-l-4 border-gold rounded-lg p-4 flex items-start gap-4 animate-slideDown">
        <div className="bg-orange-100 p-2 rounded-full text-amber-600">
          <Bell size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-serif font-bold text-ink">Receber versículo do dia?</h4>
          <p className="text-sm text-warmGray mt-1">Gostaria de receber uma notificação diária pela manhã?</p>
          <div className="mt-3 flex gap-3">
            <button 
              onClick={handleEnable}
              className="bg-gold text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              Sim, ativar
            </button>
            <button 
              onClick={() => {
                 localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
                 setShow(false);
              }}
              className="text-warmGray text-sm px-2 py-1.5 hover:text-ink"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};