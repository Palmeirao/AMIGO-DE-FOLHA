import React, { useState } from 'react';
import { ParentSettings, RoutineTask } from '../types';
import { sounds } from '../utils/audio';
import { INITIAL_TASKS } from '../utils/constants';

interface ParentsPanelProps {
  settings: ParentSettings;
  tasks: RoutineTask[];
  onUpdateSettings: (newSettings: ParentSettings) => void;
  onUpdateTasks: (newTasks: RoutineTask[]) => void;
  onClose: () => void;
  onLockScreenNow: () => void;
}

export const ParentsPanel: React.FC<ParentsPanelProps> = ({
  settings,
  tasks,
  onUpdateSettings,
  onUpdateTasks,
  onClose,
  onLockScreenNow,
}) => {
  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showMathGate, setShowMathGate] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');

  // Fixed math question for fallback
  const mathQuestion = { q: 'Quanto é 7 + 8?', a: '15' };

  // Form states for new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskIcon, setNewTaskIcon] = useState('⭐');
  const [newTaskReward, setNewTaskReward] = useState(15);
  const [activeTab, setActiveTab] = useState<'screen' | 'tasks' | 'settings'>('screen');

  // New PIN update state
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Time limit input values
  const [customUnit, setCustomUnit] = useState<'sec' | 'min' | 'hour'>('min');
  const [customValue, setCustomValue] = useState(15);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === settings.pin) {
      setIsAuthenticated(true);
      setPinError(false);
      sounds.playSparkle();
    } else {
      setPinError(true);
      setEnteredPin('');
      sounds.playClick();
    }
  };

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mathAnswer.trim() === mathQuestion.a) {
      setIsAuthenticated(true);
      sounds.playSparkle();
    } else {
      setPinError(true);
      setMathAnswer('');
      sounds.playClick();
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: RoutineTask = {
      id: `task-${Date.now()}`,
      titulo: newTaskTitle.trim(),
      icone: newTaskIcon,
      categoria: 'noite',
      recompensaFolhas: newTaskReward,
      recompensaXp: Math.round(newTaskReward * 1.5),
      concluidaHoje: false,
    };

    onUpdateTasks([...tasks, newTask]);
    setNewTaskTitle('');
    sounds.playSparkle();
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
    sounds.playClick();
  };

  const handleResetTasksToday = () => {
    const reset = tasks.map((t) => ({ ...t, concluidaHoje: false }));
    onUpdateTasks(reset);
    sounds.playSparkle();
  };

  const handleRestoreDefaultTasks = () => {
    onUpdateTasks(INITIAL_TASKS);
    sounds.playSparkle();
  };

  const handleApplyTimeLimit = () => {
    let multiplier = 60;
    if (customUnit === 'sec') multiplier = 1;
    if (customUnit === 'hour') multiplier = 3600;

    const totalSeconds = Math.max(5, customValue * multiplier);

    onUpdateSettings({
      ...settings,
      screenTimeLimitSeconds: totalSeconds,
      tempoRestante: totalSeconds,
      screenTimeEnabled: true,
      bloqueadoPorTempo: false,
    });
    sounds.playSparkle();
  };

  const handleToggleScreenTime = () => {
    onUpdateSettings({
      ...settings,
      screenTimeEnabled: !settings.screenTimeEnabled,
      bloqueadoPorTempo: false,
    });
  };

  const handleToggleTimerVisibility = () => {
    onUpdateSettings({
      ...settings,
      timerVisibleToKid: !settings.timerVisibleToKid,
    });
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length === 4 && /^\d+$/.test(newPinInput)) {
      onUpdateSettings({
        ...settings,
        pin: newPinInput,
      });
      setPinChangeSuccess(true);
      setNewPinInput('');
      sounds.playSparkle();
      setTimeout(() => setPinChangeSuccess(false), 3000);
    }
  };

  // Export single-file offline HTML
  const handleExportSingleHTML = async () => {
    try {
      const response = await fetch('/amigo_de_folha_standalone.html');
      if (response.ok) {
        const text = await response.text();
        const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'amigo-de-folha-guardiao-do-sono.html';
        link.click();
        URL.revokeObjectURL(url);
        sounds.playSparkle();
        return;
      }
    } catch {
      // Fallback below
    }

    const fallback = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Amigo de Folha</title></head><body><h1>Amigo de Folha — Guardião do Sono</h1><p>Abra o jogo no navegador para jogar offline.</p></body></html>`;
    const blob = new Blob([fallback], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'amigo-de-folha.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <div>
              <h2 className="font-bold text-base font-heading">Área dos Pais & Responsáveis</h2>
              <p className="text-[11px] text-purple-200">Controles de rotina e tempo de tela</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition"
            title="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            // Authentication Gate
            <div className="py-4 text-center max-w-xs mx-auto">
              <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                🔒
              </div>
              <h3 className="font-bold text-slate-800 mb-1 font-heading text-lg">
                Área Protegida
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Digite a senha de 4 dígitos para gerenciar as tarefas e os limites de tela.
              </p>

              {!showMathGate ? (
                <form onSubmit={handlePinSubmit} className="space-y-3">
                  <div>
                    <input
                      type="password"
                      maxLength={4}
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      autoFocus
                      className="w-36 text-center text-2xl tracking-[0.5em] font-mono py-2 bg-slate-50 border-2 border-purple-200 rounded-xl focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  {pinError && (
                    <p className="text-xs text-rose-500 font-semibold">
                      PIN incorreto. Senha padrão inicial: 1234
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-sm rounded-xl transition shadow-sm"
                  >
                    Entrar no Painel
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Senha padrão inicial: <span className="font-mono font-bold text-purple-600">1234</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowMathGate(true)}
                    className="text-xs text-purple-600 underline block mx-auto pt-1"
                  >
                    Esqueceu o PIN? Resolver cálculo
                  </button>
                </form>
              ) : (
                <form onSubmit={handleMathSubmit} className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">{mathQuestion.q}</p>
                  <input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    placeholder="Resultado"
                    className="w-28 text-center text-xl font-bold py-2 bg-slate-50 border-2 border-purple-200 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMathGate(false)}
                      className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                    >
                      Voltar ao PIN
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
                    >
                      Confirmar
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            // Authenticated Dashboard
            <div className="space-y-5">
              {/* Tab Navigation */}
              <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                <button
                  onClick={() => setActiveTab('screen')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                    activeTab === 'screen'
                      ? 'bg-white text-purple-800 shadow-sm'
                      : 'text-slate-600 hover:text-purple-700'
                  }`}
                >
                  ⏱️ Tempo de Tela
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                    activeTab === 'tasks'
                      ? 'bg-white text-purple-800 shadow-sm'
                      : 'text-slate-600 hover:text-purple-700'
                  }`}
                >
                  📝 Rotina ({tasks.length})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                    activeTab === 'settings'
                      ? 'bg-white text-purple-800 shadow-sm'
                      : 'text-slate-600 hover:text-purple-700'
                  }`}
                >
                  ⚙️ Config & PIN
                </button>
              </div>

              {/* TAB 1: Screen Time Control */}
              {activeTab === 'screen' && (
                <div className="space-y-4">
                  <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Controle Ativo de Tela</h4>
                      <p className="text-xs text-slate-500">
                        {settings.screenTimeEnabled
                          ? 'O jogo bloqueará automaticamente quando o tempo terminar.'
                          : 'Limite desativado no momento.'}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleScreenTime}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                        settings.screenTimeEnabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {settings.screenTimeEnabled ? 'ATIVADO' : 'DESATIVADO'}
                    </button>
                  </div>

                  {/* Preset Limit Form */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Definir Novo Limite de Uso Contínuo:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={customValue}
                        onChange={(e) => setCustomValue(Number(e.target.value))}
                        className="w-24 px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-center text-sm focus:outline-purple-500"
                      />
                      <select
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value as 'sec' | 'min' | 'hour')}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-purple-500"
                      >
                        <option value="sec">Segundos (teste rápido de sono)</option>
                        <option value="min">Minutos (rotina recomendada)</option>
                        <option value="hour">Horas</option>
                      </select>
                      <button
                        onClick={handleApplyTimeLimit}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition whitespace-nowrap"
                      >
                        Aplicar
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => { setCustomValue(30); setCustomUnit('sec'); }}
                        className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg hover:border-purple-300 text-slate-700"
                      >
                        30 seg (teste)
                      </button>
                      <button
                        onClick={() => { setCustomValue(15); setCustomUnit('min'); }}
                        className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg hover:border-purple-300 text-slate-700"
                      >
                        15 min
                      </button>
                      <button
                        onClick={() => { setCustomValue(30); setCustomUnit('min'); }}
                        className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg hover:border-purple-300 text-slate-700"
                      >
                        30 min
                      </button>
                      <button
                        onClick={() => { setCustomValue(45); setCustomUnit('min'); }}
                        className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg hover:border-purple-300 text-slate-700"
                      >
                        45 min
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">
                        Exibir contagem regressiva para a criança
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Mostra um reloginho fofo no canto da tela
                      </span>
                    </div>
                    <button
                      onClick={handleToggleTimerVisibility}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        settings.timerVisibleToKid ? 'bg-purple-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          settings.timerVisibleToKid ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Immediate Lock Action */}
                  <div className="pt-2">
                    <button
                      onClick={onLockScreenNow}
                      className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <span>🌙 Bloquear Tela Agora Para o Sono</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Routine & Task Manager */}
              {activeTab === 'tasks' && (
                <div className="space-y-4">
                  {/* Create New Task Form */}
                  <form onSubmit={handleAddTask} className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-2">
                    <span className="text-xs font-bold text-purple-900 block">Cadastrar Nova Tarefa:</span>
                    <div className="flex gap-2">
                      <select
                        value={newTaskIcon}
                        onChange={(e) => setNewTaskIcon(e.target.value)}
                        className="w-14 bg-white border border-purple-200 rounded-xl text-lg p-1 text-center"
                      >
                        <option value="🦷">🦷</option>
                        <option value="🧸">🧸</option>
                        <option value="👕">👕</option>
                        <option value="🛁">🛁</option>
                        <option value="📖">📖</option>
                        <option value="🌙">🌙</option>
                        <option value="💧">💧</option>
                        <option value="🥣">🥣</option>
                        <option value="⭐">⭐</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Ex.: Guardar sapatos no armário"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs focus:outline-purple-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
                      >
                        + Adicionar
                      </button>
                    </div>
                  </form>

                  {/* Existing Task List */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-purple-200 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{task.icone}</span>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{task.titulo}</span>
                            <span className="text-[10px] text-purple-600 font-semibold">
                              +{task.recompensaFolhas} Folhinhas · +{task.recompensaXp} XP
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="w-6 h-6 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-xs font-bold transition"
                          title="Remover Tarefa"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quick Routine Tools */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={handleResetTasksToday}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition"
                    >
                      🔄 Resetar para Hoje
                    </button>
                    <button
                      onClick={handleRestoreDefaultTasks}
                      className="flex-1 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold rounded-xl transition"
                    >
                      ✨ Restaurar Padrões
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Settings & PIN */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {/* Change PIN */}
                  <form onSubmit={handleSaveNewPin} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Alterar PIN de Segurança (4 Números):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="Novo PIN"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                        className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-center text-sm font-mono font-bold focus:outline-purple-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
                      >
                        Salvar PIN
                      </button>
                    </div>
                    {pinChangeSuccess && (
                      <p className="text-xs text-emerald-600 font-bold">PIN atualizado com sucesso!</p>
                    )}
                  </form>

                  {/* Standalone HTML File Export */}
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl space-y-2">
                    <h5 className="text-xs font-bold text-purple-900">Salvar Versão Offline</h5>
                    <p className="text-[11px] text-slate-600">
                      Exporte o aplicativo para ser executado mesmo sem conexão de internet no tablet ou computador do seu filho.
                    </p>
                    <button
                      onClick={handleExportSingleHTML}
                      className="w-full py-2 bg-white hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>💾 Baixar Arquivo HTML Único Offline</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
