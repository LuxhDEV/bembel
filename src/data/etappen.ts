import { GEBURTSDATUM, datumFuerWoche } from "@/data/lebenslinie";
import { isoTag } from "@/data/wahrnehmung";
import { datumPlusTage } from "@/lib/heute";

export type Etappe = {
  id: string;
  titel: string;
  datum: Date;
  emoji: string;
};

export const KITA_BEGINN = new Date(2027, 5, 1);

const TAG_MS = 86_400_000;

function fest(titel: string, datum: Date, emoji: string): Etappe {
  return { id: `${isoTag(datum)}:${titel}`, titel, datum, emoji };
}

/** Gleicher Kalendertag, n Monate später. Der 31. rutscht auf den letzten Tag des Zielmonats. */
function plusMonate(basis: Date, monate: number): Date {
  const vorlaeufig = new Date(basis.getFullYear(), basis.getMonth() + monate, 1);
  const letzter = new Date(vorlaeufig.getFullYear(), vorlaeufig.getMonth() + 1, 0).getDate();
  return new Date(
    vorlaeufig.getFullYear(),
    vorlaeufig.getMonth(),
    Math.min(basis.getDate(), letzter),
  );
}

/** Erntedank in Deutschland: erster Sonntag im Oktober. */
function erntedank(jahr: number): Date {
  const erster = new Date(jahr, 9, 1);
  const bisSonntag = (7 - erster.getDay()) % 7;
  return new Date(jahr, 9, 1 + bisSonntag);
}

function baueEtappen(): Etappe[] {
  const start = GEBURTSDATUM.getTime();
  const ende = KITA_BEGINN.getTime();
  const anteil = (faktor: number) => new Date(start + (ende - start) * faktor);

  return [
    fest("Geburt – willkommen auf der Welt", datumPlusTage(GEBURTSDATUM, 0), "👶"),
    fest("Erste Woche zusammen", datumPlusTage(GEBURTSDATUM, 7), "🫶"),
    // lebenslinie.ts, Phase w5–8: „Erstes bewusstes soziales Lächeln (W6–8)“
    fest("ca. Erstes soziales Lächeln", datumFuerWoche(6), "😊"),
    fest("Mariä Himmelfahrt – ein ruhiger Feiertag", new Date(2026, 7, 15), "🌤️"),
    fest("50 Nächte zusammen", datumPlusTage(GEBURTSDATUM, 50), "🌙"),
    fest("Wochenbett geschafft", datumPlusTage(GEBURTSDATUM, 8 * 7), "💛"),
    // lebenslinie.ts, Phase w9–12: „Brabbeln und Glucksen“
    fest("ca. Brabbeln und Glucksen", datumFuerWoche(9), "🫧"),
    // Letzter Ferientag laut bayerischer Ferienordnung, Schuljahr 2026/2027.
    fest("Sommerferien in Bayern gehen zu Ende", new Date(2026, 8, 14), "🎒"),
    fest("Herbstanfang", new Date(2026, 8, 23), "🍂"),
    // lebenslinie.ts, Phase w13–16: „Lautstarkes Lachen“
    fest("ca. Lautes Lachen", datumFuerWoche(13), "😄"),
    fest("4. Trimester geschafft", plusMonate(GEBURTSDATUM, 3), "🌱"),
    fest("Tag der Deutschen Einheit", new Date(2026, 9, 3), "🇩🇪"),
    fest("Erntedank – danke für diesen Herbst", erntedank(2026), "🌾"),
    fest("100 Nächte zusammen", datumPlusTage(GEBURTSDATUM, 100), "💯"),
    fest("Winterzeit: früher dunkel, dafür morgens heller", new Date(2026, 9, 25), "🕰️"),
    fest("Halbzeit bis zur Kita", anteil(1 / 2), "⚖️"),
    fest("Nikolaus", new Date(2026, 11, 6), "🎅"),
    fest("Kürzester Tag – ab jetzt werden die Tage wieder länger", new Date(2026, 11, 21), "🌅"),
    fest("Weihnachten", new Date(2026, 11, 24), "🎄"),
    fest("Baby wird ½ Jahr alt", new Date(2026, 11, 30), "🎂"),
    fest("Silvester", new Date(2026, 11, 31), "🎆"),
    fest("Urlaub", new Date(2027, 0, 10), "🏖️"),
    fest("Mamas Geburtstag", new Date(2027, 0, 21), "💐"),
    fest("Erstes neues Gehalt", new Date(2027, 0, 28), "💶"),
    fest("Tage werden spürbar länger (Lichtmess)", new Date(2027, 1, 2), "🕯️"),
    fest("2/3 der Zeit geschafft", anteil(2 / 3), "💪"),
    fest("100-Nächte-Marke auf dem Weg zur Kita", new Date(ende - 100 * TAG_MS), "💯"),
    fest("50-Nächte-Marke auf dem Weg zur Kita", new Date(ende - 50 * TAG_MS), "🌟"),
    fest("Frühlingsanfang", new Date(2027, 2, 20), "🌷"),
    fest("Sommerzeit: abends wieder lange hell", new Date(2027, 2, 28), "☀️"),
    fest("Ostern", new Date(2027, 2, 28), "🐣"),
    fest("3/4 der Zeit geschafft", anteil(3 / 4), "🚀"),
    fest("Ein-Monats-Marke vor der Kita", new Date(2027, 4, 1), "📅"),
    fest("Schatzis Geburtstag", new Date(2027, 4, 7), "❤️"),
    fest("Eine-Woche-Marke vor der Kita", new Date(2027, 4, 25), "🎒"),
    fest("Kita-Beginn", KITA_BEGINN, "🏫"),
  ].sort((a, b) => a.datum.getTime() - b.datum.getTime() || a.titel.localeCompare(b.titel, "de"));
}

let cache: Etappe[] | null = null;

export function etappenListe(): Etappe[] {
  cache ??= baueEtappen();
  return cache;
}

export function etappenFeierId(etappe: Etappe): string {
  return `etappe-${etappe.id}`;
}

/** Etappen, deren Datum in der Lebenswoche liegt (Dienstag bis Dienstag, ab dem Geburtstag). */
export function etappenInLebenswoche(woche: number): Etappe[] {
  const anfang = datumFuerWoche(woche).getTime();
  const ende = datumFuerWoche(woche + 1).getTime();
  return etappenListe().filter((etappe) => {
    const zeit = etappe.datum.getTime();
    return zeit >= anfang && zeit < ende;
  });
}

export function istGoldeneWoche(woche: number): boolean {
  return etappenInLebenswoche(woche).length >= 3;
}
