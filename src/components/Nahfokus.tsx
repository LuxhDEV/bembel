import { useEffect, useState } from "react";
import { CalendarHeart, Flag } from "lucide-react";

import {
  STORAGE_KEYS,
  isoTag,
  mottoFuerWoche,
  sonntagDieserWoche,
  wochenzielLaden,
  type WochenzielSpeicher,
} from "@/data/wahrnehmung";
import { MAX_WOCHE, datumFuerWoche, formatDatum, phaseFuerWoche } from "@/data/lebenslinie";

function ZielBisSonntag() {
  const heute = new Date();
  const tagKey = isoTag(new Date(heute.getFullYear(), heute.getMonth(), heute.getDate()));
  const sonntag = sonntagDieserWoche(heute);
  const [stand, setStand] = useState<WochenzielSpeicher>(() => wochenzielLaden(null, heute));

  useEffect(() => {
    const jetzt = new Date();
    let roh: string | null = null;
    try {
      roh = localStorage.getItem(STORAGE_KEYS.wochenziel);
    } catch {
      roh = null;
    }
    const geladen = wochenzielLaden(roh, jetzt);
    setStand(geladen);
    try {
      localStorage.setItem(STORAGE_KEYS.wochenziel, JSON.stringify(geladen));
    } catch {
      /* privater Modus */
    }
  }, [tagKey]);

  const speichern = (text: string) => {
    const next: WochenzielSpeicher = { ...stand, text };
    setStand(next);
    try {
      localStorage.setItem(STORAGE_KEYS.wochenziel, JSON.stringify(next));
    } catch {
      /* privater Modus */
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <label htmlFor="wochenziel" className="flex items-center gap-1.5 text-sm font-semibold">
        <Flag className="h-4 w-4 text-primary" />
        Was ist das Ziel bis Sonntag?
      </label>
      <p className="mt-1 text-xs text-muted-foreground">
        Bis {formatDatum(sonntag)} · bleibt auf diesem Gerät gespeichert
      </p>
      <input
        id="wochenziel"
        value={stand.text}
        onChange={(e) => speichern(e.target.value)}
        placeholder="z. B. ein Spaziergang, ein frühes Abendbrot, eine ruhige Stunde"
        className="mt-3 w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60"
      />
      {stand.gemeistert?.text ? (
        <p className="mt-3 rounded-2xl bg-calm-soft px-3 py-2 text-sm leading-snug">
          Bis {formatDatum(new Date(stand.gemeistert.bis + "T12:00:00"))} gemeistert:{" "}
          {stand.gemeistert.text}
        </p>
      ) : null}
    </div>
  );
}

export function Nahfokus({
  heuteWoche,
  onWocheWaehlen,
}: {
  heuteWoche: number;
  onWocheWaehlen: (woche: number) => void;
}) {
  const wochen = [0, 1, 2, 3]
    .map((versatz) => heuteWoche + versatz)
    .filter((woche) => woche >= 0 && woche <= MAX_WOCHE);

  return (
    <section className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <CalendarHeart className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold tracking-wide uppercase">
          Diese und die nächsten Wochen
        </h2>
      </div>

      <ZielBisSonntag />

      <div className="grid gap-3 sm:grid-cols-2">
        {wochen.map((woche) => {
          const phase = phaseFuerWoche(woche);
          const start = datumFuerWoche(woche);
          const ende = new Date(datumFuerWoche(woche + 1).getTime() - 86400000);
          const istJetzt = woche === heuteWoche;
          return (
            <button
              key={woche}
              type="button"
              onClick={() => onWocheWaehlen(woche)}
              className={[
                "rounded-3xl border bg-card p-4 text-left transition-shadow hover:shadow-sm",
                istJetzt ? "border-foreground/40 shadow-sm" : "border-border",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {formatDatum(start)} – {formatDatum(ende)}
                </p>
                {istJetzt ? (
                  <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold text-background">
                    Diese Woche
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    Lebenswoche {woche}
                  </span>
                )}
              </div>
              <p className="mt-2 font-display text-lg leading-snug font-semibold">
                {mottoFuerWoche(woche)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{phase.titel}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
