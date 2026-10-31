import { etappenFeierId, etappenListe } from "@/data/etappen";
import {
  GEBURTSDATUM,
  PHASEN,
  aktuelleWoche,
  datumFuerWoche,
  formatDatum,
  phaseFuerWoche,
} from "@/data/lebenslinie";
import { LEVELS, STORAGE_KEYS, isoTag, mottoFuerWoche } from "@/data/wahrnehmung";
import { datumPlusTage, kalendertage, mitternacht, montagDerWoche } from "@/lib/heute";

export type Feier =
  | { id: string; art: "zehner"; text: string }
  | { id: string; art: "etappe"; emoji: string; titel: string; datumText: string; heute: boolean }
  | { id: string; art: "medaille"; naechte: number }
  | { id: string; art: "geschenk"; motto: string; tipp: string }
  | {
      id: string;
      art: "level";
      nr: number;
      titel: string;
      emoji: string;
      phasenName: string;
      rueckblick: string[];
    }
  | {
      id: string;
      art: "phase";
      neuePhase: string;
      altePhase: string;
      emoji: string;
      rueckblick: string[];
    }
  | { id: string; art: "mini"; satz: string };

export type FeierSpeicher = {
  gezeigt: string[];
  letztesOeffnen: string | null;
};

const MINI_SAETZE = [
  "Heute reicht eine ruhige Umarmung.",
  "Ihr müsst heute nichts perfekt machen. Zusammen sein zählt.",
  "Ein vertrautes Gesicht ist für ein Baby oft das schönste Bild.",
  "Viele Babys lächeln ungefähr ab der sechsten Woche zurück, jedes in seinem Tempo.",
  "Haut an Haut kann den Atem beruhigen, bei euch beiden.",
  "Gähnen, Fäustchen oder Wegschauen heißen oft: kurze Pause, bitte.",
  "Ein Schlaflied, das immer gleich klingt, wird mit der Zeit zu einem sicheren Ort.",
  "Babys erkennen die Stimmen der Eltern meist schon in den ersten Wochen.",
  "Kurze Wachphasen sind kein Rückschritt. So lernt das Baby die Welt in Häppchen.",
  "Ein Spaziergang an der frischen Luft tut oft euch beiden gut.",
  "Ein kleines Glucksen ist schon ein Gespräch.",
  "Die eigenen Hände zu entdecken dauert Wochen, und jedes Mal ist es neu.",
  "Ein dunkler, ruhiger Abend hilft vielen Babys, anzukommen.",
  "Um Hilfe bitten ist Fürsorge. Ihr dürft das.",
  "Ein Blick in die Augen wiegt mehr als eine aufgeräumte Wohnung.",
  "Viele Kinder drehen sich irgendwann zwischen dem vierten und sechsten Monat, manche früher, manche später.",
  "Brabbeln ist schon Sprache: Laute ausprobieren, ganz ohne Zeitplan.",
  "Wiederholung ist für Babys kein Leerlauf, sondern Sicherheit.",
  "Eine warme Mahlzeit für euch ist auch Fürsorge für das Baby.",
  "Kuckuck-Spiele werden spannend, wenn Dinge auch unsichtbar da bleiben, oft gegen Ende des ersten Jahres.",
  "Greifen übt sich in vielen kleinen Versuchen, nicht an einem einzigen Tag.",
  "Euer Geruch ist für das Baby ein Zuhause.",
  "Ein ruhiger Moment zu zweit, wenn er sich ergibt, füllt die Kraft für morgen.",
  "In den ersten Monaten schlafen Babys oft in kurzen Abschnitten. Das ist typisch.",
  "Jede Phase hat ein Ende, und ihr geht sie zusammen.",
  "Ein Lied, das ihr immer gleich singt, wird zum Anker am Abend.",
  "Neugier auf den Löffel zeigt sich bei vielen Babys um den sechsten Monat, ohne festen Fahrplan.",
  "Wenn der Tag laut war, darf der Abend leise sein.",
  "Ihr seid schon ein Team, auch an Tagen, die sich lang anfühlen.",
  "Langsam wiegen beruhigt oft mehr als schnelles Schaukeln.",
] as const;

function hashText(wert: string): number {
  let hash = 2166136261;
  for (let i = 0; i < wert.length; i++) {
    hash ^= wert.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function parseIso(wert: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(wert)) return null;
  const teile = wert.split("-");
  const jahr = Number(teile[0]);
  const monat = Number(teile[1]);
  const tag = Number(teile[2]);
  const datum = new Date(jahr, monat - 1, tag);
  if (datum.getFullYear() !== jahr || datum.getMonth() !== monat - 1 || datum.getDate() !== tag) {
    return null;
  }
  return datum;
}

function imFenster(datum: Date, letztes: Date | null, heute: Date): boolean {
  if (kalendertage(datum, heute) > 0) return false;
  if (letztes === null) return kalendertage(datum, heute) === 0;
  return kalendertage(datum, letztes) > 0;
}

function zehnerText(naechte: number): string {
  return naechte === 10 ? "10 Nächte zusammen erlebt!" : "Wieder 10 Nächte zusammen erlebt!";
}

export function verdienteRunden(naechte: number): number[] {
  const liste: number[] = [];
  for (let n = 100; n <= naechte; n += 50) liste.push(n);
  return liste;
}

export function feiernLaden(): FeierSpeicher {
  const leer: FeierSpeicher = { gezeigt: [], letztesOeffnen: null };
  if (typeof localStorage === "undefined") return leer;
  try {
    const roh = localStorage.getItem(STORAGE_KEYS.feiern);
    if (!roh) return leer;
    const daten = JSON.parse(roh) as { gezeigt?: unknown; letztesOeffnen?: unknown };
    const gezeigt = Array.isArray(daten.gezeigt)
      ? daten.gezeigt.filter((eintrag): eintrag is string => typeof eintrag === "string")
      : [];
    const letztesOeffnen = typeof daten.letztesOeffnen === "string" ? daten.letztesOeffnen : null;
    return { gezeigt, letztesOeffnen };
  } catch {
    return leer;
  }
}

export function feiernZuruecksetzen(): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.feiern,
      JSON.stringify({ gezeigt: [], letztesOeffnen: null }),
    );
  } catch {
    /* privater Modus */
  }
}

export function feiernMerken(ids: readonly string[], heute: Date): void {
  const alt = feiernLaden();
  const gezeigt = [...new Set([...alt.gezeigt, ...ids])];
  try {
    localStorage.setItem(
      STORAGE_KEYS.feiern,
      JSON.stringify({ gezeigt, letztesOeffnen: isoTag(mitternacht(heute)) }),
    );
  } catch {
    /* privater Modus */
  }
}

/**
 * Feiern seit dem letzten Öffnen.
 * Beim allerersten Öffnen bleiben vergangene Etappen stumm und werden nur als gezeigt gemerkt.
 */
export function offeneFeiern(input: {
  heute: Date;
  letztesOeffnen: string | null;
  gezeigt: readonly string[];
}): { feiern: Feier[]; still: string[] } {
  const heute = mitternacht(input.heute);
  const heuteTag = isoTag(heute);
  if (input.letztesOeffnen === heuteTag) return { feiern: [], still: [] };

  const letztes = input.letztesOeffnen ? parseIso(input.letztesOeffnen) : null;
  const gezeigt = new Set(input.gezeigt);
  const still: string[] = [];

  if (letztes === null) {
    for (const etappe of etappenListe()) {
      if (kalendertage(etappe.datum, heute) < 0) {
        const id = etappenFeierId(etappe);
        still.push(id);
        gezeigt.add(id);
      }
    }
  }

  const feiern: Feier[] = [];
  const naechte = Math.max(0, kalendertage(heute, GEBURTSDATUM));
  const naechteVorher = letztes === null ? null : Math.max(0, kalendertage(letztes, GEBURTSDATUM));

  if (naechteVorher === null) {
    if (naechte > 0 && naechte % 10 === 0) {
      feiern.push({ id: `zehner-${naechte}`, art: "zehner", text: zehnerText(naechte) });
    }
  } else {
    for (let n = Math.floor(naechteVorher / 10) * 10 + 10; n <= naechte; n += 10) {
      feiern.push({ id: `zehner-${n}`, art: "zehner", text: zehnerText(n) });
    }
  }

  const runden =
    naechteVorher === null
      ? naechte >= 100 && naechte % 50 === 0
        ? [naechte]
        : []
      : rundenSeit(naechteVorher, naechte);
  for (const n of runden) {
    feiern.push({ id: `runde-${n}`, art: "medaille", naechte: n });
  }

  for (const level of LEVELS) {
    const tag = datumPlusTage(GEBURTSDATUM, level.bisTag);
    if (!imFenster(tag, letztes, heute)) continue;
    const phase = phaseFuerWoche(Math.max(0, aktuelleWoche(tag)));
    const davor = phaseFuerWoche(Math.max(0, aktuelleWoche(datumPlusTage(tag, -1))));
    const rueckblick = davor.id !== phase.id ? davor : phase;
    feiern.push({
      id: `level-${level.nr}`,
      art: "level",
      nr: level.nr,
      titel: level.titel,
      emoji: level.emoji,
      phasenName: rueckblick.titel,
      rueckblick: rueckblick.meilensteine,
    });
  }

  for (const phase of PHASEN) {
    if (phase.von <= 0) continue;
    const start = datumFuerWoche(phase.von);
    if (!imFenster(start, letztes, heute)) continue;
    const alt = phaseFuerWoche(phase.von - 1);
    feiern.push({
      id: `phase-${phase.id}`,
      art: "phase",
      neuePhase: phase.titel,
      altePhase: alt.titel,
      emoji: "🏅",
      rueckblick: alt.meilensteine,
    });
  }

  for (const etappe of etappenListe()) {
    if (!imFenster(etappe.datum, letztes, heute)) continue;
    feiern.push({
      id: etappenFeierId(etappe),
      art: "etappe",
      emoji: etappe.emoji,
      titel: etappe.titel,
      datumText: formatDatum(etappe.datum),
      heute: kalendertage(etappe.datum, heute) === 0,
    });
  }

  const montag = montagDerWoche(heute);
  const neueWoche = letztes === null || kalendertage(montag, montagDerWoche(letztes)) > 0;
  if (neueWoche) {
    const woche = Math.max(0, aktuelleWoche(heute));
    const phase = phaseFuerWoche(woche);
    feiern.push({
      id: `geschenk-${isoTag(montag)}`,
      art: "geschenk",
      motto: mottoFuerWoche(woche),
      tipp: phase.alltagstipps[0] ?? phase.motivation,
    });
  }

  if (hashText(`${heuteTag}:ja`) % 4 === 0) {
    const satz =
      MINI_SAETZE[hashText(`${heuteTag}:satz`) % MINI_SAETZE.length] ??
      "Heute reicht eine ruhige Umarmung.";
    feiern.push({ id: `mini-${heuteTag}`, art: "mini", satz });
  }

  return { feiern: feiern.filter((feier) => !gezeigt.has(feier.id)), still };
}

function rundenSeit(vorher: number, jetzt: number): number[] {
  const liste: number[] = [];
  const start = Math.max(100, Math.floor(vorher / 50) * 50 + 50);
  for (let n = start; n <= jetzt; n += 50) liste.push(n);
  return liste;
}
