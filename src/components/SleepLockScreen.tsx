import React, { useState } from 'react';
import { sounds } from '../utils/audio';

interface SleepLockScreenProps {
  pin: string;
  onUnlock: () => void;
}

export const SleepLockScreen: React.FC<SleepLockScreenProps> = ({ pin, onUnlock }) => {
  const [showPinInput, setShowPinInput] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);

  const handleUnlockAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === pin) {
      sounds.playSparkle();
      onUnlock();
    } else {
      setError(true);
      setEnteredPin('');
      sounds.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0a1a] flex flex-col items-center justify-center p-6 text-center text-purple-100 select-none overflow-hidden">
      {/* Background Starry Sky */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-12 text-yellow-200 animate-twinkle">✦</div>
        <div className="absolute top-24 right-16 text-yellow-100 animate-twinkle" style={{ animationDelay: '1s' }}>★</div>
        <div className="absolute top-40 left-1/3 text-purple-300 animate-twinkle" style={{ animationDelay: '1.5s' }}>✦</div>
        <div className="absolute bottom-24 left-16 text-yellow-200 animate-twinkle" style={{ animationDelay: '0.5s' }}>★</div>
        <div className="absolute bottom-32 right-20 text-purple-200 animate-twinkle" style={{ animationDelay: '2s' }}>✦</div>
      </div>

      {/* Crescent Moon & Cloud SVG */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full bg-amber-200/20 blur-2xl absolute inset-0" />
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(253,230,138,0.5)]">
          <path
            d="M 60 15 A 35 35 0 1 0 85 75 A 40 40 0 0 1 60 15 Z"
            fill="#fef08a"
          />
          {/* Sleeping face on moon */}
          <path d="M 52 48 Q 57 52 62 48" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="66" cy="56" r="3.5" fill="#fca5a5" opacity="0.6" />
        </svg>
      </div>

      {/* Sleeping Mascot Graphic */}
      <div className="w-32 h-32 mb-4 bg-purple-950/40 rounded-full border border-purple-800/40 flex items-center justify-center shadow-inner">
        <span className="text-5xl animate-breathe">🧸💤</span>
      </div>

      {/* Warm Bedtime Message */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-100 font-heading mb-3 max-w-sm">
        Hora do Descanso! 🌙
      </h1>
      <p className="text-sm sm:text-base text-purple-300 max-w-md leading-relaxed mb-6 font-medium">
        "O Amigo de Folha também precisa descansar! Hora de desligar a tela, fechar os olhinhos e dormir bem."
      </p>

      <div className="text-xs text-purple-400/80 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/20 mb-8">
        ✨ Amanhã tem mais carinho, lavandas perfumadas e brincadeiras!
      </div>

      {/* Discreet Parents Unlock */}
      {!showPinInput ? (
        <button
          onClick={() => setShowPinInput(true)}
          className="text-xs text-purple-400 hover:text-purple-200 underline tracking-wide opacity-60 hover:opacity-100 transition"
        >
          Área dos Pais (Desbloquear)
        </button>
      ) : (
        <form onSubmit={handleUnlockAttempt} className="flex flex-col items-center gap-2 p-3 bg-purple-950/60 rounded-2xl border border-purple-800/60">
          <span className="text-xs text-purple-300">Digite o PIN para liberar:</span>
          <div className="flex gap-2">
            <input
              type="password"
              maxLength={4}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
              placeholder="PIN"
              autoFocus
              className="w-24 text-center tracking-widest text-lg font-mono bg-purple-900/80 border border-purple-600 rounded-xl text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
            >
              Liberar
            </button>
          </div>
          {error && <span className="text-[11px] text-rose-400">PIN incorreto</span>}
          <button
            type="button"
            onClick={() => setShowPinInput(false)}
            className="text-[11px] text-purple-400 hover:text-purple-200 mt-1"
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};
