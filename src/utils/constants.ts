import { RoutineTask, BedtimeStory } from '../types';

export const INITIAL_TASKS: RoutineTask[] = [
  {
    id: 'task-1',
    titulo: 'Escovar os dentinhos com carinho',
    icone: '🦷',
    categoria: 'noite',
    recompensaFolhas: 15,
    recompensaXp: 25,
    concluidaHoje: false,
  },
  {
    id: 'task-2',
    titulo: 'Guardar os brinquedinhos no lugar',
    icone: '🧸',
    categoria: 'noite',
    recompensaFolhas: 20,
    recompensaXp: 30,
    concluidaHoje: false,
  },
  {
    id: 'task-3',
    titulo: 'Colocar o pijama confortável',
    icone: '👕',
    categoria: 'noite',
    recompensaFolhas: 10,
    recompensaXp: 20,
    concluidaHoje: false,
  },
  {
    id: 'task-4',
    titulo: 'Tomar banho morno e relaxante',
    icone: '🛁',
    categoria: 'noite',
    recompensaFolhas: 25,
    recompensaXp: 35,
    concluidaHoje: false,
  },
  {
    id: 'task-5',
    titulo: 'Ouvir ou ler uma historinha com a família',
    icone: '📖',
    categoria: 'noite',
    recompensaFolhas: 15,
    recompensaXp: 25,
    concluidaHoje: false,
  },
  {
    id: 'task-6',
    titulo: 'Fazer xixi e dar boa noite para quem você ama',
    icone: '🌙',
    categoria: 'noite',
    recompensaFolhas: 10,
    recompensaXp: 20,
    concluidaHoje: false,
  },
];

export const BEDTIME_STORIES: BedtimeStory[] = [
  {
    id: 'story-1',
    titulo: 'A Folhinha que Aprendeu a Sonhar',
    subtitulo: 'Uma história suave sobre encontrar a tranquilidade da noite',
    icone: '🍃',
    conteudo: [
      'No alto de um grande carvalho aromático vivia uma pequena folhinha verde e curiosa.',
      'Durante o dia ela dançava com o vento e brincava com os passarinhos cantores.',
      'Mas quando o sol se punha em tons de lavanda e dourado, a floresta ia ficando em silêncio.',
      'A coruja sábia pousou ao lado e sussurrou: "Respire fundo, sinta o aroma da terra e feche os olhinhos."',
      'A folhinha respirou... um aroma doce de flor de lavanda subiu pelo ar fresco da noite.',
      'Ela se enrolou macia, agradeceu pelo dia feliz e sonhou com jardins iluminados por estrelas.',
      'Boa noite, folhinha. Boa noite, amiguinho.',
    ],
  },
  {
    id: 'story-2',
    titulo: 'O Ursinho e o Vale de Lavanda',
    subtitulo: 'O segredo do sachê perfumado do sono',
    icone: '🧸',
    conteudo: [
      'O Ursinho de Folha acordou sentindo que a noite estava chegando de mansinho.',
      'Ele caminhou pelo jardim perfumado onde as florzinhas roxas balançavam suavemente.',
      'Colheu três pétalas lilases, colocou dentro do seu bolsinho mágico no peito e sentiu seu coração desacelerar.',
      'Cada respiração trazia uma onda de paz, como um abraço quentinho de quem a gente ama.',
      'Ele deitou em sua caminha de folhas macias, puxou o cobertorzinho até o queixo e bocejou um longo "aaaaah".',
      'Agora os guardiões do sono protegem os seus sonhos até o sol raiar.',
    ],
  },
  {
    id: 'story-3',
    titulo: 'O Barquinho das Nuvens Suaves',
    subtitulo: 'Navegando pelo céu estrelado da imaginação',
    icone: '⛵',
    conteudo: [
      'Imagine um barquinho branquinho feito de algodão e nuvem fofa esperando só por você.',
      'Você sobe nele e se aninha em travesseiros macios que cheiram a camomila e alfazema.',
      'O barquinho começa a navegar devagarinho pelo céu azul-marinho, passando por estrelinhas que piscam com carinho.',
      'O balanço é lento... pra lá... e pra cá... tão gostoso e tranquilo.',
      'Seus olhinhos vão ficando pesados e o sono doce chega para embalar sua noite.',
    ],
  },
];

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Amiguinho Sonhador',
  2: 'Jardineiro de Lavanda',
  3: 'Guardião das Estrelas',
  4: 'Mestre da Serenidade',
  5: 'Protetor do Bosque Encantado',
};
