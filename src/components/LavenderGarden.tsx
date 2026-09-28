import React, { useState } from 'react';
import { PlantStats } from '../types';
import { sounds } from '../utils/audio';

interface LavenderGardenProps {
  plant: PlantStats;
  nivel: number;
  onWater: () => void;
  onToggleSun: () => void;
  onHarvest: () => void;
}

export const LavenderGarden: React.FC<LavenderGardenProps> = ({
  plant,
  nivel,
  onWater,
  onToggleSun,
  onHarvest,
}) => {
  const [isWateringAnim, setIsWateringAnim] = useState(false);
  const isLocked = nivel < 2;

  const handleWaterClick = () => {
    setIsWateringAnim(true);
    sounds.playWaterDrop();
    onWater();
    setTimeout(() => setIsWateringAnim(false), 800);
  };

  const handleSunClick = () => {
    sounds.playClick();
    onToggleSun();
  };

  const handleHarvestClick = () => {
    sounds.playSparkle();
    onHarvest();
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-purple-200/60 shadow-sm text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
          🔒🌱
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 font-heading">
          Jardim de Lavanda Bloqueado
        </h3>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Cuide com carinho do seu Amigo de Folha e alcance o <span className="font-bold text-purple-700">Nível 2</span> para desbloquear o vasinho e cultivar suas próprias flores de lavanda aromáticas!
        </p>
        <div className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
          Nível atual: {nivel} / 2
        </div>
      </div>
    );
  }

  const isHarvestReady = plant.estagio === 'florida' && plant.progresso >= 100;

  return (
    <div className="flex flex-col items-center justify-center max-w-lg mx-auto w-full px-4">
      {/* Title & Stage Banner */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-purple-900 font-heading flex items-center justify-center gap-2">
          <span>Meu Vasinho de Lavanda</span>
          <span className="text-xl">🪻</span>
        </h2>
        <p className="text-xs text-slate-600">
          Cultive com água fresca e luz suave para colher sachês aromáticos relaxantes
        </p>
      </div>

      {/* Main Pot & Plant Illustration */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Sun Glow Effect if active */}
        {plant.sol > 50 && (
          <div className="absolute top-0 right-4 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none animate-pulse" />
        )}

        {/* Water drops animation */}
        {isWateringAnim && (
          <div className="absolute inset-x-0 top-6 flex justify-center gap-3 z-30 pointer-events-none">
            <span className="text-2xl animate-bounce" style={{ animationDuration: '0.4s' }}>💧</span>
            <span className="text-xl animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}>💧</span>
            <span className="text-2xl animate-bounce" style={{ animationDuration: '0.45s', animationDelay: '0.2s' }}>💧</span>
          </div>
        )}

        {/* SVG Plant Render */}
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            {/* Clay pot gradient */}
            <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="50%" stopColor="#fba94b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Earth soil gradient */}
            <radialGradient id="soilGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5c381c" />
              <stop offset="100%" stopColor="#3d210f" />
            </radialGradient>

            {/* Lavender stem gradient */}
            <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            {/* Lavender flower color */}
            <radialGradient id="flowerGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </radialGradient>
          </defs>

          {/* Plant Growth Stages */}
          {plant.estagio === 'semente' && (
            // Stage 1: Little Sprout (Broto)
            <g className="animate-breathe origin-bottom">
              {/* Little baby stem */}
              <path d="M 120 155 Q 118 135 120 120" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Left small leaf */}
              <path d="M 120 135 Q 106 130 110 120 Q 120 126 120 135 Z" fill="#22c55e" />
              {/* Right small leaf */}
              <path d="M 120 126 Q 134 122 130 112 Q 120 118 120 126 Z" fill="#4ade80" />
              {/* Dew drop */}
              <circle cx="112" cy="122" r="2.5" fill="#bae6fd" opacity="0.8" />
            </g>
          )}

          {plant.estagio === 'crescimento' && (
            // Stage 2: Growing Bush with early lavender buds
            <g className="animate-gentle-float origin-bottom">
              {/* Central stem */}
              <path d="M 120 155 Q 118 115 120 85" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Left Branch */}
              <path d="M 120 135 Q 100 120 95 95" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Right Branch */}
              <path d="M 120 125 Q 140 115 145 92" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Foliage Leaves */}
              <path d="M 118 140 Q 98 142 102 132 Q 116 135 118 140 Z" fill="#4ade80" />
              <path d="M 122 130 Q 142 132 138 122 Q 124 125 122 130 Z" fill="#22c55e" />
              <path d="M 119 110 Q 102 108 106 100 Q 118 104 119 110 Z" fill="#86efac" />
              <path d="M 121 100 Q 138 98 134 90 Q 122 94 121 100 Z" fill="#4ade80" />

              {/* Small early lavender flower buds */}
              <g>
                <circle cx="120" cy="82" r="5" fill="#c084fc" />
                <circle cx="120" cy="74" r="4.5" fill="#a855f7" />
                <circle cx="95" cy="92" r="4.5" fill="#c084fc" />
                <circle cx="145" cy="89" r="4.5" fill="#c084fc" />
              </g>
            </g>
          )}

          {plant.estagio === 'florida' && (
            // Stage 3: Fully Bloomed Lush Lavender with Spikes
            <g className="origin-bottom">
              {/* Ambient Aroma particles floating from flowers */}
              <g className="animate-pulse">
                <circle cx="90" cy="40" r="3" fill="#e9d5ff" opacity="0.6" />
                <circle cx="120" cy="20" r="4" fill="#d8b4fe" opacity="0.7" />
                <circle cx="150" cy="35" r="3.5" fill="#e9d5ff" opacity="0.6" />
              </g>

              {/* Central Lavender Spike */}
              <path d="M 120 155 L 120 60" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
              {/* Stems Fan */}
              <path d="M 120 150 Q 100 115 88 68" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 120 150 Q 140 115 152 68" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 120 152 Q 78 125 68 85" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
              <path d="M 120 152 Q 162 125 172 85" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />

              {/* Lavender Leaves along base */}
              <path d="M 118 142 Q 95 146 100 134 Q 115 137 118 142 Z" fill="#22c55e" />
              <path d="M 122 138 Q 145 142 140 130 Q 125 133 122 138 Z" fill="#16a34a" />
              <path d="M 119 122 Q 88 126 94 116 Q 115 119 119 122 Z" fill="#4ade80" />
              <path d="M 121 118 Q 152 122 146 112 Q 125 115 121 118 Z" fill="#22c55e" />

              {/* Flower Spike Clusters (Lavandula Angustifolia) */}
              {/* Central Flower */}
              <g className="filter drop-shadow-sm">
                <circle cx="120" cy="56" r="6" fill="url(#flowerGrad)" />
                <circle cx="115" cy="50" r="5.5" fill="url(#flowerGrad)" />
                <circle cx="125" cy="50" r="5.5" fill="url(#flowerGrad)" />
                <circle cx="116" cy="42" r="5" fill="url(#flowerGrad)" />
                <circle cx="124" cy="42" r="5" fill="url(#flowerGrad)" />
                <circle cx="120" cy="35" r="4.5" fill="url(#flowerGrad)" />
                <circle cx="120" cy="28" r="4" fill="#f3e8ff" />
              </g>

              {/* Left Main Spike */}
              <g>
                <circle cx="88" cy="65" r="5.5" fill="url(#flowerGrad)" />
                <circle cx="84" cy="58" r="5" fill="url(#flowerGrad)" />
                <circle cx="92" cy="58" r="5" fill="url(#flowerGrad)" />
                <circle cx="86" cy="50" r="4.5" fill="url(#flowerGrad)" />
                <circle cx="91" cy="50" r="4.5" fill="url(#flowerGrad)" />
                <circle cx="88" cy="43" r="4" fill="#f3e8ff" />
              </g>

              {/* Right Main Spike */}
              <g>
                <circle cx="152" cy="65" r="5.5" fill="url(#flowerGrad)" />
                <circle cx="148" cy="58" r="5" fill="url(#flowerGrad)" />
                <circle cx="156" cy="58" r="5" fill="url(#flowerGrad)" />
                <circle cx="150" cy="50" r="4.5" fill="url(#flowerGrad)" />
                <circle cx="155" cy="50" r="4.5" fill="url(#flowerGrad)" />
                <circle cx="153" cy="43" r="4" fill="#f3e8ff" />
              </g>

              {/* Outer Left & Right buds */}
              <g>
                <circle cx="68" cy="80" r="4.5" fill="url(#flowerGrad)" />
                <circle cx="67" cy="73" r="4" fill="url(#flowerGrad)" />
                <circle cx="172" cy="80" r="4.5" fill="url(#flowerGrad)" />
                <circle cx="173" cy="73" r="4" fill="url(#flowerGrad)" />
              </g>
            </g>
          )}

          {/* Clay Pot (Vaso de Cerâmica) */}
          <g>
            {/* Soil mound */}
            <ellipse cx="120" cy="155" rx="55" ry="16" fill="url(#soilGrad)" />
            {/* Soil texture pebbles */}
            <circle cx="105" cy="154" r="2" fill="#78350f" />
            <circle cx="132" cy="156" r="2.5" fill="#78350f" />
            <circle cx="120" cy="158" r="1.8" fill="#a16207" />

            {/* Pot Rim */}
            <path
              d="M 60 152 Q 120 160 180 152 L 180 166 Q 120 174 60 166 Z"
              fill="url(#potGrad)"
              stroke="#9a3412"
              strokeWidth="2"
            />

            {/* Pot Body */}
            <path
              d="M 68 166 Q 120 174 172 166 L 156 220 Q 120 226 84 220 Z"
              fill="url(#potGrad)"
              stroke="#9a3412"
              strokeWidth="2"
            />

            {/* Pot Cute Heart Emblem */}
            <circle cx="120" cy="192" r="14" fill="#ffedd5" stroke="#ea580c" strokeWidth="1" />
            <text x="120" y="196" textAnchor="middle" fontSize="12" fill="#9333ea">🪻</text>

            {/* Pot Bottom Plate */}
            <ellipse cx="120" cy="222" rx="42" ry="6" fill="#c2410c" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Growth Progress Indicator */}
      <div className="w-full max-w-xs bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-purple-200 shadow-sm mt-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
          <span>Evolução da Lavanda</span>
          <span className="text-purple-700 font-bold capitalize">
            {plant.estagio === 'semente' && 'Brotinho 🌱'}
            {plant.estagio === 'crescimento' && 'Crescendo 🌿'}
            {plant.estagio === 'florida' && 'Flor Perfumada 🪻'}
          </span>
        </div>
        <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-purple-400 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(8, plant.progresso))}%` }}
          />
        </div>
      </div>

      {/* Status Bars: Umidade & Luz Solar */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-3">
        {/* Regar / Umidade */}
        <div className="bg-white/80 rounded-2xl p-2.5 border border-sky-100 flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs font-bold text-sky-700 mb-1">
            <span>💧 Umidade</span>
            <span className="text-slate-500 font-mono">{Math.round(plant.umidade)}%</span>
          </div>
          <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${plant.umidade}%` }}
            />
          </div>
          <button
            onClick={handleWaterClick}
            className="w-full py-1.5 px-3 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>🚿 Regar</span>
          </button>
        </div>

        {/* Luz Solar */}
        <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-100 flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mb-1">
            <span>☀️ Luz Solar</span>
            <span className="text-slate-500 font-mono">{Math.round(plant.sol)}%</span>
          </div>
          <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${plant.sol}%` }}
            />
          </div>
          <button
            onClick={handleSunClick}
            className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
              plant.sol > 50
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
          >
            <span>{plant.sol > 50 ? '☀️ Iluminada' : '⛅ Dar Solzinho'}</span>
          </button>
        </div>
      </div>

      {/* Harvest Action Button when ready */}
      {isHarvestReady && (
        <div className="mt-4 w-full max-w-xs animate-bounce">
          <button
            onClick={handleHarvestClick}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-300/50 flex items-center justify-center gap-2 transform active:scale-95 transition"
          >
            <span className="text-lg">🪻</span>
            <span>Colher Flores de Lavanda!</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">+2 Sachês</span>
          </button>
        </div>
      )}

      {/* Care Tip for kids */}
      <div className="mt-4 text-center max-w-xs">
        <p className="text-[11px] text-slate-500 bg-purple-50/80 px-3 py-1.5 rounded-xl border border-purple-100">
          🌿 Dica do Guardião: Mantenha a umidade e a luz solar equilibradas para a lavanda florescer mais rápido!
        </p>
      </div>
    </div>
  );
};
