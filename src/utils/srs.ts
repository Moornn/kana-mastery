import { SRSRecord } from '../types';

// Qualité de réponse : 
// 0: Blackout, 1: Faux mais familier, 2: Faux (après réflexion), 
// 3: Difficile, 4: Bon, 5: Parfait

export const calculateNextReview = (
  kanaId: string, 
  quality: number, 
  previousRecord?: SRSRecord
): SRSRecord => {
  let easeFactor = previousRecord ? previousRecord.level : 2.5; // "level" sert d'Ease Factor
  let interval = 0; // en jours
  let streak = previousRecord ? previousRecord.history.filter(Boolean).length : 0;

  if (quality >= 3) {
    // Bonne réponse
    if (streak === 0) interval = 1;
    else if (streak === 1) interval = 6;
    else interval = Math.round((previousRecord?.nextReviewDate ? streak * easeFactor : 1) * easeFactor);
    streak++;
  } else {
    // Mauvaise réponse : réinitialisation de la séquence
    streak = 0;
    interval = 1;
  }

  // Ajustement de l'Ease Factor (algorithme SM-2)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    kanaId,
    level: parseFloat(easeFactor.toFixed(2)),
    nextReviewDate: nextDate.getTime(),
    history: [...(previousRecord?.history || []), quality >= 3]
  };
};