export const GEBURTSDATUM = new Date(2026, 5, 30); // 30.06.2026
export const MAX_WOCHE = 208;

export type Ton = "ruhig" | "wachstum" | "intensiv";

export type Phase = {
  id: string;
  von: number;
  bis: number;
  titel: string;
  kurz: string;
  abschnitt: string;
  stress: 1 | 2 | 3 | 4 | 5;
  ton: Ton;
  schlaf: string;
  schlafStatus: string;
  meilensteine: string[];
  motivation: string;
  tags: Array<"regression" | "spiel" | "schlaf">;
};

export const PHASEN: Phase[] = [
  {
    id: "w1-4",
    von: 0,
    bis: 4,
    titel: "Ankommen im Leben",
    kurz: "4. Trimester – Kennenlernen",
    abschnitt: "Phase 1 · 4. Trimester & Neugeborenenzeit",
    stress: 4,
    ton: "intensiv",
    schlafStatus: "Kein Tag-Nacht-Rhythmus – Körperkontakt nötig",
    schlaf:
      "Kein Tag-Nacht-Rhythmus, Schlaf in 1–3 Std. Häppchen, Einschlafen meist nur durch Körperkontakt oder Stillen.",
    meilensteine: ["Erste Reflexe", "Fixieren von Gesichtern (20–30 cm Distanz)"],
    motivation:
      "Ihr lernt euch erst kennen. Haushalt und Perfektionismus jetzt komplett abstellen.",
    tags: ["schlaf", "regression"],
  },
  {
    id: "w5-8",
    von: 5,
    bis: 8,
    titel: "Peak der Anpassungsphase",
    kurz: "Witching Hour & Reizabschirmung",
    abschnitt: "Phase 1 · 4. Trimester & Neugeborenenzeit",
    stress: 5,
    ton: "intensiv",
    schlafStatus: "Überreizungs-Phase / Dunkler Raum nötig",
    schlaf:
      "„Witching Hour“ am Abend, Einschlafbegleitung dauert 20–90 Min., dunkler Raum nötig zur Reizabschirmung.",
    meilensteine: [
      "Erstes bewusstes soziales Lächeln (W6–8)",
      "Kopf in Bauchlage kurz halten",
    ],
    motivation:
      "Ihr steht auf dem absoluten Gipfel des Berges. Ab Woche 8–9 wird es Schritt für Schritt leichter!",
    tags: ["schlaf", "regression"],
  },
  {
    id: "w9-12",
    von: 9,
    bis: 12,
    titel: "Die Wende",
    kurz: "Melatonin startet, Schreien lässt nach",
    abschnitt: "Phase 1 · 4. Trimester & Neugeborenenzeit",
    stress: 3,
    ton: "wachstum",
    schlafStatus: "Erste verlässliche Abendruhe",
    schlaf:
      "Melatonin-Produktion beginnt, Schrei-Episoden lassen nach, erste verlässliche Abendruhe.",
    meilensteine: ["Brabbeln und Glucksen", "Hände werden entdeckt und in den Mund gesteckt"],
    motivation:
      "Das 4. Trimester endet. Dein Baby belohnt dich jetzt täglich mit Lachen und Blickkontakt.",
    tags: ["schlaf"],
  },
  {
    id: "w13-16",
    von: 13,
    bis: 16,
    titel: "4-Monats-Schlafregression",
    kurz: "Holprig – Gehirn baut um",
    abschnitt: "Phase 2 · Entdeckung & Interaktion",
    stress: 4,
    ton: "intensiv",
    schlafStatus: "Häufiges Aufwachen nachts – Umstellung auf Erwachsenen-Muster",
    schlaf:
      "Schlafrhythmus stellt sich auf Erwachsenen-Muster um. Häufiges Aufwachen nachts.",
    meilensteine: ["Gezieltes Greifen nach Spielzeug", "Lautstarkes Lachen"],
    motivation:
      "Der Schlaf wird kurz wieder anstrengender – aber das ist ein Zeichen für gewaltige Gehirnentwicklung!",
    tags: ["regression", "schlaf", "spiel"],
  },
  {
    id: "w17-26",
    von: 17,
    bis: 26,
    titel: "Hohe Spaßphase",
    kurz: "Beikost, Drehen, Interaktion",
    abschnitt: "Phase 2 · Entdeckung & Interaktion",
    stress: 2,
    ton: "ruhig",
    schlafStatus: "3 Schläfchen – Einschlafen in 15–20 Min.",
    schlaf:
      "Tagesschlaf pendelt sich auf 3 Schläfchen ein. Einschlafen geht deutlich schneller (15–20 Min).",
    meilensteine: ["Drehen vom Bauch auf den Rücken", "Beikoststart", "Rassel schütteln"],
    motivation:
      "Jetzt beginnt eine Phase, die richtig viel Freude macht. Das Baby interagiert aktiv mit euch.",
    tags: ["spiel", "schlaf"],
  },
  {
    id: "w27-36",
    von: 27,
    bis: 36,
    titel: "Mobil werden",
    kurz: "Robben, Krabbeln, Kuckuck",
    abschnitt: "Phase 3 · Mobilität & Erkundung",
    stress: 3,
    ton: "wachstum",
    schlafStatus: "Übergang zu 2 Tagesschläfchen",
    schlaf:
      "Übergang zu 2 Tagesschläfchen. Trennungsangst kann den Nachtschlaf kurz unruhiger machen.",
    meilensteine: [
      "Robben und Krabbeln",
      "Freies Sitzen",
      "Objektpermanenz (Kuckuck-Spiele)",
    ],
    motivation:
      "Dein Baby entdeckt die Welt auf eigenen Beinen/Händen. Das gibt dir erste Freiräume im Raum zurück.",
    tags: ["spiel", "schlaf"],
  },
  {
    id: "w37-52",
    von: 37,
    bis: 52,
    titel: "Erste Schritte & erste Worte",
    kurz: "Holprig um W40–45 (Trennungsangst)",
    abschnitt: "Phase 3 · Mobilität & Erkundung",
    stress: 3,
    ton: "wachstum",
    schlafStatus: "Feste Bettzeiten gegen 19:00/20:00 Uhr",
    schlaf: "Schlafrhythmus stabilisiert sich. Feste Bettzeiten gegen 19:00/20:00 Uhr.",
    meilensteine: [
      "Hochziehen an Möbeln",
      "Erste Schritte an der Hand",
      "Erste Wortversuche („Mama/Papa“)",
    ],
    motivation:
      "Der 1. Geburtstag ist da! Ihr habt das intensivste Babyjahr erfolgreich gemeistert.",
    tags: ["regression", "schlaf"],
  },
  {
    id: "w53-78",
    von: 53,
    bis: 78,
    titel: "13–18 Monate: Freies Laufen",
    kurz: "Ein Mittagsschlaf, erste Steckspiele",
    abschnitt: "Phase 4 · Kleinkind & Unabhängigkeit",
    stress: 2,
    ton: "ruhig",
    schlafStatus: "Nur noch 1 Tagesschlaf (Mittagsschlaf)",
    schlaf: "Umstellung auf nur noch 1 Tagesschlaf (Mittagsschlaf).",
    meilensteine: [
      "Freies Laufen",
      "Erstes Spielen mit Holz-Steckspielen und Stapelbechern",
      "Besteck nutzen",
    ],
    motivation:
      "Aus dem Baby wird ein kleiner Mensch mit eigenem Kopf – genießt dieses entspannte Fenster.",
    tags: ["spiel", "schlaf"],
  },
  {
    id: "w79-104",
    von: 79,
    bis: 104,
    titel: "19–24 Monate: Autonomiephase",
    kurz: "Holprig – Trotzphase & Wortexplosion",
    abschnitt: "Phase 4 · Kleinkind & Unabhängigkeit",
    stress: 4,
    ton: "intensiv",
    schlafStatus: "Schlafflaschenhälse durch starke Träume & Autonomiedrang",
    schlaf: "Gelegentliche Schlafflaschenhälse durch starke Träume und Autonomiedrang.",
    meilensteine: [
      "Wortexplosion (über 50 Wörter)",
      "Erste Regelspiele ab 2 Jahren (z. B. „Erster Obstgarten“, Mitmach-Bücher)",
      "Selbstständiges Rennen",
    ],
    motivation:
      "Wutausbrüche sind ein Zeichen von Selbstständigkeit. Ruhe bewahren – es ist eine Phase.",
    tags: ["regression", "spiel", "schlaf"],
  },
  {
    id: "w105-156",
    von: 105,
    bis: 156,
    titel: "3. Lebensjahr: Phantasie & Sprache",
    kurz: "Memory, Laufrad, Töpfchen",
    abschnitt: "Phase 5 · Regelspiele, Phantasie & Sprache",
    stress: 2,
    ton: "ruhig",
    schlafStatus: "Durchschlafen wird zur Regel – Mittagsschlaf fällt langsam weg",
    schlaf: "Durchschlafen wird zur Regel. Mittagsschlaf fällt bei vielen langsam weg.",
    meilensteine: [
      "Sätze mit 3–4 Wörtern",
      "Erste Kartenspiele mit Kartenhalter & Memory (3 Jahre)",
      "Dreirad/Laufrad fahren",
      "Töpfchentraining",
    ],
    motivation:
      "Jetzt entstehen echte Gespräche – dein Kind erklärt dir seine eigene Welt.",
    tags: ["spiel", "schlaf"],
  },
  {
    id: "w157-208",
    von: 157,
    bis: 208,
    titel: "4. Lebensjahr: Kleiner Partner",
    kurz: "Uno Junior, Rollenspiele, Freundschaften",
    abschnitt: "Phase 5 · Regelspiele, Phantasie & Sprache",
    stress: 2,
    ton: "ruhig",
    schlafStatus: "Ruhiger Abendschlaf – Abendroutine wird verstanden",
    schlaf:
      "Ruhiger Abendschlaf, Kind versteht Verhandlungen und Abendroutinen komplett.",
    meilensteine: [
      "Klassische Spiele (Uno Junior, Mau-Mau mit Vereinfachung, Mensch ärgere dich nicht Junior)",
      "Rollenspiele",
      "Zählen bis 10",
      "Freunde & Freundschaften",
    ],
    motivation:
      "Ihr habt jetzt einen kleinen Partner für Brettspiele, Gespräche und gemeinsame Abenteuer.",
    tags: ["spiel", "schlaf"],
  },
];

export function phaseFuerWoche(woche: number): Phase {
  return (
    PHASEN.find((p) => woche >= p.von && woche <= p.bis) ?? PHASEN[PHASEN.length - 1]
  );
}

export function aktuelleWoche(heute: Date = new Date()): number {
  const ms = heute.getTime() - GEBURTSDATUM.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
}

export function datumFuerWoche(woche: number): Date {
  const d = new Date(GEBURTSDATUM);
  d.setDate(d.getDate() + woche * 7);
  return d;
}

export function formatDatum(d: Date): string {
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function alterText(woche: number): string {
  if (woche < 0) return "Noch nicht geboren";
  const monate = Math.floor((woche * 7) / 30.44);
  if (woche < 13) return `Woche ${woche}`;
  if (monate < 24) return `Woche ${woche} · ${monate} Monate`;
  return `Woche ${woche} · ${(monate / 12).toFixed(1).replace(".", ",")} Jahre`;
}

export const STRESS_TEXT: Record<number, string> = {
  1: "Sehr entspannt",
  2: "Entspannt",
  3: "Fordernd",
  4: "Anstrengend",
  5: "Maximaler Überlebensmodus",
};
