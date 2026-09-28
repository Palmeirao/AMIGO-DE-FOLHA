/**
 * Amigo de Folha — O Guardião do Sono
 * Single Page Application de Mascote Virtual Terapêutico Infantil
 */

import React, { useState, useEffect, useRef } from 'react';
import { TeddyStats, PlantStats, Inventory, RoutineTask, ParentSettings } from './types';
import { TeddyMascot } from './components/TeddyMascot';
import { LavenderGarden } from './components/LavenderGarden';
import { ParentsPanel } from './components/ParentsPanel';
import { KidsTasksModal } from './components/KidsTasksModal';
import { BreathingExercise } from './components/BreathingExercise';
import { BedtimeStoriesModal } from './components/BedtimeStoriesModal';
import { SleepLockScreen } from './components/SleepLockScreen';
import { INITIAL_TASKS, LEVEL_NAMES } from './utils/constants';
import { sounds } from './utils/audio';

const STORAGE_KEY = 'amigo_de_folha_save_v1';

export default function App() {
  // 1. Teddy Stats State
  const [teddyStats, setTeddyStats] = useState<TeddyStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_teddy');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return { energia: 85, felicidade: 90, calma: 80 };
  });

  // 2. Plant Stats State
  const [plantStats, setPlantStats] = useState<PlantStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_plant');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return {
      unlocked: false,
      umidade: 60,
      sol: 60,
      estagio: 'semente',
      progresso: 15,
      gotasHoje: 0,
    };
  });

  // 3. Inventory & Progression
  const [inventory, setInventory] = useState<Inventory>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_inv');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return {
      sachesLavanda: 3,
      folhinhas: 50,
      floresColhidas: 0,
      xp: 0,
      nivel: 1,
    };
  });

  // 4. Daily Routine Tasks
  const [tasks, setTasks] = useState<RoutineTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return INITIAL_TASKS;
  });

  // 5. Parent Settings
  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_parent');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return {
      pin: '1234',
      screenTimeLimitSeconds: 20 * 60,
      screenTimeEnabled: false,
      timerVisibleToKid: true,
      tempoRestante: 20 * 60,
      bloqueadoPorTempo: false,
    };
  });

  // Game UI Modes & Modals
  const [activeTab, setActiveTab] = useState<'teddy' | 'garden'>('teddy');
  const [isSleeping, setIsSleeping] = useState(false);
  const [hasAromaActive, setHasAromaActive] = useState(true);
  const [aromaRemainingSeconds, setAromaRemainingSeconds] = useState(300);

  // Modals
  const [showParentsModal, setShowParentsModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [showStoriesModal, setShowStoriesModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_teddy', JSON.stringify(teddyStats));
  }, [teddyStats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_plant', JSON.stringify(plantStats));
  }, [plantStats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_inv', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_parent', JSON.stringify(parentSettings));
  }, [parentSettings]);

  // Audio mute sync
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  // Add XP and handle leveling
  const addXP = (amount: number) => {
    setInventory((prev) => {
      const nextXP = prev.xp + amount;
      const xpNeeded = prev.nivel * 100;
      if (nextXP >= xpNeeded) {
        const nextLevel = prev.nivel + 1;
        sounds.playSparkle();
        showToast(`✨ Parabéns! Você alcançou o Nível ${nextLevel}: ${LEVEL_NAMES[nextLevel] || 'Guardião Lendário'}!`);

        // Unlock plant at level 2
        if (nextLevel >= 2) {
          setPlantStats((p) => ({ ...p, unlocked: true }));
        }

        return {
          ...prev,
          xp: nextXP - xpNeeded,
          nivel: nextLevel,
          folhinhas: prev.folhinhas + 30,
        };
      }
      return { ...prev, xp: nextXP };
    });
  };

  // Main Game Tick Loop (1 second intervals)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Screen Time Countdown
      if (parentSettings.screenTimeEnabled && !parentSettings.bloqueadoPorTempo) {
        setParentSettings((prev) => {
          if (prev.tempoRestante <= 1) {
            sounds.startAmbientSleep();
            return {
              ...prev,
              tempoRestante: 0,
              bloqueadoPorTempo: true,
            };
          }
          return {
            ...prev,
            tempoRestante: prev.tempoRestante - 1,
          };
        });
      }

      // 2. Teddy Stats Updates
      setTeddyStats((prev) => {
        if (isSleeping) {
          // Recharging energy while sleeping
          const nextEnergy = Math.min(100, prev.energia + 0.35);
          const nextCalm = Math.min(100, prev.calma + 0.1);
          return { ...prev, energia: nextEnergy, calma: nextCalm };
        } else {
          // Normal waking decay
          const energyDecay = 0.04;
          const happyDecay = 0.05;
          const calmDecay = hasAromaActive ? 0.02 : 0.08;

          return {
            energia: Math.max(5, prev.energia - energyDecay),
            felicidade: Math.max(5, prev.felicidade - happyDecay),
            calma: Math.max(5, prev.calma - calmDecay),
          };
        }
      });

      // 3. Aroma Sachet countdown
      if (hasAromaActive) {
        setAromaRemainingSeconds((sec) => {
          if (sec <= 1) {
            setHasAromaActive(false);
            return 0;
          }
          return sec - 1;
        });
      }

      // 4. Plant Growth Tick
      if (inventory.nivel >= 2) {
        setPlantStats((prev) => {
          // Natural slight decay of moisture and sun
          const nextUmidade = Math.max(0, prev.umidade - 0.04);
          const nextSol = Math.max(0, prev.sol - 0.03);

          // Growth speeds up if moisture & sun are balanced (30% to 90%)
          const isWellCared = nextUmidade >= 30 && nextSol >= 30;
          let nextProgresso = prev.progresso;
          let nextEstagio = prev.estagio;

          if (isWellCared && prev.progresso < 100) {
            nextProgresso = Math.min(100, prev.progresso + 0.2);

            if (nextProgresso >= 40 && prev.estagio === 'semente') {
              nextEstagio = 'crescimento';
            }
            if (nextProgresso >= 95 && prev.estagio === 'crescimento') {
              nextEstagio = 'florida';
            }
          }

          return {
            ...prev,
            umidade: nextUmidade,
            sol: nextSol,
            progresso: nextProgresso,
            estagio: nextEstagio,
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSleeping, hasAromaActive, parentSettings.screenTimeEnabled, parentSettings.bloqueadoPorTempo, inventory.nivel]);

  // Action: Pet Teddy
  const handlePetTeddy = () => {
    setTeddyStats((prev) => ({
      ...prev,
      felicidade: Math.min(100, prev.felicidade + 8),
      calma: Math.min(100, prev.calma + 4),
    }));
    addXP(5);
  };

  // Action: Insert/Renew Lavender Sachet in Pocket
  const handleUseAromaPocket = () => {
    if (inventory.sachesLavanda > 0) {
      setInventory((prev) => ({ ...prev, sachesLavanda: prev.sachesLavanda - 1 }));
      setHasAromaActive(true);
      setAromaRemainingSeconds(300); // 5 minutes of active aroma
      setTeddyStats((prev) => ({ ...prev, calma: 100 }));
      sounds.playAromaChime();
      addXP(15);
      showToast('🪻 Sachê de lavanda colocado! O aroma calmante relaxa o ursinho.');
    } else {
      sounds.playClick();
      showToast('Você precisa de mais sachês! Cultive lavandas no Jardim para fazer sachês.');
    }
  };

  // Action: Toggle Sleep / Bedtime
  const handleToggleSleep = () => {
    sounds.playClick();
    if (!isSleeping) {
      setIsSleeping(true);
      sounds.startLullaby();
      sounds.startAmbientSleep();
      addXP(15);
      showToast('🌙 Boa noite, amiguinho! O Ursinho está dormindo e recarregando energias.');
    } else {
      setIsSleeping(false);
      sounds.stopLullaby();
      sounds.stopAmbientSleep();
      showToast('☀️ Bom dia! O Ursinho acordou descansado e feliz.');
    }
  };

  // Action: Water Plant
  const handleWaterPlant = () => {
    setPlantStats((prev) => ({
      ...prev,
      umidade: Math.min(100, prev.umidade + 25),
      progresso: Math.min(100, prev.progresso + 6),
    }));
    addXP(10);
    showToast('💧 Plantinha regada com água fresca!');
  };

  // Action: Toggle Sun for Plant
  const handleToggleSun = () => {
    setPlantStats((prev) => ({
      ...prev,
      sol: prev.sol > 60 ? 30 : 90,
      progresso: Math.min(100, prev.progresso + 4),
    }));
    addXP(5);
  };

  // Action: Harvest Lavender Flowers
  const handleHarvestPlant = () => {
    setInventory((prev) => ({
      ...prev,
      sachesLavanda: prev.sachesLavanda + 2,
      floresColhidas: prev.floresColhidas + 1,
      folhinhas: prev.folhinhas + 40,
    }));
    setPlantStats((prev) => ({
      ...prev,
      estagio: 'semente',
      progresso: 10,
    }));
    addXP(40);
    showToast('🎉 Flores colhidas! Você ganhou +2 Sachês de Lavanda e +40 Folhinhas!');
  };

  // Action: Kid completes routine task
  const handleToggleKidTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextDone = !t.concluidaHoje;
          if (nextDone) {
            setInventory((inv) => ({
              ...inv,
              folhinhas: inv.folhinhas + t.recompensaFolhas,
            }));
            addXP(t.recompensaXp);
            showToast(`⭐ Tarefa concluída! +${t.recompensaFolhas} 🍃 e +${t.recompensaXp} XP`);
          }
          return { ...t, concluidaHoje: nextDone };
        }
        return t;
      })
    );
  };

  // Format screen time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 flex flex-col justify-between ${
        isSleeping
          ? 'bg-gradient-to-b from-[#130f24] via-[#1b1531] to-[#0f0c1d] text-purple-100'
          : 'bg-gradient-to-b from-[#f3e8ff] via-[#faf5ff] to-[#ecfdf5] text-slate-800'
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-0 mx-auto max-w-sm z-50 px-4 transition-all duration-300">
          <div className="bg-purple-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-purple-400/40 text-xs sm:text-sm font-semibold flex items-center gap-2 justify-center text-center">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* TOP BAR / HEADER (Following Top Bar Contract: 3 zones) */}
      <header
        className={`w-full px-4 py-3 flex items-center justify-between border-b transition-colors duration-500 z-20 ${
          isSleeping
            ? 'bg-[#1b1531]/80 border-purple-900/50 backdrop-blur-md text-purple-200'
            : 'bg-white/80 border-purple-100 backdrop-blur-md text-slate-800'
        }`}
      >
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍃</span>
          <span className="text-base sm:text-lg font-bold font-heading tracking-tight">
            Amigo de Folha
          </span>
        </div>

        {/* Zone 2: Navigation Links / Screen Time Countdown */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          {/* Level Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-800 border border-purple-200">
            <span>Nível {inventory.nivel}</span>
            <span className="text-[10px] text-purple-600 font-mono">
              ({inventory.xp}/{inventory.nivel * 100} XP)
            </span>
          </div>

          {/* Folhinhas Counter */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-amber-800">
            <span>🍃</span>
            <span className="font-bold font-mono">{inventory.folhinhas}</span>
          </div>

          {/* Saches Counter */}
          <div
            onClick={handleUseAromaPocket}
            className="flex items-center gap-1 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full text-purple-800 cursor-pointer hover:bg-purple-100 transition"
            title="Sachês de Lavanda disponíveis"
          >
            <span>🪻</span>
            <span className="font-bold font-mono">{inventory.sachesLavanda}</span>
          </div>

          {/* Screen Time Kid Badge if active and visible */}
          {parentSettings.screenTimeEnabled && parentSettings.timerVisibleToKid && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                parentSettings.tempoRestante < 120
                  ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
              title="Tempo de uso restante da tela"
            >
              <span>⏱️</span>
              <span>{formatTime(parentSettings.tempoRestante)}</span>
            </div>
          )}
        </div>

        {/* Zone 3: Actions (Sound, Night Mode, Parents Area) */}
        <div className="flex items-center gap-2">
          {/* Audio Mute Button */}
          <button
            onClick={toggleMute}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition ${
              isMuted ? 'bg-slate-200 text-slate-500' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
            title={isMuted ? 'Ativar sons' : 'Desativar sons'}
          >
            {isMuted ? '🔇' : '🔔'}
          </button>

          {/* Parents Panel Button */}
          <button
            onClick={() => setShowParentsModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-800 hover:bg-purple-900 text-white shadow-sm transition active:scale-95"
            title="Área dos Pais (Protegido por PIN)"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">Área dos Pais</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-4 py-3 relative z-10">
        {/* Status Indicators of Teddy (Energy, Happiness, Calm/Aroma) */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-purple-100 shadow-sm mb-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            {/* 1. Energia / Sono */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 mb-1">
                <span>{isSleeping ? '🌙' : '⚡'} Sono/Energia</span>
                <span className="font-mono text-slate-500">{Math.round(teddyStats.energia)}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${teddyStats.energia}%` }}
                />
              </div>
            </div>

            {/* 2. Felicidade */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-pink-700 mb-1">
                <span>💖 Felicidade</span>
                <span className="font-mono text-slate-500">{Math.round(teddyStats.felicidade)}%</span>
              </div>
              <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-400 rounded-full transition-all duration-300"
                  style={{ width: `${teddyStats.felicidade}%` }}
                />
              </div>
            </div>

            {/* 3. Calma / Aroma de Lavanda */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 mb-1">
                <span>🪻 Calma/Aroma</span>
                <span className="font-mono text-slate-500">{Math.round(teddyStats.calma)}%</span>
              </div>
              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${teddyStats.calma}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Phase Navigation Tabs (Ursinho vs Jardim de Lavanda) */}
        <div className="flex items-center justify-center gap-2 mb-3 bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-purple-200">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('teddy'); }}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'teddy'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-900 hover:bg-purple-100/60'
            }`}
          >
            <span>🧸</span>
            <span>O Ursinho</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('garden'); }}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'garden'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-purple-900 hover:bg-purple-100/60'
            }`}
          >
            <span>🪻</span>
            <span>Jardim de Lavanda</span>
            {inventory.nivel < 2 && <span className="text-[10px] opacity-70">🔒</span>}
          </button>
        </div>

        {/* ACTIVE STAGE CONTENT */}
        <div className="w-full flex flex-col items-center justify-center my-auto min-h-[300px]">
          {activeTab === 'teddy' ? (
            <TeddyMascot
              stats={teddyStats}
              isSleeping={isSleeping}
              hasAromaActive={hasAromaActive}
              onPet={handlePetTeddy}
              onPocketClick={handleUseAromaPocket}
            />
          ) : (
            <LavenderGarden
              plant={plantStats}
              nivel={inventory.nivel}
              onWater={handleWaterPlant}
              onToggleSun={handleToggleSun}
              onHarvest={handleHarvestPlant}
            />
          )}
        </div>

        {/* QUICK ACTION BAR FOR CHILDREN */}
        {activeTab === 'teddy' && (
          <div className="w-full max-w-lg mt-3 flex flex-wrap justify-center gap-2 sm:gap-3">
            {/* 1. Fazer Carinho */}
            <button
              onClick={handlePetTeddy}
              className="flex-1 min-w-[100px] py-2.5 px-3 bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex flex-col items-center gap-1"
            >
              <span className="text-xl">💖</span>
              <span>Fazer Carinho</span>
            </button>

            {/* 2. Sachê de Lavanda */}
            <button
              onClick={handleUseAromaPocket}
              className="flex-1 min-w-[100px] py-2.5 px-3 bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex flex-col items-center gap-1"
            >
              <span className="text-xl">🪻</span>
              <span>Usar Sachê ({inventory.sachesLavanda})</span>
            </button>

            {/* 3. Dormir / Acordar */}
            <button
              onClick={handleToggleSleep}
              className={`flex-1 min-w-[100px] py-2.5 px-3 font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex flex-col items-center gap-1 ${
                isSleeping
                  ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border border-amber-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <span className="text-xl">{isSleeping ? '☀️' : '🌙'}</span>
              <span>{isSleeping ? 'Acordar' : 'Hora de Nanar'}</span>
            </button>

            {/* 4. Respiração da Folhinha */}
            <button
              onClick={() => { sounds.playClick(); setShowBreathingModal(true); }}
              className="flex-1 min-w-[100px] py-2.5 px-3 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex flex-col items-center gap-1"
            >
              <span className="text-xl">🍃</span>
              <span>Respiração</span>
            </button>

            {/* 5. Historinha de Ninar */}
            <button
              onClick={() => { sounds.playClick(); setShowStoriesModal(true); }}
              className="flex-1 min-w-[100px] py-2.5 px-3 bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex flex-col items-center gap-1"
            >
              <span className="text-xl">📖</span>
              <span>Historinha</span>
            </button>

            {/* 6. Minhas Tarefas da Rotina */}
            <button
              onClick={() => { sounds.playClick(); setShowTasksModal(true); }}
              className="flex-1 min-w-[100px] py-2.5 px-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex flex-col items-center gap-1"
            >
              <span className="text-xl">📋</span>
              <span>Minhas Tarefas</span>
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full py-2.5 text-center text-xs text-purple-800/60 transition-colors">
        <p>Amigo de Folha: Cultive. Sinta. Durma. 🌿💜</p>
      </footer>

      {/* MODALS */}
      {/* 1. Parents Protected Panel */}
      {showParentsModal && (
        <ParentsPanel
          settings={parentSettings}
          tasks={tasks}
          onUpdateSettings={setParentSettings}
          onUpdateTasks={setTasks}
          onClose={() => setShowParentsModal(false)}
          onLockScreenNow={() => {
            setShowParentsModal(false);
            setParentSettings((p) => ({ ...p, bloqueadoPorTempo: true }));
            sounds.startAmbientSleep();
          }}
        />
      )}

      {/* 2. Kid Routine Tasks Modal */}
      {showTasksModal && (
        <KidsTasksModal
          tasks={tasks}
          onToggleTask={handleToggleKidTask}
          onClose={() => setShowTasksModal(false)}
        />
      )}

      {/* 3. Breathing Calming Exercise Modal */}
      {showBreathingModal && (
        <BreathingExercise
          onComplete={() => {
            setTeddyStats((prev) => ({ ...prev, calma: 100 }));
            addXP(20);
            showToast('🌸 Respiração completada! Você e o Ursinho estão tranquilos.');
          }}
          onClose={() => setShowBreathingModal(false)}
        />
      )}

      {/* 4. Bedtime Stories Modal */}
      {showStoriesModal && (
        <BedtimeStoriesModal onClose={() => setShowStoriesModal(false)} />
      )}

      {/* 5. Sleep Screen Time Lockout Screen */}
      {parentSettings.bloqueadoPorTempo && (
        <SleepLockScreen
          pin={parentSettings.pin}
          onUnlock={() => {
            setParentSettings((prev) => ({
              ...prev,
              bloqueadoPorTempo: false,
              tempoRestante: prev.screenTimeLimitSeconds,
            }));
            sounds.stopAmbientSleep();
            showToast('☀️ Tela desbloqueada com sucesso!');
          }}
        />
      )}
    </div>
  );
}
