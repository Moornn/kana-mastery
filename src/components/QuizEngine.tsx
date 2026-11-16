import React, { useState, useEffect, useRef } from 'react';
import { KanaEntry } from '../types';
import { checkRomajiMatch } from '../utils/romaji';
import { playSuccessSound, playErrorSound, speakJapanese, triggerVibration } from '../utils/audio';
import { calculateNextReview } from '../utils/srs';
import { saveSRSRecord, getSRSRecord } from '../db/storage';
import { Volume2, ArrowLeft } from 'lucide-react';

interface Props {
  kanas: KanaEntry[];
  mode: 'recognition' | 'audio' | 'timeAttack';
  onComplete: () => void;
  // Ajout de onClose pour le bouton Retour
  onClose: () => void;
  settings: { hapticEnabled: boolean; soundEnabled: boolean; defaultFont: string };
}

export const QuizEngine = ({ kanas, mode, onComplete, onClose, settings }: Props) => {
  // Limiteur de session SRS (20 items max par session)
  const [sessionKanas] = useState(() => {
    // Si on a plus de 20 kanas à réviser, on mélange et on en garde juste 20
    if (kanas.length > 20) {
      const shuffled = [...kanas].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 20);
    }
    return kanas;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'timeAttack' ? 60 : 0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentKana = sessionKanas[currentIndex];

  useEffect(() => {
    if (mode === 'timeAttack' && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(l => l - 1), 1000);
      return () => clearTimeout(t);
    } else if (mode === 'timeAttack' && timeLeft === 0) {
      onComplete();
    }
  }, [timeLeft, mode, onComplete]);

  useEffect(() => {
    if (mode === 'audio' && currentKana) speakJapanese(currentKana.kana);
    inputRef.current?.focus();
  }, [currentIndex, currentKana, mode]);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    
    if (checkRomajiMatch(val, currentKana.romaji)) {
      if (settings.soundEnabled) playSuccessSound();
      if (settings.hapticEnabled) triggerVibration(40);
      setScore(s => s + 1);
      
      const prevRecord = await getSRSRecord(currentKana.id);
      await saveSRSRecord(calculateNextReview(currentKana.id, 4, prevRecord));

      setTimeout(() => {
        setInput('');
        if (currentIndex + 1 < sessionKanas.length && (mode !== 'timeAttack' || timeLeft > 0)) {
          setCurrentIndex(i => i + 1);
        } else {
          onComplete();
        }
      }, 150);
    }
  };

  const handleFail = async () => {
    if (settings.soundEnabled) playErrorSound();
    if (settings.hapticEnabled) triggerVibration([40, 60, 40]);
    
    const prevRecord = await getSRSRecord(currentKana.id);
    await saveSRSRecord(calculateNextReview(currentKana.id, 1, prevRecord));
    
    setInput('');
    if (currentIndex + 1 < sessionKanas.length) setCurrentIndex(i => i + 1);
    else onComplete();
  };

  if (!currentKana) return null;

  const fontClass = settings.defaultFont === 'Klee One' ? 'font-handwriting' 
                  : settings.defaultFont === 'Yuji Syuku' ? 'font-brush' 
                  : settings.defaultFont === 'Noto Serif JP' ? 'font-serif' : 'font-sans';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 relative">
      
      {/* Bouton Retour */}
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 p-2 bg-slate-800/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-10 shadow-md"
        aria-label="Retour au menu"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex flex-col items-center justify-center h-[80vh] p-6 w-full max-w-md mx-auto">
        <div className="w-full flex justify-between items-center mb-8 px-2">
          <div className="text-sm font-medium text-slate-400">Score: <span className="text-indigo-400">{score}</span></div>
          {mode === 'timeAttack' && <div className="text-xl font-mono font-bold text-rose-400">{timeLeft}s</div>}
          <div className="text-sm font-medium text-slate-400">{currentIndex + 1} / {sessionKanas.length}</div>
        </div>
        
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-[2rem] w-full p-10 flex flex-col items-center shadow-2xl backdrop-blur-md relative">
          {mode === 'audio' ? (
            <button 
              onClick={() => speakJapanese(currentKana.kana)}
              className="w-32 h-32 bg-indigo-500/20 text-indigo-400 rounded-full flex flex-col items-center justify-center hover:bg-indigo-500/30 transition-all active:scale-95 mb-8"
            >
              <Volume2 size={40} className="mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Écouter</span>
            </button>
          ) : (
            <div className={`text-9xl text-slate-50 mb-10 drop-shadow-lg ${fontClass}`}>
              {currentKana.kana}
            </div>
          )}
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Saisir le romaji..."
            className="w-full bg-slate-900 border-2 border-slate-700 text-slate-100 rounded-2xl px-6 py-4 text-center text-2xl font-mono focus:outline-none focus:border-indigo-500 transition-colors shadow-inner mb-6"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
          
          <button onClick={handleFail} className="text-slate-500 text-sm font-medium uppercase tracking-wider hover:text-slate-300 transition-colors">
            Je ne sais pas
          </button>
        </div>
      </div>
    </div>
  );
};