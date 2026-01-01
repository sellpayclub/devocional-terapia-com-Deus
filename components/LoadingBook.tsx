import React from 'react';

export const LoadingBook: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-6 fade-in">
      <div className="relative w-16 h-16 mb-4">
        <svg className="animate-spin text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 className="font-serif text-xl text-ink mb-2">Preparando seu coração...</h3>
      <p className="font-sans text-warmGray text-sm">"Aquietai-vos e sabei que eu sou Deus."</p>
    </div>
  );
};