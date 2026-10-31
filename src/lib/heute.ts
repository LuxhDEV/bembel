/** Lokale Kalenderdaten, ohne UTC-Verschiebung und ohne DST-Stolperfallen. */

export function mitternacht(datum: Date): Date {
  return new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
}

export function kalendertage(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcA - utcB) / 86_400_000);
}

export function datumPlusTage(basis: Date, tage: number): Date {
  const datum = mitternacht(basis);
  datum.setDate(datum.getDate() + tage);
  return datum;
}

/** Montag der Kalenderwoche (Sonntag zählt zur Woche davor). */
export function montagDerWoche(heute: Date): Date {
  const tag = mitternacht(heute);
  const verschiebung = tag.getDay() === 0 ? 6 : tag.getDay() - 1;
  tag.setDate(tag.getDate() - verschiebung);
  return tag;
}

export function parseHeuteParam(wert: string | null): Date | null {
  if (!wert || !/^\d{4}-\d{2}-\d{2}$/.test(wert)) return null;
  const teile = wert.split("-");
  const jahr = Number(teile[0]);
  const monat = Number(teile[1]);
  const tag = Number(teile[2]);
  if (!jahr || !monat || !tag) return null;
  const datum = new Date(jahr, monat - 1, tag);
  if (datum.getFullYear() !== jahr || datum.getMonth() !== monat - 1 || datum.getDate() !== tag) {
    return null;
  }
  return datum;
}
