import React from 'react';
import { RoutineTask } from '../types';
import { sounds } from '../utils/audio';

interface KidsTasksModalProps {
  tasks: RoutineTask[];
  onToggleTask: (id: string) => void;
  onClose: () => void;
}

export const KidsTasksModal: React.FC<KidsTasksModalProps> = ({
  tasks,
  onToggleTask,
  onClose,
}) => {
  const completedCount = tasks.filter((t) => t.concluidaHoje).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleTaskClick = (task: RoutineTask) => {
    if (!task.concluidaHoje) {
      sounds.playSparkle();
    } else {
      sounds.playClick();
    }
    onToggleTask(task.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-gradient-to-b from-purple-50 via-white to-purple-50/80 rounded-3xl w-full max-w-md shadow-2xl border-2 border-purple-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="font-bold text-lg font-heading">Minhas Tarefinhas do Bem</h2>
              <p className="text-xs text-purple-200">Cumpra tarefas para ganhar Folhinhas e XP!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-lg transition active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="p-4 bg-white/80 border-b border-purple-100">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
            <span>Progresso da Rotina Hoje</span>
            <span className="text-purple-700">
              {completedCount} de {tasks.length} concluídas
            </span>
          </div>
          <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {completedCount === tasks.length && tasks.length > 0 && (
            <p className="text-xs text-center font-bold text-emerald-600 mt-2 animate-bounce">
              🎉 Parabéns! Você concluiu toda a rotina de hoje!
            </p>
          )}
        </div>

        {/* Tasks List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between active:scale-[0.98] ${
                task.concluidaHoje
                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-700'
                  : 'bg-white border-purple-100 hover:border-purple-300 shadow-sm text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm transition ${
                    task.concluidaHoje
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'border-2 border-slate-300 bg-slate-50 text-transparent'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{task.icone}</span>
                    <span
                      className={`text-sm font-bold ${
                        task.concluidaHoje ? 'line-through text-slate-500 font-normal' : 'text-slate-800'
                      }`}
                    >
                      {task.titulo}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-purple-600 mt-0.5">
                    +{task.recompensaFolhas} 🍃 · +{task.recompensaXp} XP
                  </div>
                </div>
              </div>

              {task.concluidaHoje && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Pronto!
                </span>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-6">
              Nenhuma tarefa cadastrada. Peça aos seus pais na Área dos Pais!
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-purple-50/60 border-t border-purple-100 text-center">
          <p className="text-xs text-purple-800 font-semibold">
            ✨ Cuidar de você também cuida do Amigo de Folha!
          </p>
        </div>
      </div>
    </div>
  );
};
