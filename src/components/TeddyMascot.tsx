import React, { useState, useEffect } from 'react';
import { TeddyStats } from '../types';
import { sounds } from '../utils/audio';

interface TeddyMascotProps {
  stats: TeddyStats;
  isSleeping: boolean;
  hasAromaActive: boolean;
  onPet: () => void;
  onPocketClick: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
}

export const TeddyMascot: React.FC<TeddyMascotProps> = ({
  stats,
  isSleeping,
  hasAromaActive,
  onPet,
  onPocketClick,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPetting, setIsPetting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bounceAction, setBounceAction] = useState(false);

  // Natural blinking effect
  useEffect(() => {
    if (isSleeping) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isSleeping]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPetting(true);
    setBounceAction(true);
    setTimeout(() => setBounceAction(false), 400);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addParticle(x, y, ['💖', '✨', '🌸', '💜'][Math.floor(Math.random() * 4)], '#d8b4fe');
    sounds.playPurrGiggle();
    onPet();
  };

  const handlePointerUp = () => {
    setIsPetting(false);
  };

  const addParticle = (x: number, y: number, symbol: string, color: string) => {
    const id = Date.now() + Math.random();
    setParticles((prev) => [...prev.slice(-10), { id, x, y, symbol, color }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1100);
  };

  const isSleepy = stats.energia < 30;
  const isHappy = stats.felicidade > 65;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      title="Faça carinho no Amigo de Folha!"
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute text-xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{
              left: `${p.x}px`,
              top: `${p.y - 30}px`,
              opacity: 0.9,
              animation: 'waftAroma 1.1s forwards ease-out',
            }}
          >
            {p.symbol}
          </div>
        ))}
      </div>

      {/* Sleep Zzz Floating Animation */}
      {isSleeping && (
        <div className="absolute -top-6 right-8 pointer-events-none z-20 flex flex-col items-end">
          <span className="text-xl font-bold text-indigo-300 animate-sleep-z" style={{ animationDelay: '0s' }}>z</span>
          <span className="text-2xl font-bold text-purple-300 animate-sleep-z" style={{ animationDelay: '0.8s' }}>Z</span>
          <span className="text-3xl font-bold text-lavender-200 animate-sleep-z" style={{ animationDelay: '1.6s' }}>Z</span>
        </div>
      )}

      {/* Aroma Aura Waves when pouch has lavender */}
      {hasAromaActive && (
        <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-t from-purple-400/15 via-indigo-300/10 to-transparent blur-xl pointer-events-none animate-pulse" />
      )}

      {/* SVG Mascot Character */}
      <div
        className={`w-56 h-56 sm:w-64 sm:h-64 transition-transform duration-300 ${
          bounceAction ? 'scale-105 -translate-y-2' : ''
        } ${isSleeping ? 'animate-breathe' : 'animate-gentle-float'}`}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl overflow-visible">
          <defs>
            {/* Fur gradient */}
            <radialGradient id="teddyBody" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#edd8b7" />
              <stop offset="60%" stopColor="#dfbe91" />
              <stop offset="100%" stopColor="#cca16e" />
            </radialGradient>

            {/* Inner Ear / Snout Gradient */}
            <radialGradient id="teddyInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fdf3e7" />
              <stop offset="100%" stopColor="#f5ddc3" />
            </radialGradient>

            {/* Lavender Aroma Pouch Gradient */}
            <linearGradient id="pocketGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Cozy Blanket Gradient */}
            <linearGradient id="blanketGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>

            {/* Nightcap gradient */}
            <linearGradient id="nightCapGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Ears */}
          {/* Left Ear */}
          <g className={`transition-transform origin-[60px_60px] ${isPetting ? '-rotate-6' : ''}`}>
            <circle cx="62" cy="62" r="30" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2.5" />
            <circle cx="62" cy="62" r="18" fill="url(#teddyInner)" />
            {/* Ear leaf accent */}
            <path d="M 46 45 Q 60 38 64 52 Q 52 56 46 45 Z" fill="#86efac" opacity="0.85" />
          </g>

          {/* Right Ear */}
          <g className={`transition-transform origin-[178px_60px] ${isPetting ? 'rotate-6' : ''}`}>
            <circle cx="178" cy="62" r="30" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2.5" />
            <circle cx="178" cy="62" r="18" fill="url(#teddyInner)" />
            {/* Ear lavender blossom accent */}
            <circle cx="186" cy="46" r="5" fill="#c084fc" />
            <circle cx="192" cy="51" r="4.5" fill="#d8b4fe" />
            <circle cx="182" cy="53" r="4.5" fill="#a855f7" />
          </g>

          {/* Body */}
          <ellipse cx="120" cy="165" rx="66" ry="62" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2.5" />

          {/* Feet/Paws Bottom */}
          <ellipse cx="78" cy="216" rx="20" ry="14" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2" />
          <ellipse cx="78" cy="215" rx="11" ry="8" fill="url(#teddyInner)" />
          <ellipse cx="162" cy="216" rx="20" ry="14" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2" />
          <ellipse cx="162" cy="215" rx="11" ry="8" fill="url(#teddyInner)" />

          {/* Lavender Aroma Belly Pouch (Bolsinho do Sachê Aromático) */}
          <g
            className="cursor-pointer group/pocket"
            onClick={(e) => {
              e.stopPropagation();
              onPocketClick();
            }}
          >
            <title>Bolsinho de Lavanda - Clique para colocar ou renovar o sachê perfumado!</title>
            {/* Inner Belly Oval */}
            <ellipse cx="120" cy="168" rx="42" ry="40" fill="url(#teddyInner)" />

            {/* Lavender Pocket Pouch */}
            <path
              d="M 96 156 Q 120 162 144 156 L 142 188 Q 120 200 98 188 Z"
              fill="url(#pocketGrad)"
              stroke="#9333ea"
              strokeWidth="2"
              strokeDasharray="4 2"
              className="filter drop-shadow-sm transition-transform group-hover/pocket:scale-105 origin-[120px_175px]"
            />

            {/* Pocket Stitching & Lavender Sprig Emblem */}
            <path d="M 120 162 L 120 184" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" />
            <circle cx="116" cy="168" r="3" fill="#a855f7" />
            <circle cx="124" cy="170" r="3" fill="#c084fc" />
            <circle cx="117" cy="176" r="2.8" fill="#d8b4fe" />
            <circle cx="123" cy="178" r="2.8" fill="#a855f7" />

            {/* Sachet tag or lavender aroma icon */}
            <text x="120" y="196" textAnchor="middle" fontSize="9" fill="#581c87" fontWeight="bold" fontFamily="Quicksand, sans-serif">
              {hasAromaActive ? '💜 AROMA ON' : '+ SACHÊ'}
            </text>
          </g>

          {/* Arms / Little Paws */}
          <ellipse cx="58" cy="155" rx="16" ry="24" transform="rotate(22 58 155)" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2" />
          <ellipse cx="182" cy="155" rx="16" ry="24" transform="rotate(-22 182 155)" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2" />

          {/* Head */}
          <circle cx="120" cy="105" r="54" fill="url(#teddyBody)" stroke="#9a7143" strokeWidth="2.5" />

          {/* Rosy Cheeks */}
          <ellipse cx="88" cy="116" rx="9" ry="5.5" fill="#fca5a5" opacity="0.65" />
          <ellipse cx="152" cy="116" rx="9" ry="5.5" fill="#fca5a5" opacity="0.65" />

          {/* Snout Muzzle */}
          <ellipse cx="120" cy="118" rx="22" ry="17" fill="url(#teddyInner)" stroke="#bfa383" strokeWidth="1" />

          {/* Cute Nose */}
          <path
            d="M 114 110 Q 120 107 126 110 Q 120 119 114 110 Z"
            fill="#573619"
          />

          {/* Smiling / Giggling Mouth */}
          {isSleeping ? (
            // Peaceful soft curved mouth when sleeping
            <path d="M 115 122 Q 120 125 125 122" stroke="#573619" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : isPetting || isHappy ? (
            // Joyful open giggle smile
            <path
              d="M 112 121 Q 120 132 128 121 Z"
              fill="#ef4444"
              stroke="#573619"
              strokeWidth="1.8"
            />
          ) : isSleepy ? (
            // Yawning mouth when tired
            <ellipse cx="120" cy="124" rx="5" ry="6" fill="#78350f" />
          ) : (
            // Sweet gentle smile
            <path d="M 114 121 Q 120 127 126 121" stroke="#573619" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Eyes Logic */}
          {isSleeping ? (
            // Sleeping closed eyes: cute downward curves
            <g stroke="#573619" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 90 102 Q 98 108 106 102" />
              <path d="M 134 102 Q 142 108 150 102" />
              {/* Eyelashes */}
              <line x1="98" y1="106" x2="98" y2="110" />
              <line x1="142" y1="106" x2="142" y2="110" />
            </g>
          ) : isPetting ? (
            // Happy squinting eyes (^ ^)
            <g stroke="#573619" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 91 104 Q 99 96 107 104" />
              <path d="M 133 104 Q 141 96 149 104" />
            </g>
          ) : isBlinking ? (
            // Mid-blink line
            <g stroke="#573619" strokeWidth="2.5" strokeLinecap="round">
              <line x1="91" y1="101" x2="105" y2="101" />
              <line x1="135" y1="101" x2="149" y2="101" />
            </g>
          ) : (
            // Big shiny animated eyes
            <g>
              {/* Left Eye */}
              <circle cx="98" cy="100" r="7.5" fill="#3b2413" />
              <circle cx="96" cy="98" r="2.8" fill="#ffffff" />
              <circle cx="100" cy="102" r="1.2" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="142" cy="100" r="7.5" fill="#3b2413" />
              <circle cx="140" cy="98" r="2.8" fill="#ffffff" />
              <circle cx="144" cy="102" r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Nightcap Accessory when sleeping */}
          {isSleeping && (
            <g className="animate-pulse">
              <path
                d="M 85 70 Q 120 40 160 62 Q 170 30 185 36 Q 165 20 120 28 Q 80 42 85 70 Z"
                fill="url(#nightCapGrad)"
                stroke="#4338ca"
                strokeWidth="1.5"
              />
              <circle cx="188" cy="38" r="7" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
              {/* White cap brim */}
              <path
                d="M 82 72 Q 120 54 158 66"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Soft Leaf Quilt Blanket when sleeping */}
          {isSleeping && (
            <g>
              <path
                d="M 50 178 Q 120 165 190 178 L 194 225 Q 120 236 46 225 Z"
                fill="url(#blanketGrad)"
                stroke="#059669"
                strokeWidth="2"
                opacity="0.95"
              />
              {/* Leaf veins & pattern on blanket */}
              <path d="M 65 195 Q 120 185 175 195" stroke="#34d399" strokeWidth="1.5" strokeDasharray="6 3" fill="none" />
              <path d="M 60 210 Q 120 200 180 210" stroke="#34d399" strokeWidth="1.5" strokeDasharray="6 3" fill="none" />
              {/* Blanket top cuff */}
              <ellipse cx="120" cy="174" rx="70" ry="7" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </div>

      {/* Under-shadow */}
      <div className="w-40 sm:w-48 h-4 bg-slate-900/20 rounded-full blur-md -mt-2 pointer-events-none" />

      {/* Floating Status Mood Hint */}
      <div className="mt-3 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-purple-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
        {isSleeping ? (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Dormindo serenamente... nanando bem 🌙</span>
          </>
        ) : isPetting ? (
          <>
            <span className="text-pink-500 animate-bounce">❤️</span>
            <span className="text-pink-600 font-bold">Adorando seu carinho!</span>
          </>
        ) : hasAromaActive ? (
          <>
            <span className="text-purple-600">🪻</span>
            <span>Respirando aroma calmante de lavanda</span>
          </>
        ) : isSleepy ? (
          <>
            <span className="text-amber-500">🥱</span>
            <span>Com soninho... Hora de nanar!</span>
          </>
        ) : isHappy ? (
          <>
            <span className="text-emerald-500">✨</span>
            <span>Feliz e descansado! Prontinho para brincar</span>
          </>
        ) : (
          <>
            <span className="text-purple-500">🍃</span>
            <span>Toque para fazer carinho no Amigo de Folha</span>
          </>
        )}
      </div>
    </div>
  );
};
