import { useEffect, useState } from "react";
import { CalendarHeart, Flag } from "lucide-react";

import { istGoldeneWoche } from "@/data/etappen";
import { KonfettiFeld } from "@/components/FeierOverlay";
import {
  STORAGE_KEYS,
  isoTag,
  mottoFuerWoche,
  sonntagDieserWoche,
  wochenzielLaden,
  type WochenzielSpeicher,
} from "@/data/wahrnehmung";
import { MAX_WOCHE, datumFuerWoche, formatDatum, phaseFuerWoche } from "@/data/lebenslinie";

function zielOhneLeereFlags(
  stand: WochenzielSpeicher,
  text: string,
  erledigt: boolean,
): WochenzielSpeicher {
  const next: WochenzielSpeicher = { bis: stand.bis, text };
  if (stand.gemeistert) next.gemeistert = stand.gemeistert;
  if (erledigt) next.erledigt = true;
  return next;
}

function ZielBisSonntag({
  heute,
  stand,
  onText,
  onAbhaken,
}: {
  heute: Date;
  stand: WochenzielSpeicher;
  onText: (text: string) => void;
  onAbhaken: (erledigt: boolean) => void;
}) {
  const sonntag = sonntagDieserWoche(heute);

  return (
    <div className="app-karte p-4">
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
        onChange={(e) => onText(e.target.value)}
        placeholder="z. B. ein Spaziergang, ein frühes Abendbrot, eine ruhige Stunde"
        className="mt-3 min-h-12 w-full rounded-2xl border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary/60"
      />
      <label className="mt-3 flex min-h-11 items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={stand.erledigt === true}
          onChange={(e) => onAbhaken(e.target.checked)}
          className="h-5 w-5 accent-primary"
        />
        Diese Woche geschafft
      </label>
      {stand.gemeistert?.text ? (
        <p className="mt-3 rounded-2xl bg-calm-soft px-3 py-2 text-sm leading-snug">
          Bis {formatDatum(new Date(stand.gemeistert.bis + "T12:00:00"))} geschafft:{" "}
          {stand.gemeistert.text}
        </p>
      ) : null}
    </div>
  );
}

export function Nahfokus({
  heute,
  heuteWoche,
  onWocheWaehlen,
}: {
  heute: Date;
  heuteWoche: number;
  onWocheWaehlen: (woche: number) => void;
}) {
  const tagKey = isoTag(heute);
  const [stand, setStand] = useState<WochenzielSpeicher>(() => wochenzielLaden(null, heute));
  const [konfetti, setKonfetti] = useState(false);

  useEffect(() => {
    let roh: string | null = null;
    try {
      roh = localStorage.getItem(STORAGE_KEYS.wochenziel);
    } catch {
      roh = null;
    }
    const geladen = wochenzielLaden(roh, heute);
    setStand(geladen);
    try {
      localStorage.setItem(STORAGE_KEYS.wochenziel, JSON.stringify(geladen));
    } catch {
      /* privater Modus */
    }
  }, [tagKey, heute]);

  const schreiben = (next: WochenzielSpeicher) => {
    setStand(next);
    try {
      localStorage.setItem(STORAGE_KEYS.wochenziel, JSON.stringify(next));
    } catch {
      /* privater Modus */
    }
  };

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

      <ZielBisSonntag
        heute={heute}
        stand={stand}
        onText={(text) => schreiben(zielOhneLeereFlags(stand, text, stand.erledigt === true))}
        onAbhaken={(erledigt) => {
          schreiben(zielOhneLeereFlags(stand, stand.text, erledigt));
          if (erledigt) setKonfetti(true);
        }}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {wochen.map((woche) => {
          const phase = phaseFuerWoche(woche);
          const start = datumFuerWoche(woche);
          const ende = new Date(datumFuerWoche(woche + 1).getTime() - 86400000);
          const istJetzt = woche === heuteWoche;
          const golden = istGoldeneWoche(woche);
          return (
            <button
              key={woche}
              type="button"
              onClick={() => onWocheWaehlen(woche)}
              data-goldene-woche={golden ? "ja" : "nein"}
              className={[
                "app-karte min-h-28 p-4 text-left transition-transform active:scale-[0.99]",
                istJetzt ? "border-foreground/30" : "",
                golden ? "goldene-woche" : "",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {formatDatum(start)} – {formatDatum(ende)}
                </p>
                <span className="flex flex-wrap items-center justify-end gap-1">
                  {golden ? <span className="goldene-woche-plakette">Goldene Woche</span> : null}
                  {istJetzt && stand.erledigt ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold">
                      ✓ geschafft
                    </span>
                  ) : null}
                  {istJetzt ? (
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold text-background">
                      Diese Woche
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Lebenswoche {woche}
                    </span>
                  )}
                </span>
              </div>
              <p className="mt-2 font-display text-lg leading-snug font-semibold">
                {mottoFuerWoche(woche)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{phase.titel}</p>
            </button>
          );
        })}
      </div>

      {konfetti ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-foreground/40 p-3 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Wochenziel geschafft"
            className="app-karte relative w-full max-w-md overflow-hidden p-5"
          >
            <KonfettiFeld />
            <h2 className="relative font-display text-2xl font-semibold">Diese Woche geschafft.</h2>
            <p className="relative mt-2 text-sm text-muted-foreground">
              Schön, dass ihr euch etwas Gutes vorgenommen habt.
            </p>
            <button
              type="button"
              onClick={() => setKonfetti(false)}
              className="relative mt-4 min-h-12 w-full rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Schließen
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
