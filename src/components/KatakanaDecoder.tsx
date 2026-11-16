import { useState } from 'react';
import { gairaigoList } from '../data/kanaData';

export const KatakanaDecoder = () => {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const currentWord = gairaigoList[index];

  const nextWord = () => {
    setShowAnswer(false);
    setIndex((i) => (i + 1) % gairaigoList.length);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] p-6 max-w-md mx-auto w-full">
      <h2 className="text-3xl font-bold text-slate-100 mb-8 tracking-tight">Décodeur Gairaigo</h2>
      <div 
        className="bg-slate-800 border border-slate-700 rounded-[2rem] w-full p-10 text-center shadow-2xl cursor-pointer transition-transform active:scale-95" 
        onClick={() => setShowAnswer(true)}
      >
        <div className="text-5xl font-sans text-emerald-400 tracking-widest mb-8 drop-shadow-md">{currentWord.word}</div>
        
        {showAnswer ? (
          <div className="animate-fade-in space-y-4">
            <div className="text-2xl font-mono text-slate-300">{currentWord.romaji}</div>
            <div className="text-lg text-white font-medium bg-slate-700/50 py-2 px-4 rounded-lg inline-block">{currentWord.meaning}</div>
            <button 
              onClick={(e) => { e.stopPropagation(); nextWord(); }} 
              className="mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl w-full transition-colors"
            >
              Mot suivant
            </button>
          </div>
        ) : (
          <div className="text-slate-500 text-sm uppercase tracking-widest font-bold mt-12 animate-pulse">Touchez pour révéler</div>
        )}
      </div>
    </div>
  );
};