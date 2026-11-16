import { useState, useEffect } from 'react';
import { BookOpen, LayoutGrid, Type } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { KanaGrid } from './components/KanaGrid';
import { QuizEngine } from './components/QuizEngine';
import { KatakanaDecoder } from './components/KatakanaDecoder';
import { kanaDatabase } from './data/kanaData';
import { getSettings } from './db/storage';

type ViewState = 'dashboard' | 'hiragana' | 'katakana' | 'quiz' | 'decoder';
type QuizMode = 'recognition' | 'audio' | 'timeAttack';

export default function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [quizMode, setQuizMode] = useState<QuizMode>('recognition');
  const [settings, setSettings] = useState({ hapticEnabled: true, soundEnabled: true, defaultFont: 'Noto Sans JP' });

  useEffect(() => {
    getSettings().then(setSettings);
  }, [view]); // Recharge les settings quand on change de vue

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans selection:bg-indigo-500/30">
      
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {view === 'dashboard' && (
          <Dashboard 
            onStartQuiz={(mode) => { setQuizMode(mode as QuizMode); setView('quiz'); }} 
            onOpenDecoder={() => setView('decoder')}
          />
        )}
        {view === 'hiragana' && <KanaGrid type="hiragana" />}
        {view === 'katakana' && <KanaGrid type="katakana" />}
        {view === 'decoder' && <KatakanaDecoder />}
        {view === 'quiz' && (
          <QuizEngine 
            kanas={kanaDatabase} // Le tri par date SRS s'effectue idéalement ici avant de passer la prop
            mode={quizMode} 
            onComplete={() => setView('dashboard')}
            settings={settings}
          />
        )}
      </main>

      {/* Navigation Mobile Native Bottom Bar */}
      {view !== 'quiz' && view !== 'decoder' && (
        <nav className="fixed bottom-0 w-full bg-slate-950/85 backdrop-blur-xl border-t border-slate-800 pb-safe z-40">
          <div className="flex justify-around items-center p-2 max-w-md mx-auto">
            <button onClick={() => setView('dashboard')} className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all ${view === 'dashboard' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}>
              <BookOpen size={24} />
              <span className="text-[10px] mt-1.5 font-bold uppercase tracking-widest">Accueil</span>
            </button>
            <button onClick={() => setView('hiragana')} className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all ${view === 'hiragana' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}>
              <Type size={24} />
              <span className="text-[10px] mt-1.5 font-bold uppercase tracking-widest">Hiragana</span>
            </button>
            <button onClick={() => setView('katakana')} className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all ${view === 'katakana' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}>
              <LayoutGrid size={24} />
              <span className="text-[10px] mt-1.5 font-bold uppercase tracking-widest">Katakana</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}