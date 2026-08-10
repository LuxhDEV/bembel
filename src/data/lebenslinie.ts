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
  /* Erweiterte Infos */
  wachfenster: string;
  schlafbedarf: string;
  ernaehrung: string;
  spielideen: string[];
  alltagstipps: string[];
  elternfokus: string;
  vorsorge: string;
  achtung: string;
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
    wachfenster: "45–60 Minuten",
    schlafbedarf: "16–18 Std. pro Tag, verteilt über 24 Stunden",
    ernaehrung: "Stillen/Flasche nach Bedarf – 8–12 Mahlzeiten in 24 Std., auch nachts.",
    spielideen: [
      "Gesicht zeigen und langsam bewegen (20–30 cm Abstand)",
      "Schwarz-Weiß-Kontrastkarten",
      "Hautkontakt, Tragen, sanftes Schaukeln",
    ],
    alltagstipps: [
      "Besuch stark begrenzen und Zeitfenster festlegen",
      "Pucken oder Tragetuch gegen den Moro-Reflex",
      "Essen vorkochen lassen – jede Hilfe annehmen",
    ],
    elternfokus:
      "Wochenbett heißt liegen. Rückbildung erst nach ärztlicher Freigabe, Baby-Blues um Tag 3–5 ist normal.",
    vorsorge: "U2 (3.–10. Lebenstag), U3 (4.–5. Lebenswoche), Hörtest & Neugeborenenscreening",
    achtung:
      "Fieber über 38 °C, Trinkverweigerung oder auffällige Gelbfärbung immer sofort ärztlich abklären.",
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
    wachfenster: "60–90 Minuten",
    schlafbedarf: "15–17 Std. pro Tag, 4–6 Schläfchen",
    ernaehrung: "Wachstumsschub um Woche 6 – häufigeres Clusterfeeding am Abend ist normal.",
    spielideen: [
      "Bauchlage in kurzen Einheiten (2–3 Min., mehrmals täglich)",
      "Singen und Reime – Stimme beruhigt mehr als Spielzeug",
      "Mobile über der Wickelkommode",
    ],
    alltagstipps: [
      "Abends früh abdunkeln, Reize konsequent runterfahren",
      "Schichtwechsel der Eltern in der Schreistunde",
      "Spaziergang oder Trage überbrücken die schwierigste Stunde",
    ],
    elternfokus:
      "Schlafmangel ist jetzt am größten. Tagsüber mitschlafen schlägt Aufräumen – immer.",
    vorsorge: "Vorbereitung U4 (3.–4. Monat), ggf. erste Impftermine planen",
    achtung:
      "Untröstliches Schreien über 3 Std./Tag: Schreiambulanz kontaktieren, das ist kein Elternversagen.",
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
    wachfenster: "75–105 Minuten",
    schlafbedarf: "14–16 Std. pro Tag, 4 Schläfchen",
    ernaehrung: "Stillen/Flasche nach Bedarf, längere Abstände tagsüber (2,5–3 Std.).",
    spielideen: [
      "Greifring und Rasseln in die Hand legen",
      "Spiegel-Spiele",
      "Bauchlage auf dem Stillkissen verlängern",
    ],
    alltagstipps: [
      "Erste feste Abendroutine etablieren (Bad – Massage – Lied – Bett)",
      "Tagsüber hell, nachts dunkel und leise: hilft dem Rhythmus",
      "Wieder erste eigene Termine einplanen",
    ],
    elternfokus: "Rückbildungskurs starten, Paarzeit bewusst einplanen – 20 Minuten reichen.",
    vorsorge: "U4 (3.–4. Monat) inkl. Impfberatung",
    achtung: "Kopf sollte in Bauchlage kurz gehalten werden – sonst bei der U4 ansprechen.",
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
    wachfenster: "1,5–2 Stunden",
    schlafbedarf: "14–15 Std. pro Tag, 3–4 Schläfchen",
    ernaehrung: "Noch reine Milchernährung – Beikostreifezeichen beobachten, nicht drängen.",
    spielideen: [
      "Spielbogen mit hängenden Figuren",
      "Knisterbuch & Greiflinge",
      "Pust- und Kitzelspiele für lautes Lachen",
    ],
    alltagstipps: [
      "Regression aussitzen: sie dauert meist 2–6 Wochen",
      "Keine neuen Schlafexperimente mitten in der Regression",
      "Früher ins Bett, wenn nachts viel wach – Übermüdung verschlimmert alles",
    ],
    elternfokus:
      "Nachtdienste fair aufteilen und tagsüber Erwartungen an euch selbst senken.",
    vorsorge: "U5 (6.–7. Monat) rückt näher – Termin jetzt buchen",
    achtung: "Kleinteile ab jetzt konsequent wegräumen, alles wandert in den Mund.",
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
    wachfenster: "2–2,5 Stunden",
    schlafbedarf: "13–15 Std. pro Tag, 3 Schläfchen",
    ernaehrung:
      "Beikoststart frühestens ab dem 5. Monat: Gemüsebrei, dann Kartoffel-Fleisch, später Getreide-Obst. Milch bleibt Hauptnahrung.",
    spielideen: [
      "Stapelbecher und Softbälle",
      "Kuckuck-Spiele mit Tuch",
      "Erste Fingerspiele („Backe, backe Kuchen“)",
    ],
    alltagstipps: [
      "Wickeltisch nie unbeaufsichtigt – Drehen kommt plötzlich",
      "Beikost entspannt: ein neues Lebensmittel alle 3–4 Tage",
      "Krabbeldecke statt Wippe, freie Bewegung fördert Motorik",
    ],
    elternfokus:
      "Gutes Fenster für Wiedereinstieg-Planung, Kita-Anmeldung und ein Wochenende zu zweit.",
    vorsorge: "U5 (6.–7. Monat), Zahnpflege ab dem ersten Zahn",
    achtung: "Erste Zähne: Beißring kühlen, Fieber gehört nicht zum Zahnen.",
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
    wachfenster: "2,5–3 Stunden",
    schlafbedarf: "12–14 Std. pro Tag, 2 Schläfchen",
    ernaehrung:
      "Drei Breimahlzeiten, erste Fingerfoods (weiche Gurke, Banane, Brotrinde). Wasser im Becher anbieten.",
    spielideen: [
      "Bälle wegrollen und holen lassen",
      "Tunnel und Kissenberge zum Krabbeln",
      "Sortier- und Ausräumkiste (Tupperschrank!)",
    ],
    alltagstipps: [
      "Wohnung kindersicher machen: Steckdosen, Treppen, Schubladen",
      "Fremdeln respektieren – nicht zum Winken zwingen",
      "Barfuß krabbeln lassen, keine harten Schuhe",
    ],
    elternfokus:
      "Trennungsangst heißt: kurze, klare Abschiede. Eingewöhnung ruhig jetzt gedanklich vorbereiten.",
    vorsorge: "U6 (10.–12. Monat)",
    achtung: "Sturzhöhe checken: Bettgitter runter, Treppengitter rauf.",
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
    wachfenster: "3–3,5 Stunden",
    schlafbedarf: "12–14 Std. pro Tag, 2 Schläfchen",
    ernaehrung:
      "Übergang zur Familienkost: salzarm, klein geschnitten. Keine Nüsse, kein Honig im 1. Jahr.",
    spielideen: [
      "Schiebewagen und stabile Möbel zum Hochziehen",
      "Bilderbücher mit Klappen",
      "Einfache Steckspiele und Bauklötze",
    ],
    alltagstipps: [
      "Viel benennen: Sprache wächst durch Wiederholung",
      "Zwischen 40–45 Wochen oft Schlafdelle – ruhig begleiten",
      "Rituale beim Abschied fest etablieren",
    ],
    elternfokus:
      "Kita-Eingewöhnung planen und die eigene Rückkehr in den Job realistisch takten.",
    vorsorge: "U6 (10.–12. Monat), Zahnarzt-Erstkontakt",
    achtung: "Hochziehen = neue Sturzquellen: scharfe Kanten und Tischdecken sichern.",
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
    wachfenster: "4–5 Stunden",
    schlafbedarf: "11–14 Std. pro Tag, 1 Mittagsschlaf (1–2 Std.)",
    ernaehrung:
      "Isst am Familientisch mit. Selbst löffeln lassen, auch wenn es kleckert – Sauerei ist Lernen.",
    spielideen: [
      "Holz-Steckspiele, Stapelturm, große Puzzle (2–4 Teile)",
      "Malen mit dicken Wachsmalstiften",
      "Sandkasten und Wasser-Schöpfspiele",
    ],
    alltagstipps: [
      "Zwei Auswahlmöglichkeiten geben statt offener Fragen",
      "Nach dem Umstieg auf 1 Schlaf früher zu Bett bringen",
      "Feste Tagesstruktur gibt Sicherheit",
    ],
    elternfokus:
      "Grenzen freundlich, aber gleichbleibend setzen – Konsequenz ist entlastender als Diskussion.",
    vorsorge: "U7 (20.–24. Monat) planen, Zahnvorsorge",
    achtung: "Laufen + Neugier = Küche, Balkon und Treppen erneut sichern.",
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
    wachfenster: "5–6 Stunden",
    schlafbedarf: "11–14 Std. pro Tag, 1 Mittagsschlaf",
    ernaehrung:
      "Wählerische Phasen sind normal. Ihr entscheidet was und wann, das Kind ob und wie viel.",
    spielideen: [
      "„Erster Obstgarten“ und andere einfache Regelspiele",
      "Knete, Kugelbahn, Magnetbausteine",
      "Rollenspiel mit Puppe, Küche und Werkbank",
    ],
    alltagstipps: [
      "Wutanfälle begleiten statt wegdiskutieren – Gefühl benennen",
      "Genug Zeit einplanen: Zeitdruck ist der Hauptauslöser",
      "Bildkarten oder Routine-Poster helfen beim Übergang",
    ],
    elternfokus:
      "Eigene Regulation zuerst: kurz durchatmen, dann reagieren. Ihr dürft auch mal aus dem Raum gehen.",
    vorsorge: "U7 (20.–24. Monat), Sprachentwicklung wird geprüft",
    achtung:
      "Unter 50 Wörtern mit 24 Monaten: Late-Talker abklären lassen, früh ist entspannter.",
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
    wachfenster: "6–7 Stunden",
    schlafbedarf: "10–13 Std. pro Tag, Mittagsschlaf optional",
    ernaehrung:
      "Isst komplett mit. Beim Tischdecken und Kochen einbinden – erhöht die Probierbereitschaft.",
    spielideen: [
      "Memory (mit 12–16 Karten starten) und Kartenhalter",
      "Laufrad, Balancieren, Klettern",
      "Rollenspiel: Kaufladen, Arztkoffer, Verkleiden",
    ],
    alltagstipps: [
      "Töpfchen anbieten, nie erzwingen – Rückschritte sind normal",
      "Statt Mittagsschlaf eine ruhige Lesestunde einführen",
      "Wenn-dann-Ankündigungen: „Noch zweimal rutschen, dann gehen wir“",
    ],
    elternfokus:
      "Mehr echte Gesprächszeit: Fragen stellen und Antworten wirklich abwarten.",
    vorsorge: "U7a (34.–36. Monat) inkl. Sehtest",
    achtung: "Nachts trocken wird oft erst mit 4–5 Jahren – kein Grund zur Sorge.",
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
    wachfenster: "durchgehender Tag, ggf. Ruhephase am Nachmittag",
    schlafbedarf: "10–13 Std. Nachtschlaf, meist ohne Mittagsschlaf",
    ernaehrung:
      "Feste Mahlzeiten, kann sich selbst Getränke eingießen und beim Kochen helfen.",
    spielideen: [
      "Uno Junior, Mensch ärgere dich nicht Junior, Mau-Mau vereinfacht",
      "Erste Bastelprojekte mit Schere und Kleber",
      "Verabredungen mit Freund:innen, Rollenspiel-Welten",
    ],
    alltagstipps: [
      "Verlieren üben: kleine Spiele, gelassene Vorbilder",
      "Warum-Fragen ernst nehmen, gemeinsam nachschauen",
      "Ruhige Abendroutine mit Vorlesen beibehalten",
    ],
    elternfokus:
      "Verantwortung übergeben: kleine Aufgaben im Haushalt stärken das Selbstbewusstsein.",
    vorsorge: "U8 (46.–48. Monat) inkl. Sprach-, Seh- und Hörprüfung",
    achtung: "Albträume und Fantasiefreunde sind in diesem Alter völlig normal.",
  },
];

export function phaseFuerWoche(woche: number): Phase {
  return (
    PHASEN.find((p) => woche >= p.von && woche <= p.bis) ??
    (PHASEN[PHASEN.length - 1] as Phase)
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
