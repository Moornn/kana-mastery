import { KanaEntry, ExampleWord, KanaType, KanaCategory } from '../types';

// Utilisation d'un tuple compressé pour alléger la taille du fichier en mémoire avant le parsing.
// Format: [id, type, category, group, kana, romaji_csv, mnemonic, confusable_csv, strokes_json, examples_json]
type CompressedKana = [string, string, string, string, string, string, string, string, string, string];

const rawData: CompressedKana[] = [
  // --- HIRAGANA ---
  // Ligne A
  ["h_a", "hiragana", "gojuon", "a", "あ", "a", "A majuscule stylisé avec une boucle.", "h_o,h_me", '["M28.6,37.1c2.1,0.6,4.4,0.6,6.6,0.4c10.3-1.1,22.8-3,31.3-4.1c2.3-0.3,4.4-0.5,6.6-0.1", "M46.3,17.5c1.2,1.2,1.5,2.5,1.5,4c0,14.6-1.3,37.4-11.6,51.3", "M64.5,33.5c3.8,5,5.8,11.5,4.3,19.5c-2.3,12-11.8,21.5-24.3,25.5c-4.8,1.5-9,1.5-12.8-0.5c-3.5-1.8-5-4.5-5-7.5c0-4.5,3.3-8.8,9-12.3c7.5-4.5,18.5-7.3,28.5-8.3c4.5-0.5,9.5-0.5,14,1"]', '[]'],
  ["h_i", "hiragana", "gojuon", "a", "い", "i", "Deux roseaux parallèles.", "h_ri", '["M27.25,28.75c1.62,1.62,2.38,3.62,2.38,6.25c0,14.5-2.12,32.62-11.88,43.25", "M65.75,32.5c1.38,1.38,1.75,2.88,1.75,5.12c0,7.38-1.12,18.75-2.75,24.62"]', '[]'],
  ["h_u", "hiragana", "gojuon", "a", "う", "u", "Une oreille (U).", "h_tsu", '["M39.75,16.25c4.12,1.75,8.88,4.75,11.25,7.75", "M26.25,43c2.75,1.12,5.25,1.38,8,0.75c9.25-2.12,17.25-3.88,27.5-6c4.62-0.96,6.38,1.75,5.25,5.25c-4.25,13.25-14.25,32.25-31.5,41.25"]', '[]'],
  ["h_e", "hiragana", "gojuon", "a", "え", "e", "Oiseau exotique sur une branche.", "h_n", '["M42.5,15c3.25,1.75,7.5,4.75,9.25,7.5", "M27.25,41c2.12,0.88,4.5,0.75,6.5,0.25c9.25-2.38,16.5-4.25,25.75-6.75c3.62-0.98,4.88,1.25,3,3.5c-7.38,8.88-15.5,17.5-23.75,26.25c-2.25,2.38-1.5,4.5,1.5,4.5c10.25,0,19.25-1.5,27.25-4.75"]', '[]'],
  ["h_o", "hiragana", "gojuon", "a", "お", "o", "Balle de golf sur un tee.", "h_a", '["M27.5,33.5c2.12,0.88,4.75,0.75,7.25,0.38c10.12-1.5,20.88-3.38,30.5-5.12c2.25-0.41,4.5-0.75,6.75-0.25", "M44.75,15.75c1.25,1.25,1.75,2.75,1.75,4.75c0,11.5-1.5,35.25-1.5,45.25c0,9.75-4.5,10.25-9.25,4.25c-3.12-3.93-4.5-7.5-3-12.75c2.38-8.25,9.25-18.75,20.75-24.5c7.38-3.69,15.5-3.5,21.5,1.75c5.38,4.71,6.5,12,3.5,18.75c-4.12,9.25-13,17.25-28,21", "M72.25,23.75c3.62,2.38,8.25,6.5,10,10.25"]', '[]'],
  // Ligne K
  ["h_ka", "hiragana", "gojuon", "k", "か", "ka", "Un danseur de Kamikaze.", "", "[]", "[]"],
  ["h_ki", "hiragana", "gojuon", "k", "き", "ki", "Une clé (Key).", "h_sa", "[]", "[]"],
  ["h_ku", "hiragana", "gojuon", "k", "く", "ku", "La bouche d'un coucou.", "", "[]", "[]"],
  ["h_ke", "hiragana", "gojuon", "k", "け", "ke", "Un tonneau (Keg).", "", "[]", "[]"],
  ["h_ko", "hiragana", "gojuon", "k", "こ", "ko", "Deux vers de terre (Coin).", "h_ni", "[]", "[]"],
  // Ligne S
  ["h_sa", "hiragana", "gojuon", "s", "さ", "sa", "Un sabre.", "h_ki,h_chi", "[]", "[]"],
  ["h_shi", "hiragana", "gojuon", "s", "し", "shi", "Une canne à pêche (Shi).", "h_mo", "[]", "[]"],
  ["h_su", "hiragana", "gojuon", "s", "す", "su", "Un ressort (Spring).", "h_mu", "[]", "[]"],
  ["h_se", "hiragana", "gojuon", "s", "せ", "se", "Une bouche qui sourit.", "k_se", "[]", "[]"],
  ["h_so", "hiragana", "gojuon", "s", "そ", "so", "Un Z avec un C.", "", "[]", "[]"],
  // Ligne T
  ["h_ta", "hiragana", "gojuon", "t", "た", "ta", "Un T et un A combinés.", "h_na", "[]", "[]"],
  ["h_chi", "hiragana", "gojuon", "t", "ち", "chi", "Un visage (Cheek).", "h_sa", "[]", "[]"],
  ["h_tsu", "hiragana", "gojuon", "t", "つ", "tsu", "Un tsunami.", "h_u", "[]", "[]"],
  ["h_te", "hiragana", "gojuon", "t", "て", "te", "Un T cassé.", "h_to", "[]", "[]"],
  ["h_to", "hiragana", "gojuon", "t", "と", "to", "Une épine dans un orteil (Toe).", "h_te", "[]", "[]"],
  // Ligne N
  ["h_na", "hiragana", "gojuon", "n", "な", "na", "Une nonne.", "h_ta", "[]", "[]"],
  ["h_ni", "hiragana", "gojuon", "n", "に", "ni", "Un genou (Knee).", "h_ko,h_ta", "[]", "[]"],
  ["h_nu", "hiragana", "gojuon", "n", "ぬ", "nu", "Des nouilles.", "h_me", "[]", "[]"],
  ["h_ne", "hiragana", "gojuon", "n", "ね", "ne", "Un chat (Neko).", "h_re,h_wa", "[]", "[]"],
  ["h_no", "hiragana", "gojuon", "n", "の", "no", "Un panneau NO.", "h_me", "[]", "[]"],
  // Ligne H
  ["h_ha", "hiragana", "gojuon", "h", "は", "ha", "Un H majuscule avec un ventre.", "h_ho,h_ke", "[]", "[]"],
  ["h_hi", "hiragana", "gojuon", "h", "ひ", "hi", "Un nez de hibou.", "", "[]", "[]"],
  ["h_fu", "hiragana", "gojuon", "h", "ふ", "fu,hu", "Le mont Fuji.", "", "[]", "[]"],
  ["h_he", "hiragana", "gojuon", "h", "へ", "he", "Une montagne (Heaven).", "k_he", "[]", "[]"],
  ["h_ho", "hiragana", "gojuon", "h", "ほ", "ho", "Ha avec un chapeau (Ho).", "h_ha", "[]", "[]"],
  // Ligne M
  ["h_ma", "hiragana", "gojuon", "m", "ま", "ma", "Un mât de bateau.", "h_yo", "[]", "[]"],
  ["h_mi", "hiragana", "gojuon", "m", "み", "mi", "Le nombre 21 (Mi).", "", "[]", "[]"],
  ["h_mu", "hiragana", "gojuon", "m", "む", "mu", "Une vache qui fait Meuh.", "h_su", "[]", "[]"],
  ["h_me", "hiragana", "gojuon", "m", "め", "me", "Un œil avec du mascara (Me).", "h_nu", "[]", "[]"],
  ["h_mo", "hiragana", "gojuon", "m", "も", "mo", "Un hameçon (More).", "h_shi", "[]", "[]"],
  // Ligne Y
  ["h_ya", "hiragana", "gojuon", "y", "や", "ya", "Un yak.", "", "[]", "[]"],
  ["h_yu", "hiragana", "gojuon", "y", "ゆ", "yu", "Un U-turn (Yu).", "", "[]", "[]"],
  ["h_yo", "hiragana", "gojuon", "y", "よ", "yo", "Un yoyo pendu.", "h_ma", "[]", "[]"],
  // Ligne R
  ["h_ra", "hiragana", "gojuon", "r", "ら", "ra", "Un lapin (Rabbit).", "h_chi", "[]", "[]"],
  ["h_ri", "hiragana", "gojuon", "r", "り", "ri", "Des rubans (Ribbons).", "h_i", "[]", "[]"],
  ["h_ru", "hiragana", "gojuon", "r", "る", "ru", "Une route avec une boucle.", "h_ro", "[]", "[]"],
  ["h_re", "hiragana", "gojuon", "r", "れ", "re", "Un homme qui se repose.", "h_ne,h_wa", "[]", "[]"],
  ["h_ro", "hiragana", "gojuon", "r", "ろ", "ro", "Une route barrée.", "h_ru", "[]", "[]"],
  // Ligne W & N
  ["h_wa", "hiragana", "gojuon", "w", "わ", "wa", "Une baguette magique.", "h_ne,h_re", "[]", "[]"],
  ["h_wo", "hiragana", "gojuon", "w", "を", "wo,o", "Un surfeur sur une vague.", "", "[]", "[]"],
  ["h_nn", "hiragana", "gojuon", "n", "ん", "n", "Un N majuscule écrit vite.", "", "[]", "[]"],

  // --- KATAKANA ---
  // Ligne A
  ["k_a", "katakana", "gojuon", "a", "ア", "a", "A majuscule brisé.", "k_ma", '["M28.75,27.5c2.12,0.88,4.75,0.62,7.25,0.25c9.62-1.38,20.62-3.88,29.75-5.5c3.25-0.58,5.12,0.5,3.75,3.5c-3.12,6.88-8.25,15.5-13.75,22.25", "M44.75,46.25c1.25,1.25,1.75,2.75,1.75,5c0,10-2.25,27.25-12,36.75"]', '[]'],
  ["k_i", "katakana", "gojuon", "a", "イ", "i", "Un I incliné.", "k_to", '["M38.75,17.75c1.25,1.25,1.5,2.88,1.25,4.75c-1.88,14.25-7.75,34.25-20.75,46.75", "M35.25,50.75c1.25,1.25,1.75,2.75,1.75,5c0,9.5-1.5,24.25-2.25,32.75"]', '[]'],
  ["k_u", "katakana", "gojuon", "a", "ウ", "u", "Un entonnoir.", "k_wa", '["M40.75,14.75c1.25,1.25,1.75,2.75,1.75,4.75c0,4-0.38,10.38-0.38,13", "M23.75,35.25c1.25,1.25,1.75,2.75,1.75,4.75c0,5.75-1,16.5-1.5,22", "M26.25,37.5c11.25-2,32.75-4.75,44.75-5.75c4.75-0.4,6.25,1.75,5.75,6.5c-1.5,14.25-5.75,34.25-25,47.25"]', '[]'],
  ["k_e", "katakana", "gojuon", "a", "エ", "e", "Une poutre (I-beam).", "k_ko", '["M29.25,28.25c2.12,0.88,4.75,0.75,7.25,0.25c9.25-1.75,20.25-3.5,31.75-4.75c2.25-0.25,4.5-0.5,6.75,0", "M51.25,28.25c1.25,1.25,1.75,2.75,1.75,4.75c0,9.5-1,31-1.5,41", "M21.25,76.5c3.25,1.25,7.25,1,10.75,0.5c11.25-1.62,28.25-3.5,43.25-4.25c3.62-0.18,7.25-0.25,10.75,0.5"]', '[]'],
  ["k_o", "katakana", "gojuon", "a", "オ", "o", "Un chanteur d'opéra.", "k_ho", '["M24.75,35.25c2.12,0.88,4.75,0.75,7.25,0.38c11.12-1.75,24.88-3.88,38.5-5.5c2.62-0.31,5.25-0.62,7.75-0.12", "M49.25,15.75c1.25,1.25,1.75,2.75,1.75,4.75c0,11.5-1.5,45.25-10.25,62.25", "M48.25,47c5,3.75,15,14,24.25,25"]', '[]'],
  // Ligne K
  ["k_ka", "katakana", "gojuon", "k", "カ", "ka", "Identique au Hiragana Ka sans le trait.", "k_chi", "[]", "[]"],
  ["k_ki", "katakana", "gojuon", "k", "キ", "ki", "Clé barrée.", "", "[]", "[]"],
  ["k_ku", "katakana", "gojuon", "k", "ク", "ku", "Bec de canard.", "k_ta,k_ke", "[]", "[]"],
  ["k_ke", "katakana", "gojuon", "k", "ケ", "ke", "Antenne de toit.", "k_ku", "[]", "[]"],
  ["k_ko", "katakana", "gojuon", "k", "コ", "ko", "Un coin (Corner).", "k_yu", "[]", "[]"],
  // Ligne S
  ["k_sa", "katakana", "gojuon", "s", "サ", "sa", "Trois sardines.", "", "[]", "[]"],
  ["k_shi", "katakana", "gojuon", "s", "シ", "shi", "Traits de bas en haut (sourire).", "k_tsu,k_n", "[]", "[]"],
  ["k_su", "katakana", "gojuon", "s", "ス", "su", "Un support.", "k_nu", "[]", "[]"],
  ["k_se", "katakana", "gojuon", "s", "セ", "se", "Identique au Hiragana Se.", "k_hi", "[]", "[]"],
  ["k_so", "katakana", "gojuon", "s", "ソ", "so", "Trait de haut en bas.", "k_n,k_shi", "[]", "[]"],
  // Ligne T
  ["k_ta", "katakana", "gojuon", "t", "タ", "ta", "Une tour.", "k_ku", "[]", "[]"],
  ["k_chi", "katakana", "gojuon", "t", "チ", "chi", "Pom-pom girl (Cheer).", "k_te", "[]", "[]"],
  ["k_tsu", "katakana", "gojuon", "t", "ツ", "tsu", "Traits de haut en bas.", "k_shi,k_so", "[]", "[]"],
  ["k_te", "katakana", "gojuon", "t", "テ", "te", "Téléphone ancien.", "k_chi", "[]", "[]"],
  ["k_to", "katakana", "gojuon", "t", "ト", "to", "Un totem.", "k_i", "[]", "[]"],
  // Ligne N
  ["k_na", "katakana", "gojuon", "n", "ナ", "na", "Une croix (Nut).", "k_me", "[]", "[]"],
  ["k_ni", "katakana", "gojuon", "n", "ニ", "ni", "Le chiffre 2 (Ni).", "k_ko", "[]", "[]"],
  ["k_nu", "katakana", "gojuon", "n", "ヌ", "nu", "Pince (Nutcracker).", "k_su", "[]", "[]"],
  ["k_ne", "katakana", "gojuon", "n", "ネ", "ne", "Nid d'oiseau.", "k_ho", "[]", "[]"],
  ["k_no", "katakana", "gojuon", "n", "ノ", "no", "Un long nez.", "k_me", "[]", "[]"],
  // Ligne H
  ["k_ha", "katakana", "gojuon", "h", "ハ", "ha", "Un chapeau pointu.", "", "[]", "[]"],
  ["k_hi", "katakana", "gojuon", "h", "ヒ", "hi", "Talon (Heel).", "", "[]", "[]"],
  ["k_fu", "katakana", "gojuon", "h", "フ", "fu,hu", "Un drapeau (Flag).", "k_nu", "[]", "[]"],
  ["k_he", "katakana", "gojuon", "h", "ヘ", "he", "Montagne (Identique Hiragana).", "", "[]", "[]"],
  ["k_ho", "katakana", "gojuon", "h", "ホ", "ho", "Une croix sainte (Holy).", "k_ne", "[]", "[]"],
  // Ligne M
  ["k_ma", "katakana", "gojuon", "m", "マ", "ma", "Une moustache.", "k_a", "[]", "[]"],
  ["k_mi", "katakana", "gojuon", "m", "ミ", "mi", "Trois missiles.", "k_shi", "[]", "[]"],
  ["k_mu", "katakana", "gojuon", "m", "ム", "mu", "Un bras musclé.", "k_ma", "[]", "[]"],
  ["k_me", "katakana", "gojuon", "m", "メ", "me", "Un X (Message).", "k_na", "[]", "[]"],
  ["k_mo", "katakana", "gojuon", "m", "モ", "mo", "Un moniteur TV.", "k_te", "[]", "[]"],
  // Ligne Y
  ["k_ya", "katakana", "gojuon", "y", "ヤ", "ya", "Un yacht.", "", "[]", "[]"],
  ["k_yu", "katakana", "gojuon", "y", "ユ", "yu", "Un crochet (U).", "k_ko", "[]", "[]"],
  ["k_yo", "katakana", "gojuon", "y", "ヨ", "yo", "Un râteau.", "k_ko", "[]", "[]"],
  // Ligne R
  ["k_ra", "katakana", "gojuon", "r", "ラ", "ra", "Radar.", "k_fu", "[]", "[]"],
  ["k_ri", "katakana", "gojuon", "r", "リ", "ri", "Rivière.", "h_ri", "[]", "[]"],
  ["k_ru", "katakana", "gojuon", "r", "ル", "ru", "Deux racines (Roots).", "k_re", "[]", "[]"],
  ["k_re", "katakana", "gojuon", "r", "レ", "re", "Une coche.", "k_ru", "[]", "[]"],
  ["k_ro", "katakana", "gojuon", "r", "ロ", "ro", "Un carré (Robot).", "k_ko", "[]", "[]"],
  // Ligne W & N
  ["k_wa", "katakana", "gojuon", "w", "ワ", "wa", "Une coupe de vin.", "k_u", "[]", "[]"],
  ["k_wo", "katakana", "gojuon", "w", "ヲ", "wo,o", "Wok sur le feu.", "k_te", "[]", "[]"],
  ["k_nn", "katakana", "gojuon", "n", "ン", "n", "Trait de bas en haut (sourire).", "k_so", "[]", "[]"]
];

const extraData: CompressedKana[] = [
  // --- HIRAGANA : DAKUTEN (Lignes G, Z, D, B) ---
  ["h_ga", "hiragana", "dakuten", "g", "が", "ga", "Ka + accent (Dakuten)", "", "[]", "[]"], ["h_gi", "hiragana", "dakuten", "g", "ぎ", "gi", "Ki + accent", "", "[]", "[]"], ["h_gu", "hiragana", "dakuten", "g", "ぐ", "gu", "Ku + accent", "", "[]", "[]"], ["h_ge", "hiragana", "dakuten", "g", "げ", "ge", "Ke + accent", "", "[]", "[]"], ["h_go", "hiragana", "dakuten", "g", "ご", "go", "Ko + accent", "", "[]", "[]"],
  ["h_za", "hiragana", "dakuten", "z", "ざ", "za", "Sa + accent", "", "[]", "[]"], ["h_ji", "hiragana", "dakuten", "z", "じ", "ji,zi", "Shi + accent", "", "[]", "[]"], ["h_zu", "hiragana", "dakuten", "z", "ず", "zu", "Su + accent", "", "[]", "[]"], ["h_ze", "hiragana", "dakuten", "z", "ぜ", "ze", "Se + accent", "", "[]", "[]"], ["h_zo", "hiragana", "dakuten", "z", "ぞ", "zo", "So + accent", "", "[]", "[]"],
  ["h_da", "hiragana", "dakuten", "d", "だ", "da", "Ta + accent", "", "[]", "[]"], ["h_dji", "hiragana", "dakuten", "d", "ぢ", "ji,di", "Chi + accent", "", "[]", "[]"], ["h_dzu", "hiragana", "dakuten", "d", "づ", "zu,du", "Tsu + accent", "", "[]", "[]"], ["h_de", "hiragana", "dakuten", "d", "で", "de", "Te + accent", "", "[]", "[]"], ["h_do", "hiragana", "dakuten", "d", "ど", "do", "To + accent", "", "[]", "[]"],
  ["h_ba", "hiragana", "dakuten", "b", "ば", "ba", "Ha + accent", "", "[]", "[]"], ["h_bi", "hiragana", "dakuten", "b", "び", "bi", "Hi + accent", "", "[]", "[]"], ["h_bu", "hiragana", "dakuten", "b", "ぶ", "bu", "Fu + accent", "", "[]", "[]"], ["h_be", "hiragana", "dakuten", "b", "べ", "be", "He + accent", "", "[]", "[]"], ["h_bo", "hiragana", "dakuten", "b", "ぼ", "bo", "Ho + accent", "", "[]", "[]"],
  
  // --- HIRAGANA : HANDAKUTEN (Ligne P) ---
  ["h_pa", "hiragana", "handakuten", "p", "ぱ", "pa", "Ha + petit rond (Handakuten)", "", "[]", "[]"], ["h_pi", "hiragana", "handakuten", "p", "ぴ", "pi", "Hi + petit rond", "", "[]", "[]"], ["h_pu", "hiragana", "handakuten", "p", "ぷ", "pu", "Fu + petit rond", "", "[]", "[]"], ["h_pe", "hiragana", "handakuten", "p", "ぺ", "pe", "He + petit rond", "", "[]", "[]"], ["h_po", "hiragana", "handakuten", "p", "ぽ", "po", "Ho + petit rond", "", "[]", "[]"],

  // --- KATAKANA : DAKUTEN & HANDAKUTEN ---
  ["k_ga", "katakana", "dakuten", "g", "ガ", "ga", "Ka + accent", "", "[]", "[]"], ["k_gi", "katakana", "dakuten", "g", "ギ", "gi", "Ki + accent", "", "[]", "[]"], ["k_gu", "katakana", "dakuten", "g", "グ", "gu", "Ku + accent", "", "[]", "[]"], ["k_ge", "katakana", "dakuten", "g", "ゲ", "ge", "Ke + accent", "", "[]", "[]"], ["k_go", "katakana", "dakuten", "g", "ゴ", "go", "Ko + accent", "", "[]", "[]"],
  ["k_za", "katakana", "dakuten", "z", "ザ", "za", "Sa + accent", "", "[]", "[]"], ["k_ji", "katakana", "dakuten", "z", "ジ", "ji,zi", "Shi + accent", "", "[]", "[]"], ["k_zu", "katakana", "dakuten", "z", "ズ", "zu", "Su + accent", "", "[]", "[]"], ["k_ze", "katakana", "dakuten", "z", "ゼ", "ze", "Se + accent", "", "[]", "[]"], ["k_zo", "katakana", "dakuten", "z", "ゾ", "zo", "So + accent", "", "[]", "[]"],
  ["k_da", "katakana", "dakuten", "d", "ダ", "da", "Ta + accent", "", "[]", "[]"], ["k_dji", "katakana", "dakuten", "d", "ヂ", "ji,di", "Chi + accent", "", "[]", "[]"], ["k_dzu", "katakana", "dakuten", "d", "ヅ", "zu,du", "Tsu + accent", "", "[]", "[]"], ["k_de", "katakana", "dakuten", "d", "デ", "de", "Te + accent", "", "[]", "[]"], ["k_do", "katakana", "dakuten", "d", "ド", "do", "To + accent", "", "[]", "[]"],
  ["k_ba", "katakana", "dakuten", "b", "バ", "ba", "Ha + accent", "", "[]", "[]"], ["k_bi", "katakana", "dakuten", "b", "ビ", "bi", "Hi + accent", "", "[]", "[]"], ["k_bu", "katakana", "dakuten", "b", "ブ", "bu", "Fu + accent", "", "[]", "[]"], ["k_be", "katakana", "dakuten", "b", "ベ", "be", "He + accent", "", "[]", "[]"], ["k_bo", "katakana", "dakuten", "b", "ボ", "bo", "Ho + accent", "", "[]", "[]"],
  ["k_pa", "katakana", "handakuten", "p", "パ", "pa", "Ha + petit rond", "", "[]", "[]"], ["k_pi", "katakana", "handakuten", "p", "ピ", "pi", "Hi + petit rond", "", "[]", "[]"], ["k_pu", "katakana", "handakuten", "p", "プ", "pu", "Fu + petit rond", "", "[]", "[]"], ["k_pe", "katakana", "handakuten", "p", "ペ", "pe", "He + petit rond", "", "[]", "[]"], ["k_po", "katakana", "handakuten", "p", "ポ", "po", "Ho + petit rond", "", "[]", "[]"],

  // --- SOKUON ET CHOUONPU (Petite pause et voyelle longue) ---
  ["h_soku", "hiragana", "sokuon", "pause", "っ", "pause,xtsu", "Double la consonne suivante", "", "[]", "[]"],
  ["k_soku", "katakana", "sokuon", "pause", "ッ", "pause,xtsu", "Double la consonne suivante", "", "[]", "[]"],
  ["k_chou", "katakana", "chouonpu", "long", "ー", "long", "Allonge la voyelle précédente", "", "[]", "[]"],
  
  // --- YŌON PRINCIPAUX (Combinaisons avec Ya, Yu, Yo) ---
  ["h_kya", "hiragana", "yoon", "ky", "きゃ", "kya", "ki + petit ya", "", "[]", "[]"], ["h_kyu", "hiragana", "yoon", "ky", "きゅ", "kyu", "ki + petit yu", "", "[]", "[]"], ["h_kyo", "hiragana", "yoon", "ky", "きょ", "kyo", "ki + petit yo", "", "[]", "[]"],
  ["h_sha", "hiragana", "yoon", "sh", "しゃ", "sha,sya", "shi + petit ya", "", "[]", "[]"], ["h_shu", "hiragana", "yoon", "sh", "しゅ", "shu,syu", "shi + petit yu", "", "[]", "[]"], ["h_sho", "hiragana", "yoon", "sh", "しょ", "sho,syo", "shi + petit yo", "", "[]", "[]"],
  ["h_cha", "hiragana", "yoon", "ch", "ちゃ", "cha,tya", "chi + petit ya", "", "[]", "[]"], ["h_chu", "hiragana", "yoon", "ch", "ちゅ", "chu,tyu", "chi + petit yu", "", "[]", "[]"], ["h_cho", "hiragana", "yoon", "ch", "ちょ", "cho,tyo", "chi + petit yo", "", "[]", "[]"],
  ["h_nya", "hiragana", "yoon", "ny", "にゃ", "nya", "ni + petit ya", "", "[]", "[]"], ["h_nyu", "hiragana", "yoon", "ny", "にゅ", "nyu", "ni + petit yu", "", "[]", "[]"], ["h_nyo", "hiragana", "yoon", "ny", "にょ", "nyo", "ni + petit yo", "", "[]", "[]"],
  
  ["k_kya", "katakana", "yoon", "ky", "キャ", "kya", "ki + petit ya", "", "[]", "[]"], ["k_kyu", "katakana", "yoon", "ky", "キュ", "kyu", "ki + petit yu", "", "[]", "[]"], ["k_kyo", "katakana", "yoon", "ky", "キョ", "kyo", "ki + petit yo", "", "[]", "[]"],
  ["k_sha", "katakana", "yoon", "sh", "シャ", "sha,sya", "shi + petit ya", "", "[]", "[]"], ["k_shu", "katakana", "yoon", "sh", "シュ", "shu,syu", "shi + petit yu", "", "[]", "[]"], ["k_sho", "katakana", "yoon", "sh", "ショ", "sho,syo", "shi + petit yo", "", "[]", "[]"],
  ["k_cha", "katakana", "yoon", "ch", "チャ", "cha,tya", "chi + petit ya", "", "[]", "[]"], ["k_chu", "katakana", "yoon", "ch", "チュ", "chu,tyu", "chi + petit yu", "", "[]", "[]"], ["k_cho", "katakana", "yoon", "ch", "チョ", "cho,tyo", "chi + petit yo", "", "[]", "[]"]
];

export const kanaExamples: Record<string, ExampleWord[]> = {
  // --- HIRAGANA (Vocabulaire à déblocage progressif) ---
  
  // Ligne A (Uniquement A, I, U, E, O)
  "h_a": [ { word: "あい", romaji: "ai", meaning: "amour" }, { word: "あお", romaji: "ao", meaning: "bleu" }, { word: "うえ", romaji: "ue", meaning: "dessus" } ],
  "h_i": [ { word: "いえ", romaji: "ie", meaning: "maison" }, { word: "いい", romaji: "ii", meaning: "bien" }, { word: "おい", romaji: "oi", meaning: "neveu" } ],
  "h_u": [ { word: "うお", romaji: "uo", meaning: "poisson" }, { word: "あう", romaji: "au", meaning: "rencontrer" } ],
  "h_e": [ { word: "え", romaji: "e", meaning: "dessin/peinture" }, { word: "ええ", romaji: "ee", meaning: "oui (familier)" } ],
  "h_o": [ { word: "おお", romaji: "oo", meaning: "beaucoup / oh" }, { word: "おおい", romaji: "ooi", meaning: "nombreux" } ],

  // Ligne K (+ A, I, U, E, O)
  "h_ka": [ { word: "あか", romaji: "aka", meaning: "rouge" }, { word: "かお", romaji: "kao", meaning: "visage" }, { word: "いか", romaji: "ika", meaning: "calmar" } ],
  "h_ki": [ { word: "きく", romaji: "kiku", meaning: "écouter" }, { word: "えき", romaji: "eki", meaning: "gare" }, { word: "いき", romaji: "iki", meaning: "souffle" } ],
  "h_ku": [ { word: "かく", romaji: "kaku", meaning: "écrire" }, { word: "こく", romaji: "koku", meaning: "pays (suffixe)" } ],
  "h_ke": [ { word: "いけ", romaji: "ike", meaning: "étang" }, { word: "け", romaji: "ke", meaning: "poil / cheveu" } ],
  "h_ko": [ { word: "こえ", romaji: "koe", meaning: "voix" }, { word: "ここ", romaji: "koko", meaning: "ici" }, { word: "かこ", romaji: "kako", meaning: "passé" } ],

  // Ligne S (+ Lignes A, K)
  "h_sa": [ { word: "あさ", romaji: "asa", meaning: "matin" }, { word: "かさ", romaji: "kasa", meaning: "parapluie" }, { word: "さけ", romaji: "sake", meaning: "alcool/saumon" } ],
  "h_shi": [ { word: "あし", romaji: "ashi", meaning: "pied/jambe" }, { word: "いし", romaji: "ishi", meaning: "pierre" }, { word: "うし", romaji: "ushi", meaning: "vache" } ],
  "h_su": [ { word: "すいか", romaji: "suika", meaning: "pastèque" }, { word: "すし", romaji: "sushi", meaning: "sushi" }, { word: "すき", romaji: "suki", meaning: "aimer" } ],
  "h_se": [ { word: "あせ", romaji: "ase", meaning: "sueur" }, { word: "せかい", romaji: "sekai", meaning: "monde" } ],
  "h_so": [ { word: "うそ", romaji: "uso", meaning: "mensonge" }, { word: "そこ", romaji: "soko", meaning: "là-bas" } ],

  // Ligne T (+ Lignes A, K, S)
  "h_ta": [ { word: "たこ", romaji: "tako", meaning: "pieuvre" }, { word: "うた", romaji: "uta", meaning: "chanson" }, { word: "した", romaji: "shita", meaning: "dessous" } ],
  "h_chi": [ { word: "ちち", romaji: "chichi", meaning: "père" }, { word: "くち", romaji: "kuchi", meaning: "bouche" }, { word: "いち", romaji: "ichi", meaning: "un" } ],
  "h_tsu": [ { word: "つくえ", romaji: "tsukue", meaning: "bureau" }, { word: "くつ", romaji: "kutsu", meaning: "chaussure" }, { word: "たつ", romaji: "tatsu", meaning: "se lever" } ],
  "h_te": [ { word: "て", romaji: "te", meaning: "main" }, { word: "ちかてつ", romaji: "chikatetsu", meaning: "métro" } ],
  "h_to": [ { word: "いと", romaji: "ito", meaning: "fil" }, { word: "おと", romaji: "oto", meaning: "son" }, { word: "とけい", romaji: "tokei", meaning: "montre" } ],

  // Ligne N
  "h_na": [ { word: "なに", romaji: "nani", meaning: "quoi" }, { word: "さかな", romaji: "sakana", meaning: "poisson" }, { word: "なつ", romaji: "natsu", meaning: "été" } ],
  "h_ni": [ { word: "にく", romaji: "niku", meaning: "viande" }, { word: "かに", romaji: "kani", meaning: "crabe" }, { word: "くに", romaji: "kuni", meaning: "pays" } ],
  "h_nu": [ { word: "いぬ", romaji: "inu", meaning: "chien" }, { word: "ぬの", romaji: "nuno", meaning: "tissu" } ],
  "h_ne": [ { word: "ねこ", romaji: "neko", meaning: "chat" }, { word: "かね", romaji: "kane", meaning: "argent" } ],
  "h_no": [ { word: "きのう", romaji: "kinou", meaning: "hier" }, { word: "たのしい", romaji: "tanoshii", meaning: "amusant" } ],

  // Ligne H
  "h_ha": [ { word: "はい", romaji: "hai", meaning: "oui" }, { word: "はは", romaji: "haha", meaning: "mère" }, { word: "はな", romaji: "hana", meaning: "fleur" } ],
  "h_hi": [ { word: "ひ", romaji: "hi", meaning: "feu/soleil" }, { word: "ひと", romaji: "hito", meaning: "personne" } ],
  "h_fu": [ { word: "ふね", romaji: "fune", meaning: "bateau" }, { word: "ふゆ", romaji: "fuyu", meaning: "hiver" } ],
  "h_he": [ { word: "へや", romaji: "heya", meaning: "chambre" }, { word: "へた", romaji: "heta", meaning: "maladroit" } ],
  "h_ho": [ { word: "ほし", romaji: "hoshi", meaning: "étoile" }, { word: "ほん", romaji: "hon", meaning: "livre" } ],

  // Ligne M
  "h_ma": [ { word: "まち", romaji: "machi", meaning: "ville" }, { word: "まど", romaji: "mado", meaning: "fenêtre" }, { word: "あたま", romaji: "atama", meaning: "tête" } ],
  "h_mi": [ { word: "みず", romaji: "mizu", meaning: "eau" }, { word: "みせ", romaji: "mise", meaning: "magasin" }, { word: "みみ", romaji: "mimi", meaning: "oreille" } ],
  "h_mu": [ { word: "むし", romaji: "mushi", meaning: "insecte" }, { word: "ねむい", romaji: "nemui", meaning: "somnolent" } ],
  "h_me": [ { word: "め", romaji: "me", meaning: "œil" }, { word: "あめ", romaji: "ame", meaning: "pluie" } ],
  "h_mo": [ { word: "もの", romaji: "mono", meaning: "chose" }, { word: "もも", romaji: "momo", meaning: "pêche" } ],

  // Ligne Y, R, W, N
  "h_ya": [ { word: "やま", romaji: "yama", meaning: "montagne" }, { word: "やさい", romaji: "yasai", meaning: "légume" } ],
  "h_yu": [ { word: "ゆき", romaji: "yuki", meaning: "neige" }, { word: "ふゆ", romaji: "fuyu", meaning: "hiver" } ],
  "h_yo": [ { word: "よる", romaji: "yoru", meaning: "nuit" }, { word: "よむ", romaji: "yomu", meaning: "lire" } ],
  "h_ra": [ { word: "さくら", romaji: "sakura", meaning: "cerisier" }, { word: "そら", romaji: "sora", meaning: "ciel" } ],
  "h_ri": [ { word: "とり", romaji: "tori", meaning: "oiseau" }, { word: "くすり", romaji: "kusuri", meaning: "médicament" } ],
  "h_ru": [ { word: "くるま", romaji: "kuruma", meaning: "voiture" }, { word: "はる", romaji: "haru", meaning: "printemps" } ],
  "h_re": [ { word: "だれ", romaji: "dare", meaning: "qui" }, { word: "きれい", romaji: "kirei", meaning: "beau/propre" } ],
  "h_ro": [ { word: "くろ", romaji: "kuro", meaning: "noir" }, { word: "しろ", romaji: "shiro", meaning: "blanc" } ],
  "h_wa": [ { word: "わたし", romaji: "watashi", meaning: "moi" }, { word: "かわ", romaji: "kawa", meaning: "rivière" } ],
  "h_nn": [ { word: "ほん", romaji: "hon", meaning: "livre" }, { word: "てんき", romaji: "tenki", meaning: "météo" }, { word: "さん", romaji: "san", meaning: "trois" } ],

  // --- KATAKANA (Mots d'emprunt courants - Gairaigo) ---
  "k_a": [ { word: "アイス", romaji: "aisu", meaning: "glace" }, { word: "アジア", romaji: "ajia", meaning: "Asie" } ],
  "k_i": [ { word: "インク", romaji: "inku", meaning: "encre" }, { word: "インド", romaji: "indo", meaning: "Inde" } ],
  "k_u": [ { word: "ウイルス", romaji: "uirusu", meaning: "virus" }, { word: "ウール", romaji: "uuru", meaning: "laine" } ],
  "k_e": [ { word: "エンジン", romaji: "enjin", meaning: "moteur" }, { word: "エレベーター", romaji: "erebeetaa", meaning: "ascenseur" } ],
  "k_o": [ { word: "オイル", romaji: "oiru", meaning: "huile" }, { word: "オレンジ", romaji: "orenji", meaning: "orange" } ],
  "k_ka": [ { word: "カメラ", romaji: "kamera", meaning: "caméra" }, { word: "カレー", romaji: "karee", meaning: "curry" } ],
  "k_ki": [ { word: "ギター", romaji: "gitaa", meaning: "guitare" }, { word: "キロ", romaji: "kiro", meaning: "kilo" } ],
  "k_ku": [ { word: "クラス", romaji: "kurasu", meaning: "classe" }, { word: "クラブ", romaji: "kurabu", meaning: "club" } ],
  "k_ke": [ { word: "ケーキ", romaji: "keeki", meaning: "gâteau" }, { word: "ケース", romaji: "keesu", meaning: "boîte/cas" } ],
  "k_ko": [ { word: "コーヒー", romaji: "koohii", meaning: "café" }, { word: "コート", romaji: "kooto", meaning: "manteau" } ],
  "k_sa": [ { word: "サラダ", romaji: "sarada", meaning: "salade" }, { word: "サッカー", romaji: "sakkaa", meaning: "football" } ],
  "k_shi": [ { word: "シャツ", romaji: "shatsu", meaning: "chemise" }, { word: "システム", romaji: "shisutemu", meaning: "système" } ],
  "k_su": [ { word: "スープ", romaji: "suupu", meaning: "soupe" }, { word: "スポーツ", romaji: "supootsu", meaning: "sport" } ],
  "k_se": [ { word: "セーター", romaji: "seetaa", meaning: "pull" }, { word: "センター", romaji: "sentaa", meaning: "centre" } ],
  "k_so": [ { word: "ソファ", romaji: "sofa", meaning: "canapé" }, { word: "ソフト", romaji: "sofuto", meaning: "logiciel" } ],
  "k_ta": [ { word: "タクシー", romaji: "takushii", meaning: "taxi" }, { word: "タオル", romaji: "taoru", meaning: "serviette" } ],
  "k_chi": [ { word: "チーム", romaji: "chiimu", meaning: "équipe" }, { word: "チーズ", romaji: "chiizu", meaning: "fromage" } ],
  "k_tsu": [ { word: "ツアー", romaji: "tsuaa", meaning: "tournée" }, { word: "シャツ", romaji: "shatsu", meaning: "chemise" } ],
  "k_te": [ { word: "テスト", romaji: "tesuto", meaning: "test" }, { word: "テレビ", romaji: "terebi", meaning: "télévision" } ],
  "k_to": [ { word: "トマト", romaji: "tomato", meaning: "tomate" }, { word: "トイレ", romaji: "toire", meaning: "toilettes" } ],
  "k_na": [ { word: "ナイフ", romaji: "naifu", meaning: "couteau" }, { word: "バナナ", romaji: "banana", meaning: "banane" } ],
  "k_ni": [ { word: "ニュース", romaji: "nyuusu", meaning: "actualités" }, { word: "テニス", romaji: "tenisu", meaning: "tennis" } ],
  "k_nu": [ { word: "カヌー", romaji: "kanuu", meaning: "canoë" } ],
  "k_ne": [ { word: "ネクタイ", romaji: "nekutai", meaning: "cravate" }, { word: "ネット", romaji: "netto", meaning: "réseau" } ],
  "k_no": [ { word: "ノート", romaji: "nooto", meaning: "cahier" }, { word: "ピアノ", romaji: "piano", meaning: "piano" } ]
};

export const gairaigoList: ExampleWord[] = [
  { word: "テレビ", romaji: "terebi", meaning: "télévision" },
  { word: "スマートフォン", romaji: "sumaatofon", meaning: "smartphone" },
  { word: "コーヒー", romaji: "koohii", meaning: "café" },
  { word: "コンピュータ", romaji: "konpyuuta", meaning: "ordinateur" },
  { word: "インターネット", romaji: "intaanetto", meaning: "internet" },
  { word: "カメラ", romaji: "kamera", meaning: "caméra/appareil photo" },
  { word: "コンビニ", romaji: "konbini", meaning: "supérette (convenience store)" },
  { word: "レストラン", romaji: "resutoran", meaning: "restaurant" }
];

// FUSION DES DONNÉES VECTORIELLES
const fullData = [...rawData, ...extraData];

// HYDRATATION CROISÉE AVEC LE DICTIONNAIRE
export const kanaDatabase: KanaEntry[] = fullData.map(row => ({
  id: row[0],
  type: row[1] as KanaType,
  category: row[2] as KanaCategory,
  group: row[3],
  kana: row[4],
  romaji: row[5].split(','),
  mnemonic: row[6],
  confusables: row[7] ? row[7].split(',') : [],
  strokes: JSON.parse(row[8]),
  examples: kanaExamples[row[0]] || [] 
}));

// Utilitaires de récupération rapide
export const getKanaById = (id: string): KanaEntry | undefined => kanaDatabase.find(k => k.id === id);
export const getKanaByType = (type: KanaType): KanaEntry[] => kanaDatabase.filter(k => k.type === type);
export const getConfusablesFor = (id: string): KanaEntry[] => {
  const kana = getKanaById(id);
  if (!kana) return [];
  return kana.confusables.map(confId => getKanaById(confId)).filter((k): k is KanaEntry => k !== undefined);
};