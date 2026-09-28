import React, { useState } from 'react';
import { BEDTIME_STORIES } from '../utils/constants';
import { sounds } from '../utils/audio';

interface BedtimeStoriesModalProps {
  onClose: () => void;
}

export const BedtimeStoriesModal: React.FC<BedtimeStoriesModalProps> = ({ onClose }) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const selectedStory = selectedStoryIndex !== null ? BEDTIME_STORIES[selectedStoryIndex] : null;

  const handleSelectStory = (idx: number) => {
    setSelectedStoryIndex(idx);
    setPageIndex(0);
    sounds.playNote(523.25, 0.8, 0.1);
  };

  const handleNextPage = () => {
    if (!selectedStory) return;
    if (pageIndex < selectedStory.conteudo.length - 1) {
      setPageIndex((p) => p + 1);
      sounds.playNote(587.33, 0.6, 0.08);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1);
      sounds.playNote(440, 0.6, 0.08);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-gradient-to-b from-[#221c38] to-[#161226] text-purple-100 rounded-3xl w-full max-w-md shadow-2xl border border-purple-500/30 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 border-b border-purple-500/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="font-bold text-base font-heading text-purple-200">
                Historinhas de Ninar
              </h2>
              <p className="text-xs text-purple-400">Contos suaves para adormecer em paz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col justify-center">
          {selectedStory === null ? (
            // Story Selection Menu
            <div className="space-y-3">
              <p className="text-xs text-center text-purple-300 mb-2">
                Escolha uma história para ouvir com a família antes de nanar:
              </p>
              {BEDTIME_STORIES.map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => handleSelectStory(idx)}
                  className="p-4 rounded-2xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-500/30 cursor-pointer transition transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-3.5 shadow-sm"
                >
                  <span className="text-3xl">{story.icone}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-purple-100">{story.titulo}</h3>
                    <p className="text-xs text-purple-300/80 mt-0.5">{story.subtitulo}</p>
                  </div>
                  <span className="text-purple-400 font-bold">➔</span>
                </div>
              ))}
            </div>
          ) : (
            // Story Reader View
            <div className="flex flex-col h-full justify-between py-2">
              <div className="flex justify-between items-center text-xs text-purple-400 mb-4 pb-2 border-b border-purple-800/40">
                <button
                  onClick={() => setSelectedStoryIndex(null)}
                  className="hover:text-purple-200 flex items-center gap-1 font-bold"
                >
                  ◀ Outras histórias
                </button>
                <span>
                  Página {pageIndex + 1} de {selectedStory.conteudo.length}
                </span>
              </div>

              {/* Story Page Text */}
              <div className="my-auto py-6 px-4 bg-purple-950/50 rounded-2xl border border-purple-500/20 text-center min-h-[160px] flex flex-col items-center justify-center">
                <span className="text-3xl mb-4">{selectedStory.icone}</span>
                <p className="text-base sm:text-lg text-purple-100 font-medium leading-relaxed">
                  "{selectedStory.conteudo[pageIndex]}"
                </p>
              </div>

              {/* Reader Controls */}
              <div className="flex justify-between items-center mt-6 pt-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pageIndex === 0}
                  className="px-4 py-2 bg-purple-900/60 hover:bg-purple-800 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-bold text-purple-200 transition"
                >
                  Anterior
                </button>
                {pageIndex < selectedStory.conteudo.length - 1 ? (
                  <button
                    onClick={handleNextPage}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    Próxima ➔
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedStoryIndex(null)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    Bons Sonhos 🌙
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
