import { X, Volume2 } from 'lucide-react';
import { KanaEntry } from '../types';
import { speakJapanese } from '../utils/audio';
import { StrokeAnimatorCanvas } from './StrokeAnimatorCanvas';

interface Props {
  kana: KanaEntry;
  onClose: () => void;
}

export const KanaModal = ({ kana, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-slate-800/50 bg-slate-800/20">
          <h2 className="text-lg font-bold text-slate-100 tracking-wide">Détails du Kana</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-7xl font-sans text-indigo-400 mb-2 drop-shadow-md">{kana.kana}</div>
              <div className="text-2xl font-medium text-slate-300">{kana.romaji.join(', ')}</div>
            </div>
            <StrokeAnimatorCanvas strokes={kana.strokes} fallbackKana={kana.kana} />
          </div>
          
          <button 
            onClick={() => speakJapanese(kana.kana)}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white py-4 rounded-xl mb-8 transition-all font-bold text-lg shadow-lg shadow-indigo-900/20"
          >
            <Volume2 size={24} /> Écouter la prononciation
          </button>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3 flex items-center gap-2">Mnémonique</h3>
              <p className="text-slate-200 bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl leading-relaxed text-sm">{kana.mnemonic}</p>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Vocabulaire (Gojūon filtré)</h3>
              <div className="space-y-2">
                {kana.examples.map((ex, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-800/30 border border-slate-700/30 p-3 rounded-xl">
                    <div>
                      <div className="text-lg font-medium text-slate-100">{ex.word}</div>
                      <div className="text-xs font-mono text-indigo-300">{ex.romaji}</div>
                    </div>
                    <div className="text-right text-sm text-slate-400">{ex.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};