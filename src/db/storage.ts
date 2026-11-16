import { openDB, DBSchema } from 'idb';
import { SRSRecord } from '../types';

interface AppSettings {
  hapticEnabled: boolean;
  soundEnabled: boolean;
  defaultFont: string;
}

interface KanaMasteryDB extends DBSchema {
  srs: {
    key: string;
    value: SRSRecord;
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

const DB_NAME = 'KanaMasteryDB';
const DB_VERSION = 1;

export const getDB = async () => {
  return openDB<KanaMasteryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('srs')) {
        db.createObjectStore('srs', { keyPath: 'kanaId' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });
};

// Nouvelle fonction utilitaire pour assembler toutes les données
const getLocalSnapshot = async () => {
  const srs = await getAllSRSRecords();
  const settings = await getSettings();
  return { srs, settings, lastSync: new Date().toISOString() };
};

// --- GESTION SRS ---
export const getSRSRecord = async (kanaId: string): Promise<SRSRecord | undefined> => {
  const db = await getDB();
  return db.get('srs', kanaId);
};

export const saveSRSRecord = async (record: SRSRecord): Promise<void> => {
  const db = await getDB();
  await db.put('srs', record);
  
  // Nouvelle étape : Pousser la base de données entière vers le cloud
  const snapshot = await getLocalSnapshot();
  pushToCloud(snapshot);
};

export const getAllSRSRecords = async (): Promise<SRSRecord[]> => {
  const db = await getDB();
  return db.getAll('srs');
};

// --- GESTION PARAMÈTRES ---
export const getSettings = async (): Promise<AppSettings> => {
  const db = await getDB();
  const settings = await db.get('settings', 'user_prefs');
  return settings || { hapticEnabled: true, soundEnabled: true, defaultFont: 'Noto Sans JP' };
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  const db = await getDB();
  await db.put('settings', settings, 'user_prefs');
  
  // Nouvelle étape : Pousser la base de données entière vers le cloud
  const snapshot = await getLocalSnapshot();
  pushToCloud(snapshot);
};

// --- EXPORT / IMPORT JSON ---
export const exportData = async (): Promise<string> => {
  const srs = await getAllSRSRecords();
  const settings = await getSettings();
  const data = { srs, settings, exportDate: new Date().toISOString() };
  return JSON.stringify(data, null, 2);
};

export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);
    if (!data.srs || !data.settings) throw new Error('Format JSON invalide');
    
    const db = await getDB();
    const tx = db.transaction(['srs', 'settings'], 'readwrite');
    
    // Nettoyage et insertion
    await tx.objectStore('srs').clear();
    for (const record of data.srs) {
      await tx.objectStore('srs').put(record);
    }
    await tx.objectStore('settings').put(data.settings, 'user_prefs');
    
    await tx.done;
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'importation :', error);
    return false;
  }
};
// Pousser la base de données locale vers le cloud
export const pushToCloud = async (localData: any) => {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localData)
    });
    if (response.ok) {
      console.log("✅ Synchro Cloudflare réussie !");
    } else {
        console.error("⚠️ Échec de la synchro :", response.statusText);
    }
  } catch (error) {
    console.error("❌ Erreur de réseau vers le cloud :", error);
  }
};

// Récupérer la base de données du cloud
export const pullFromCloud = async () => {
  try {
    const response = await fetch('/api/sync');
    if (response.ok) {
      const cloudData = await response.json();
      // Vérification que les données ne sont pas vides
      if (Object.keys(cloudData).length > 0) {
          console.log("☁️ Données Cloudflare récupérées avec succès");
          return cloudData;
      }
    }
  } catch (error) {
    console.error("❌ Erreur de récupération cloud :", error);
  }
  return null;
};