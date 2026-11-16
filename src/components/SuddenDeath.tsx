import { useState, useEffect } from 'react';
import { KanaEntry } from '../types';
import { playSuccessSound, playErrorSound, triggerVibration } from '../utils/audio';
import { ArrowLeft, Flame } from 'lucide-react';
import { kanaDatabase } from '../data/kanaData';

interface Props {
  kanas: KanaEntry[];
  onComplete: (score: number) => void;
  onClose: () => void;
  settings: { hapticEnabled: boolean; soundEnabled: boolean; defaultFont: string };
}

export const SuddenDeath = ({ kanas, onComplete, onClose, settings }: Props) => {
  const [currentKana, setCurrentKana] = useState<KanaEntry | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeBar, setTimeBar] = useState(100);

  // Générer une nouvelle question
  const generateQuestion = () => {
    if (kanas.length === 0) return;
    
    // Piocher un Kana au hasard parmi ceux à réviser
    const target = kanas[Math.floor(Math.random() * kanas.length)];
    setCurrentKana(target);
    setTimeBar(100); // Reset du timer visuel

    // --- LOGIQUE DES FAUX-AMIS ---
    let wrongAnswers: string[] = [];
    
    // 1. Chercher d'abord dans les confusables définis dans kanaData.ts
    if (target.confusables && target.confusables.length > 0) {
      wrongAnswers = target.confusables
        .map(id => kanaDatabase.find(k => k.id === id)?.romaji[0] || '')
        .filter(r => r !== '');
    }

    // 2. Si pas assez de confusables, boucher les trous au hasard
    while (wrongAnswers.length < 3) {
      const randomKana = kanaDatabase[Math.floor(Math.random() * kanaDatabase.length)];
      const randomRomaji = randomKana.romaji[0];
      if (randomRomaji !== target.romaji[0] && !wrongAnswers.includes(randomRomaji)) {
        wrongAnswers.push(randomRomaji);
      }
    }

    // 3. Ne garder que 3 mauvaises réponses max, ajouter la bonne, et mélanger le tout
    const finalOptions = [...wrongAnswers.slice(0, 3), target.romaji[0]].sort(() => 0.5 - Math.random());
    setOptions(finalOptions);
  };

  // Initialisation
  useEffect(() => {
    if (!isGameOver) generateQuestion();
  }, [isGameOver]);

  // Le Timer impitoyable
  useEffect(() => {
    if (isGameOver || !currentKana) return;

    // La barre de temps descend très vite (100% à 0% en ~3 secondes)
    const timer = setInterval(() => {
      setTimeBar((prev) => {
        if (prev <= 0) {
          handleWrongAnswer();
          return 0;
        }
        // Vitesse de base + accélération légère avec le score
        return prev - (1.5 + (score * 0.1)); 
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentKana, isGameOver, score]);

  const handleAnswer = (selectedRomaji: string) => {
    if (isGameOver || !currentKana) return;

    if (currentKana.romaji.includes(selectedRomaji)) {
      // Bonne réponse !
      if (settings.soundEnabled) playSuccessSound();
      if (settings.hapticEnabled) triggerVibration(30);
      setScore(s => s + 1);
      generateQuestion(); // On enchaîne direct
    } else {
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = () => {
    setIsGameOver(true);
    if (settings.soundEnabled) playErrorSound();
    if (settings.hapticEnabled) triggerVibration([50, 100, 50]);
  };

  const fontClass = settings.defaultFont === 'Klee One' ? 'font-handwriting' 
                  : settings.defaultFont === 'Yuji Syuku' ? 'font-brush' 
                  : settings.defaultFont === 'Noto Serif JP' ? 'font-serif' : 'font-sans';

  // --- ÉCRAN DE FIN DE JEU ---
  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-6">
        <Flame size={64} className="text-rose-500 mb-6 animate-pulse" />
        <h2 className="text-4xl font-bold mb-2">MORT SUBITE</h2>
        <p className="text-slate-400 mb-8 text-lg">Le Kana t'a eu...</p>
        
        <div className="bg-slate-800 p-8 rounded-3xl text-center shadow-xl border border-slate-700 w-full max-w-sm">
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Score Final</div>
          <div className="text-6xl font-black text-indigo-400 mb-8">{score}</div>
          
          <button 
            onClick={() => onComplete(score)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  // --- ÉCRAN DE JEU EN COURS ---
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-900 text-slate-100 relative pb-10">
      
      {/* En-tête (Retour et Score) */}
      <div className="w-full flex justify-between items-center p-6 z-10">
        <button 
          onClick={onClose}
          className="p-2 bg-slate-800/80 rounded-full text-slate-400 hover:text-white transition-all shadow-md"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
          <Flame size={18} className="text-orange-500" />
          <span className="font-bold text-lg">{score}</span>
        </div>
      </div>

      {/* Zone d'affichage du Kana */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {currentKana && (
          <div className={`text-[12rem] leading-none text-slate-50 drop-shadow-2xl ${fontClass} animate-in zoom-in duration-150`}>
            {currentKana.kana}
          </div>
        )}
      </div>

      {/* Interface tactile du bas (Barre de temps + Boutons) */}
      <div className="w-full max-w-md px-6 flex flex-col gap-6">
        
        {/* Barre de temps de stress */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-75 ${timeBar < 30 ? 'bg-rose-500' : 'bg-indigo-500'}`}
            style={{ width: `${timeBar}%` }}
          />
        </div>

        {/* Grille 2x2 des 4 choix Romaji */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(opt)}
              className="bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 hover:bg-slate-800/80 text-white font-mono text-2xl font-bold py-6 rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
};