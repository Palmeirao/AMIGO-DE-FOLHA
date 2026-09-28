import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';

interface BreathingExerciseProps {
  onComplete: () => void;
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onComplete,
  onClose,
}) => {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Transition between phases
        if (phase === 'inhale') {
          setPhase('hold');
          sounds.playNote(523.25, 0.4, 0.08); // C5
          return 4;
        } else if (phase === 'hold') {
          setPhase('exhale');
          sounds.playNote(440, 0.4, 0.08); // A4
          return 4;
        } else {
          // exhale finished
          setPhase('inhale');
          sounds.playNote(392, 0.4, 0.08); // G4
          setCyclesCompleted((c) => {
            const nextCount = c + 1;
            if (nextCount >= 3) {
              sounds.playSparkle();
              onComplete();
            }
            return nextCount;
          });
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-gradient-to-b from-indigo-900 to-purple-950 rounded-3xl w-full max-w-sm p-6 text-white text-center shadow-2xl border border-indigo-500/30 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Ciclo {Math.min(3, cyclesCompleted + 1)} de 3
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <h3 className="text-xl font-bold font-heading mb-1 text-purple-100">
          Respiração da Folhinha 🍃
        </h3>
        <p className="text-xs text-purple-200 mb-6">
          Acalme o coração e sinta o perfume da lavanda antes de dormir
        </p>

        {/* Dynamic Expanding/Contracting Breathing Ring */}
        <div className="relative w-52 h-52 flex items-center justify-center my-4">
          {/* Outer glow ring */}
          <div
            className={`absolute inset-0 rounded-full bg-purple-500/20 blur-xl transition-all duration-1000 ease-in-out ${
              phase === 'inhale' ? 'scale-125' : phase === 'hold' ? 'scale-125 opacity-70' : 'scale-90'
            }`}
          />

          {/* Animated Circle */}
          <div
            className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl transition-all duration-[3900ms] ease-in-out ${
              phase === 'inhale'
                ? 'scale-115 border-purple-300 bg-gradient-to-tr from-purple-600/60 to-indigo-500/60 shadow-purple-500/50'
                : phase === 'hold'
                ? 'scale-115 border-emerald-300 bg-gradient-to-tr from-indigo-600/70 to-purple-500/70'
                : 'scale-75 border-indigo-400 bg-gradient-to-tr from-purple-900/60 to-slate-900/60'
            }`}
          >
            <span className="text-4xl mb-1">
              {phase === 'inhale' ? '🌸' : phase === 'hold' ? '🪻' : '🌙'}
            </span>
            <span className="text-base font-bold tracking-wide">
              {phase === 'inhale' && 'Cheire a Florzinha'}
              {phase === 'hold' && 'Segure o Perfume'}
              {phase === 'exhale' && 'Sopre a Velinha'}
            </span>
            <span className="text-3xl font-extrabold font-mono mt-1 text-yellow-300">
              {countdown}
            </span>
          </div>
        </div>

        <p className="text-xs text-purple-300 mt-4 leading-relaxed">
          {phase === 'inhale' && 'Inspire devagarinho pelo nariz, enchendo o peito de ar fresco...'}
          {phase === 'hold' && 'Mantenha o ar quentinho no peito, sentindo a paz da noite...'}
          {phase === 'exhale' && 'Solte o ar bem devagar pela boca, relaxando cada músculo...'}
        </p>

        {cyclesCompleted >= 3 && (
          <div className="mt-4 p-3 bg-emerald-500/30 border border-emerald-400 rounded-2xl w-full">
            <p className="text-xs font-bold text-emerald-200">
              ✨ Muito bem! Seu coração está calmo e em paz.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Voltar ao Amigo de Folha
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
