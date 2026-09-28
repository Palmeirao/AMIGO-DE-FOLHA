export interface TeddyStats {
  energia: number;     // 0 - 100
  felicidade: number;  // 0 - 100
  calma: number;       // 0 - 100 (aroma & relaxamento)
}

export type PlantStage = 'semente' | 'crescimento' | 'florida';

export interface PlantStats {
  unlocked: boolean;
  umidade: number;     // 0 - 100
  sol: number;         // 0 - 100
  estagio: PlantStage;
  progresso: number;   // 0 - 100
  gotasHoje: number;
}

export interface Inventory {
  sachesLavanda: number;
  folhinhas: number;    // Moedas do jogo
  floresColhidas: number;
  xp: number;
  nivel: number;
}

export interface RoutineTask {
  id: string;
  titulo: string;
  icone: string;
  categoria: 'noite' | 'dia' | 'geral';
  recompensaFolhas: number;
  recompensaXp: number;
  concluidaHoje: boolean;
}

export interface ParentSettings {
  pin: string;
  screenTimeLimitSeconds: number; // Em segundos
  screenTimeEnabled: boolean;
  timerVisibleToKid: boolean;
  tempoRestante: number;
  bloqueadoPorTempo: boolean;
}

export interface BedtimeStory {
  id: string;
  titulo: string;
  subtitulo: string;
  icone: string;
  conteudo: string[];
}
