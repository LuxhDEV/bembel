/**
 * Zeitwahrnehmung: kleinere Einheiten, Nahfokus, Rückspiegel und Wochenmottos.
 * Altersangaben sind typische, ungefähre Fenster – kein medizinischer Rat.
 */

export type Einheit = "tage" | "wochen" | "monate";

export const EINHEITEN: { id: Einheit; label: string }[] = [
  { id: "tage", label: "Tage" },
  { id: "wochen", label: "Wochen" },
  { id: "monate", label: "Monate" },
];

/** Gespeicherte Altwerte, die es im Umschalter nicht mehr gibt. */
const VERALTETE_EINHEIT: Record<string, Einheit> = {
  wochenenden: "wochen",
};

export function einheitAusSpeicher(wert: string | null | undefined): Einheit {
  if (wert && wert in VERALTETE_EINHEIT) return VERALTETE_EINHEIT[wert]!;
  if (wert && EINHEITEN.some((einheit) => einheit.id === wert)) return wert as Einheit;
  return "wochen";
}

export const STORAGE_KEYS = {
  ansicht: "bembel:ansicht",
  bereich: "bembel:bereich",
  einheit: "bembel:einheit",
  wochenziel: "bembel:wochenziel",
} as const;

export type Ansicht = "nah" | "gesamt";

export type Bereich = "heute" | "wochen" | "meilensteine" | "gesamt";

export function bereichAusSpeicher(wert: string | null | undefined): Bereich {
  if (wert === "heute" || wert === "wochen" || wert === "meilensteine" || wert === "gesamt") {
    return wert;
  }
  if (wert === "nah") return "heute";
  return "heute";
}

const SPRINT_LAENGE = 10;

export type SprintStand = {
  nacht: number;
  von: number;
  nummer: number;
  /** Ein 10er-Block ist genau heute voll – Konfetti, danach startet der nächste. */
  geschafft: boolean;
  abgeschlossenerSprint: number | null;
};

export function sprintStand(gemeisterteNaechte: number): SprintStand {
  if (gemeisterteNaechte <= 0) {
    return {
      nacht: 0,
      von: SPRINT_LAENGE,
      nummer: 1,
      geschafft: false,
      abgeschlossenerSprint: null,
    };
  }
  const voll = gemeisterteNaechte % SPRINT_LAENGE === 0;
  if (voll) {
    const abgeschlossen = gemeisterteNaechte / SPRINT_LAENGE;
    return {
      nacht: 0,
      von: SPRINT_LAENGE,
      nummer: abgeschlossen + 1,
      geschafft: true,
      abgeschlossenerSprint: abgeschlossen,
    };
  }
  return {
    nacht: gemeisterteNaechte % SPRINT_LAENGE,
    von: SPRINT_LAENGE,
    nummer: Math.floor(gemeisterteNaechte / SPRINT_LAENGE) + 1,
    geschafft: false,
    abgeschlossenerSprint: null,
  };
}

function wort(n: number, eins: string, viele: string) {
  return `${n} ${n === 1 ? eins : viele}`;
}

export type KleineZahl = {
  zahl: number;
  wort: string;
  /** z. B. „Noch 30 Wochen“ oder „Nur noch 7 Monate“ */
  satz: string;
};

/**
 * Dieselbe Spanne in einer kleineren, greifbaren Einheit.
 * Unter einer vollen Woche/einem vollen Monat bleiben wir bei der nächstkleineren Einheit,
 * damit nie „0 Monate“ dasteht.
 */
export function kleineZahl(tage: number, einheit: Einheit): KleineZahl {
  if (tage <= 0) return { zahl: 0, wort: "", satz: "Geschafft" };

  const wochen = Math.round(tage / 7);
  const monate = Math.round(tage / 30.44);

  let zahl = tage;
  let einheitWort = tage === 1 ? "Tag" : "Tage";
  let verwendet: Einheit = "tage";

  if (einheit === "wochen" && wochen >= 1) {
    zahl = wochen;
    einheitWort = wochen === 1 ? "Woche" : "Wochen";
    verwendet = "wochen";
  } else if (einheit === "monate") {
    if (monate >= 1) {
      zahl = monate;
      einheitWort = monate === 1 ? "Monat" : "Monate";
      verwendet = "monate";
    } else if (wochen >= 1) {
      zahl = wochen;
      einheitWort = wochen === 1 ? "Woche" : "Wochen";
      verwendet = "wochen";
    }
  }

  const nah = verwendet === "monate" || zahl <= 12;
  return {
    zahl,
    wort: wort(zahl, einheitWort, einheitWort),
    satz: `${nah ? "Nur noch" : "Noch"} ${zahl} ${einheitWort}`,
  };
}

export type Zaubermoment = {
  id: string;
  titel: string;
  /** Ungefähres Alter in Tagen, ab dem das typischerweise auftaucht. */
  abTag: number;
};

export const ZAUBERMOMENTE: Zaubermoment[] = [
  { id: "fixieren", titel: "Gesichter in Armreichweite fixieren", abTag: 21 },
  { id: "laecheln", titel: "Erstes soziales Lächeln", abTag: 49 },
  { id: "kopf", titel: "Kopf in Bauchlage kurz halten", abTag: 56 },
  { id: "brabbeln", titel: "Brabbeln und Glucksen", abTag: 77 },
  { id: "haende", titel: "Hände entdecken und zum Mund führen", abTag: 90 },
  { id: "lachen", titel: "Lautes, ansteckendes Lachen", abTag: 112 },
  { id: "greifen", titel: "Gezieltes Greifen mit beiden Händen", abTag: 135 },
  { id: "drehen", titel: "Drehen vom Bauch auf den Rücken", abTag: 160 },
  { id: "rassel", titel: "Eine Rassel festhalten und schütteln", abTag: 175 },
  { id: "loeffel", titel: "Neugier auf erste Löffelchen", abTag: 188 },
  { id: "rollen", titel: "Rollen in beide Richtungen", abTag: 210 },
  { id: "sitzen", titel: "Freies Sitzen für einen Moment", abTag: 230 },
  { id: "vertraute", titel: "Klares Strahlen bei vertrauten Gesichtern", abTag: 250 },
  { id: "robben", titel: "Robben oder Krabbeln zur nächsten Ecke", abTag: 270 },
  { id: "kuckuck", titel: "Kuckuck-Spiele – Dinge bleiben, auch unsichtbar", abTag: 290 },
  { id: "pinzette", titel: "Pinzettengriff zwischen den Fingern", abTag: 310 },
  { id: "hochziehen", titel: "Hochziehen an sicheren Möbeln", abTag: 335 },
  { id: "worte", titel: "Erste Wortversuche wie Mama oder Papa", abTag: 360 },
  { id: "jahr", titel: "Das erste Lebensjahr wird rund", abTag: 365 },
  { id: "hand", titel: "Erste Schritte an der Hand", abTag: 400 },
  { id: "laufen", titel: "Freie Schritte durchs Zimmer", abTag: 450 },
  { id: "besteck", titel: "Löffel und Becher selbst ausprobieren", abTag: 500 },
  { id: "zweiwort", titel: "Erste Zweiwort-Sätze", abTag: 600 },
  { id: "treppe", titel: "Treppen steigen mit Festhalten", abTag: 640 },
  { id: "wortschatz", titel: "Eine kleine Wort-Explosion", abTag: 730 },
  { id: "saetze", titel: "Sätze mit drei oder vier Wörtern", abTag: 900 },
  { id: "toepfchen", titel: "Interesse am Töpfchen", abTag: 1000 },
  { id: "warum", titel: "Warum-Fragen am laufenden Band", abTag: 1150 },
  { id: "freunde", titel: "Erste richtige Freundschaften", abTag: 1280 },
  { id: "zaehlen", titel: "Zählen und kleine Regelspiele", abTag: 1460 },
];

export function naechsterZaubermoment(alterTage: number): {
  moment: Zaubermoment;
  inTagen: number;
} | null {
  const moment = ZAUBERMOMENTE.find((m) => m.abTag > alterTage);
  if (!moment) return null;
  return { moment, inTagen: moment.abTag - alterTage };
}

/** Kurze, ehrliche Spanne – unter drei Wochen in Tagen, sonst in Wochen oder Monaten. */
export function ungefaehrIn(tage: number): string {
  if (tage <= 0) return "ungefähr jetzt";
  if (tage === 1) return "ca. in 1 Tag";
  if (tage < 21) return `ca. in ${tage} Tagen`;
  const wochen = Math.round(tage / 7);
  if (wochen < 9) return wochen === 1 ? "ca. in 1 Woche" : `ca. in ${wochen} Wochen`;
  const monate = Math.max(1, Math.round(tage / 30.44));
  return monate === 1 ? "ca. in 1 Monat" : `ca. in ${monate} Monaten`;
}

export type Level = {
  nr: number;
  titel: string;
  emoji: string;
  /** Geschafft, sobald das Alter in Tagen diesen Wert erreicht. */
  bisTag: number;
};

export const LEVELS: Level[] = [
  { nr: 1, titel: "4. Trimester geschafft", emoji: "🌱", bisTag: 84 },
  { nr: 2, titel: "Die Brabbel-Explosion", emoji: "💬", bisTag: 112 },
  { nr: 3, titel: "Greifen und Lachen", emoji: "✨", bisTag: 140 },
  { nr: 4, titel: "Die erste Drehung", emoji: "🔄", bisTag: 168 },
  { nr: 5, titel: "Beikost-Neugier", emoji: "🥕", bisTag: 196 },
  { nr: 6, titel: "Sitzen mit Stolz", emoji: "🪑", bisTag: 230 },
  { nr: 7, titel: "Robben und Krabbeln", emoji: "🐛", bisTag: 270 },
  { nr: 8, titel: "Kuckuck-Spiele", emoji: "👀", bisTag: 300 },
  { nr: 9, titel: "Hochziehen an Möbeln", emoji: "🪵", bisTag: 340 },
  { nr: 10, titel: "Erstes Lebensjahr geschafft", emoji: "🎂", bisTag: 365 },
  { nr: 11, titel: "Freie Schritte", emoji: "👟", bisTag: 430 },
  { nr: 12, titel: "Die ersten Wörter", emoji: "🗣️", bisTag: 500 },
  { nr: 13, titel: "Ein-Schlaf-Ära", emoji: "🌙", bisTag: 560 },
  { nr: 14, titel: "Autonomie mit Herz", emoji: "💪", bisTag: 700 },
  { nr: 15, titel: "Satzbau-Zauber", emoji: "📖", bisTag: 900 },
  { nr: 16, titel: "Phantasie-Welten", emoji: "🌈", bisTag: 1100 },
  { nr: 17, titel: "Kleiner Partner", emoji: "🤝", bisTag: 1461 },
];

export function levelStand(alterTage: number) {
  const geschafft = LEVELS.filter((l) => alterTage >= l.bisTag);
  const aktuell = LEVELS.find((l) => alterTage < l.bisTag) ?? null;
  const start = geschafft.length > 0 ? geschafft[geschafft.length - 1]!.bisTag : 0;
  const fortschritt =
    aktuell === null
      ? 100
      : Math.min(100, Math.max(0, ((alterTage - start) / (aktuell.bisTag - start)) * 100));
  return { geschafft, aktuell, fortschritt };
}

/** Sichtbare Medaillen: alle gemeisterten, das laufende und das nächste – oder die ganze Kette. */
export function sichtbareLevel(alterTage: number, alle: boolean): Level[] {
  if (alle) return LEVELS;
  const { aktuell } = levelStand(alterTage);
  const bisNr = aktuell ? aktuell.nr + 1 : LEVELS.length;
  return LEVELS.filter((l) => l.nr <= bisNr);
}

export const WOCHEN_MOTTOS = [
  "Woche der Barfuß-Erkundung",
  "Woche des neuen Gutenachtlieds",
  "Kaffee-to-go-im-Park-Woche",
  "Woche der extra langen Umarmung",
  "Woche des Fenster-Wetters",
  "Pfützen-und-Gummistiefel-Woche",
  "Woche des leisen Morgenkaffees",
  "Woche der ersten Erdbeere",
  "Kuscheldecken-Fort-Woche",
  "Woche des einen ruhigen Atemzugs",
  "Spielplatz-Rutsch-Woche",
  "Woche der selbst gemachten Suppe",
  "Laternen-Spaziergang-Woche",
  "Woche des neuen Fingerspiels",
  "Bibliotheks-Bilderbuch-Woche",
  "Woche der warmen Küche",
  "Sonnenfleck-auf-dem-Teppich-Woche",
  "Woche des gemeinsamen Badliedes",
  "Marktstand-Schnupper-Woche",
  "Woche der kleinen Ja-Momente",
  "Schaukel-bis-zum-Lachen-Woche",
  "Woche des frühen Feierabends",
  "Blatt-Sammeln-Woche",
  "Woche der zweiten Tasse Tee",
  "Handabdruck-an-der-Scheibe-Woche",
  "Woche des vertrauten Dufts",
  "Picknickdecke-im-Gras-Woche",
  "Woche der langsamen Wickelkommode",
  "Gute-Nacht-Stern-Woche",
  "Woche der warmen Socken",
  "Seifenblasen-im-Garten-Woche",
  "Woche der geteilten Banane",
  "Trage-und-Summ-Woche",
  "Woche des einen aufgeräumten Regals",
  "Kicher-Echo-Woche",
  "Woche der Nachbarschafts-Runde",
  "Wachsmalstift-Woche",
  "Woche des offenen Fensters",
  "Suppen-und-Stulle-Woche",
  "Woche der freundlichen Notiz an euch",
  "Sandkasten-Architektur-Woche",
  "Woche des gleichen Schlaflieds",
  "Regenjacken-Tanz-Woche",
  "Woche der vollen Obstschale",
  "Balkon-Beobachtungs-Woche",
  "Woche des frühen Zubettgehens",
  "Kuscheltier-Konferenz-Woche",
  "Woche der gemeinsamen Playlist",
  "Pflaster-und-Mut-Woche",
  "Woche des stillen Stolzes",
  "Fahrradanhänger-Woche",
  "Schatten-Spiel-Woche",
] as const;

export function mottoFuerWoche(woche: number): string {
  const liste = WOCHEN_MOTTOS;
  const index = ((Math.floor(woche) % liste.length) + liste.length) % liste.length;
  return liste[index] ?? liste[0];
}

/** Kalendersonntag der laufenden Woche (heute, falls schon Sonntag). */
export function sonntagDieserWoche(heute: Date): Date {
  const tag = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());
  const rest = (7 - tag.getDay()) % 7;
  tag.setDate(tag.getDate() + rest);
  return tag;
}

export function isoTag(datum: Date): string {
  const monat = String(datum.getMonth() + 1).padStart(2, "0");
  const tag = String(datum.getDate()).padStart(2, "0");
  return `${datum.getFullYear()}-${monat}-${tag}`;
}

export type WochenzielSpeicher = {
  bis: string;
  text: string;
  gemeistert?: { bis: string; text: string };
};

export function wochenzielLaden(roh: string | null, heute: Date): WochenzielSpeicher {
  const bis = isoTag(sonntagDieserWoche(heute));
  const leer: WochenzielSpeicher = { bis, text: "" };
  if (!roh) return leer;
  try {
    const daten = JSON.parse(roh) as WochenzielSpeicher;
    if (!daten || typeof daten.bis !== "string") return leer;
    const gemeistert =
      daten.gemeistert &&
      typeof daten.gemeistert.bis === "string" &&
      typeof daten.gemeistert.text === "string" &&
      daten.gemeistert.text.trim()
        ? daten.gemeistert
        : undefined;
    if (daten.bis < bis && typeof daten.text === "string" && daten.text.trim()) {
      return { bis, text: "", gemeistert: { bis: daten.bis, text: daten.text.trim() } };
    }
    if (daten.bis === bis) {
      return gemeistert
        ? { bis, text: typeof daten.text === "string" ? daten.text : "", gemeistert }
        : { bis, text: typeof daten.text === "string" ? daten.text : "" };
    }
    return gemeistert ? { ...leer, gemeistert } : leer;
  } catch {
    return leer;
  }
}
