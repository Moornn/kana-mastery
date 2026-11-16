import { useState } from 'react';
import { KanaType, KanaEntry } from '../types';
import { getKanaByType } from '../data/kanaData';
import { KanaModal } from './KanaModal';

export const KanaGrid = ({ type }: { type: KanaType }) => {
  const [selectedKana, setSelectedKana] = useState<KanaEntry | null>(null);
  const kanas = getKanaByType(type);
  const groups = Array.from(new Set(kanas.map(k => k.group)));

  return (
    <div className="p-4 w-full max-w-2xl mx-auto pb-24 animate-fade-in">
      {groups.map(group => (
        <div key={group} className="mb-6">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">Ligne {group.toUpperCase()}</h3>
          <div className="grid grid-cols-5 gap-3">
            {kanas.filter(k => k.group === group).map(kana => (
              <button
                key={kana.id}
                onClick={() => setSelectedKana(kana)}
                className="aspect-square bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90"
              >
                <span className="text-3xl text-slate-100 font-sans mb-1">{kana.kana}</span>
                <span className="text-[10px] font-mono text-slate-400">{kana.romaji[0]}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      {selectedKana && <KanaModal kana={selectedKana} onClose={() => setSelectedKana(null)} />}
    </div>
  );
};