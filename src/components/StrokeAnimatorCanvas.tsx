import { useState, useEffect } from 'react';

interface Props {
  strokes: string[];
  fallbackKana: string;
}

export const StrokeAnimatorCanvas = ({ strokes, fallbackKana }: Props) => {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Si on n'a pas encore les coordonnées vectorielles pour ce Kana
  if (!strokes || strokes.length === 0) {
    return (
      <div className="relative w-32 h-32 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center shadow-inner">
        <span className="text-7xl text-slate-400 font-sans opacity-40">{fallbackKana}</span>
        <div className="absolute bottom-1 right-0 left-0 text-center text-[9px] uppercase font-bold text-slate-500">Tracé à venir</div>
      </div>
    );
  }

  const playAnimation = () => {
    setIsAnimating(true);
    setCurrentStroke(0);
  };

  useEffect(() => {
    if (!isAnimating) return;
    if (currentStroke < strokes.length) {
      const timer = setTimeout(() => setCurrentStroke(prev => prev + 1), 800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [currentStroke, isAnimating, strokes.length]);

  return (
    <div 
      className="relative w-32 h-32 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden shadow-inner" 
      onClick={playAnimation}
    >
      <svg viewBox="0 0 109 109" className="w-full h-full">
        {strokes.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="none"
            stroke={index < currentStroke || !isAnimating ? "#818cf8" : "#334155"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: index === currentStroke - 1 && isAnimating ? 300 : 0,
              strokeDashoffset: index === currentStroke - 1 && isAnimating ? 300 : 0,
              animation: index === currentStroke - 1 && isAnimating ? "dash 0.8s linear forwards" : "none"
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      {!isAnimating && <div className="absolute bottom-1 right-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">▶ Animer</div>}
    </div>
  );
};