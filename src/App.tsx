import { useState, useEffect } from 'react';
import { BookOpen, LayoutGrid, Type } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { KanaGrid } from './components/KanaGrid';
import { QuizEngine } from './components/QuizEngine';
import { KatakanaDecoder } from './components/KatakanaDecoder';
import { kanaDatabase } from './data/kanaData';
import { getSettings, pullFromCloud, importData, getAllSRSRecords } from './db/storage';
import { KanaEntry } from './types'; 

type ViewState = 'dashboard' | 'hiragana' | 'katakana' | 'quiz' | 'decoder';
type QuizMode = 'recognition' | 'audio' | 'timeAttack';

export default function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [quizMode, setQuizMode] = useState<QuizMode>('recognition');
  const [settings, setSettings] = useState({ hapticEnabled: true, soundEnabled: true, defaultFont: 'Noto Sans JP' });
  
  // État pour bloquer l'affichage tant que la synchro cloud n'est pas terminée
  const [isSyncing, setIsSyncing] = useState(true);
  const [sessionKanas, setSessionKanas] = useState<KanaEntry[]>([]);

  const handleStartQuiz = async (mode: QuizMode) => {
    // 1. Lire la mémoire locale
    const records = await getAllSRSRecords();
    const now = new Date().getTime();
    
    // 2. Identifier les Kanas dus pour une révision
    const studiedIds = records.map(r => r.kanaId);
    const dueIds = records
      .filter(r => new Date(r.nextReview).getTime() <= now)
      .map(r => r.kanaId);
      
    const dueKanas = kanaDatabase.filter(k => dueIds.includes(k.id));
    
    // 3. Identifier les Kanas jamais étudiés
    const newKanas = kanaDatabase.filter(k => !studiedIds.includes(k.id));
    
    // 4. Créer la liste (Priorité aux révisions, on bouche les trous avec des nouveaux)
    // QuizEngine se chargera de couper cette liste à 20 items maximum
    const kanasForThisSession = [...dueKanas, ...newKanas];
    
    setSessionKanas(kanasForThisSession);
    setQuizMode(mode);
    setView('quiz');
  };

  // 1. Démarrage et Synchronisation Cloud
  useEffect(() => {
    const syncAtStartup = async () => {
      setIsSyncing(true);
      const cloudData = await pullFromCloud();
      
      // Si on a récupéré des données valides du cloud, on écrase la base locale
      if (cloudData && cloudData.srs && cloudData.settings) {
        await importData(JSON.stringify(cloudData));
      }
      
      // On charge les paramètres finaux (cloud ou locaux)
      const currentSettings = await getSettings();
      setSettings(currentSettings);
      setIsSyncing(false);
    };
    
    syncAtStartup();
  }, []); // Ce bloc ne roule qu'une seule fois au chargement de l'app

  // 2. Recharger les paramètres quand on change de vue (si on n'est pas en pleine synchro)
  useEffect(() => {
    if (!isSyncing) {
      getSettings().then(setSettings);
    }
  }, [view, isSyncing]);

  // Écran de chargement pendant la synchronisation initiale
  if (isSyncing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Synchronisation Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans selection:bg-indigo-500/30">
      
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {view === 'dashboard' && (
          <Dashboard 
            onStartQuiz={handleStartQuiz} 
            onOpenDecoder={() => setView('decoder')}
          />
        )}
        {view === 'hiragana' && <KanaGrid type="hiragana" />}
        {view === 'katakana' && <KanaGrid type="katakana" />}
        {view === 'decoder' && <KatakanaDecoder />}
        {view === 'quiz' && (
          <QuizEngine 
            kanas={sessionKanas}
            mode={quizMode} 
            onComplete={() => setView('dashboard')}
            onClose={() => setView('dashboard')} 
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