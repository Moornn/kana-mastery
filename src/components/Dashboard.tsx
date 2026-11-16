import React, { useState, useEffect } from 'react';
import { Settings, Play, Brain, Download, Upload, X, Clock } from 'lucide-react';
import { exportData, importData, getSettings, saveSettings, getAllSRSRecords } from '../db/storage';
    
export const Dashboard = ({ onStartQuiz, onOpenDecoder }: { onStartQuiz: (m: string) => void, onOpenDecoder: () => void }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState({ dueReviews: 0, streak: 0 });
  const [settings, setLocalSettings] = useState({ hapticEnabled: true, soundEnabled: true, defaultFont: 'Noto Sans JP' });

  useEffect(() => {
    getSettings().then(setLocalSettings);
    getAllSRSRecords().then(records => {
      const due = records.filter(r => r.nextReviewDate <= Date.now()).length;
      setStats({ dueReviews: due, streak: 0 });
    });
  }, []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (await importData(event.target?.result as string)) window.location.reload();
    };
    reader.readAsText(file);
  };

  const handleExport = async () => {
    const data = await exportData();
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `kana-mastery-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="p-6 max-w-md mx-auto w-full pt-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Kana Mastery</h1>
          <p className="text-slate-400 mt-1">Prêt pour ta session ?</p>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-3 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 transition-colors"><Settings size={24} /></button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
          <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">À réviser</div>
          <div className="text-4xl font-bold text-indigo-400">{stats.dueReviews}</div>
        </div>
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
          <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Série</div>
          <div className="text-4xl font-bold text-orange-400">{stats.streak} <span className="text-base font-normal text-slate-500">j</span></div>
        </div>
      </div>

      <div className="space-y-4">
        <button onClick={() => onStartQuiz('recognition')} className="w-full flex items-center p-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-2xl transition-all font-bold text-lg shadow-lg shadow-indigo-900/20">
          <Play className="mr-4" size={24} fill="currentColor" /> Répétition Espacée
        </button>
        <button onClick={() => onStartQuiz('timeAttack')} className="w-full flex items-center p-5 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-800/50 active:scale-95 text-rose-100 rounded-2xl transition-all font-bold text-lg">
          <Clock className="mr-4 text-rose-400" size={24} /> Contre-la-montre (60s)
        </button>
        <button onClick={onOpenDecoder} className="w-full flex items-center p-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 text-white rounded-2xl transition-all font-bold text-lg">
          <Brain className="mr-4 text-emerald-400" size={24} /> Décodeur Gairaigo
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 pb-8 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-100">Réglages</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 bg-slate-800 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="space-y-6 mb-8">
              <label className="flex items-center justify-between text-slate-200 font-medium">
                <span>Sons de validation</span>
                <input type="checkbox" checked={settings.soundEnabled} onChange={e => { const s = {...settings, soundEnabled: e.target.checked}; setLocalSettings(s); saveSettings(s); }} className="w-6 h-6 accent-indigo-500 rounded" />
              </label>
              <label className="flex items-center justify-between text-slate-200 font-medium">
                <span>Retours haptiques</span>
                <input type="checkbox" checked={settings.hapticEnabled} onChange={e => { const s = {...settings, hapticEnabled: e.target.checked}; setLocalSettings(s); saveSettings(s); }} className="w-6 h-6 accent-indigo-500 rounded" />
              </label>
              <label className="flex flex-col text-slate-200 font-medium gap-3 pt-2">
                <span>Défi Typographique (Police)</span>
                <select value={settings.defaultFont} onChange={e => { const s = {...settings, defaultFont: e.target.value}; setLocalSettings(s); saveSettings(s); }} className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-slate-100 outline-none focus:border-indigo-500 w-full">
                  <option value="Noto Sans JP">Noto Sans JP (Standard)</option>
                  <option value="Noto Serif JP">Noto Serif JP (Classique)</option>
                  <option value="Klee One">Klee One (Manuscrit)</option>
                  <option value="Yuji Syuku">Yuji Syuku (Pinceau)</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800">
              <button onClick={handleExport} className="flex flex-col items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-xl font-medium">
                <Download size={20} /> Exporter .json
              </button>
              <label className="flex flex-col items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-xl font-medium cursor-pointer">
                <Upload size={20} /> Importer .json
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};