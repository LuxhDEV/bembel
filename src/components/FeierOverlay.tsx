import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { feiernLaden, feiernMerken, offeneFeiern, type Feier } from "@/data/feiern";
import { isoTag } from "@/data/wahrnehmung";

const FARBEN = ["bg-primary", "bg-growth", "bg-intense", "bg-calm", "bg-foreground"];

let laufTag: string | null = null;
let laufQueue: Feier[] | null = null;

export function KonfettiFeld() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className={`konfetti-feier ${FARBEN[i % FARBEN.length]}`}
          style={{
            left: `${4 + ((i * 13) % 92)}%`,
            animationDelay: `${(i % 6) * 0.12}s`,
            animationDuration: `${1.8 + (i % 4) * 0.25}s`,
          }}
        />
      ))}
    </span>
  );
}

function EmojiRegen({ emoji }: { emoji: string }) {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="emoji-regen"
          style={{
            left: `${6 + ((i * 17) % 86)}%`,
            animationDelay: `${(i % 5) * 0.15}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </span>
  );
}

function FeierKarte({
  feier,
  offen,
  onOeffnen,
}: {
  feier: Feier;
  offen: boolean;
  onOeffnen: () => void;
}) {
  if (feier.art === "zehner") {
    return (
      <>
        <KonfettiFeld />
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Zehn Nächte
        </p>
        <h2 className="relative mt-2 font-display text-3xl leading-tight font-semibold">
          {feier.text}
        </h2>
        <p className="relative mt-2 text-sm text-muted-foreground">
          Schön, dass ihr diese Nächte zusammen wart.
        </p>
      </>
    );
  }

  if (feier.art === "etappe") {
    return (
      <>
        <EmojiRegen emoji={feier.emoji} />
        <p className="relative text-4xl" aria-hidden>
          {feier.emoji}
        </p>
        <h2 className="relative mt-2 font-display text-2xl leading-tight font-semibold">
          {feier.titel}
        </h2>
        <p className="relative mt-1 text-sm text-muted-foreground">{feier.datumText}</p>
        <p className="relative mt-3 text-sm">
          {feier.heute ? "Heute ist es so weit." : "Das habt ihr seit dem letzten Öffnen erreicht."}
        </p>
      </>
    );
  }

  if (feier.art === "medaille") {
    return (
      <>
        <p className="text-4xl" aria-hidden>
          🏅
        </p>
        <p className="mt-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Sondermedaille
        </p>
        <h2 className="mt-1 font-display text-3xl leading-tight font-semibold">
          {feier.naechte} Nächte zusammen erlebt
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Die Medaille liegt ab jetzt bei euren Meilensteinen.
        </p>
      </>
    );
  }

  if (feier.art === "geschenk") {
    if (!offen) {
      return (
        <>
          <p className="text-5xl" aria-hidden>
            🎁
          </p>
          <h2 className="mt-3 font-display text-2xl leading-tight font-semibold">
            Ein kleines Geschenk für diese Woche
          </h2>
          <button
            type="button"
            data-feier-oeffnen
            onClick={onOeffnen}
            className="mt-4 min-h-12 w-full rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Zum Öffnen tippen
          </button>
        </>
      );
    }
    return (
      <div className="geschenk-inhalt">
        <p className="text-4xl" aria-hidden>
          🎁
        </p>
        <p className="mt-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Wochenmotto
        </p>
        <h2 data-feier-motto className="mt-1 font-display text-2xl leading-tight font-semibold">
          {feier.motto}
        </h2>
        <p className="mt-3 text-sm leading-snug">
          <span className="font-semibold">Tipp: </span>
          {feier.tipp}
        </p>
      </div>
    );
  }

  if (feier.art === "level") {
    return (
      <>
        <p className="text-5xl" aria-hidden>
          {feier.emoji}
        </p>
        <p className="mt-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Level {feier.nr}
        </p>
        <h2 className="mt-1 font-display text-2xl leading-tight font-semibold">{feier.titel}</h2>
        <p className="mt-3 text-sm font-semibold">Kurzer Rückblick auf „{feier.phasenName}“</p>
        <ul className="mt-2 space-y-1 text-sm">
          {feier.rueckblick.map((punkt) => (
            <li key={punkt}>✦ {punkt}</li>
          ))}
        </ul>
      </>
    );
  }

  if (feier.art === "phase") {
    return (
      <>
        <p className="text-5xl" aria-hidden>
          {feier.emoji}
        </p>
        <p className="mt-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Neue Phase
        </p>
        <h2 className="mt-1 font-display text-2xl leading-tight font-semibold">
          {feier.neuePhase}
        </h2>
        <p className="mt-3 text-sm font-semibold">Rückblick auf „{feier.altePhase}“</p>
        <ul className="mt-2 space-y-1 text-sm">
          {feier.rueckblick.map((punkt) => (
            <li key={punkt}>✦ {punkt}</li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <p className="text-4xl" aria-hidden>
        💌
      </p>
      <p className="mt-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Eine kleine Überraschung
      </p>
      <h2 className="mt-2 font-display text-xl leading-snug font-semibold">{feier.satz}</h2>
      <p className="mt-3 text-xs text-muted-foreground">
        Eine liebe Notiz, kein medizinischer Rat.
      </p>
    </>
  );
}

export function FeierOverlay({ heute, bereit }: { heute: Date; bereit: boolean }) {
  const [queue, setQueue] = useState<Feier[]>([]);
  const [index, setIndex] = useState(0);
  const [offen, setOffen] = useState(false);
  const tag = isoTag(heute);
  const feier = queue[index];

  useEffect(() => {
    if (!bereit) return;
    if (laufTag === tag && laufQueue) {
      setQueue(laufQueue);
      setIndex(0);
      return;
    }
    const speicher = feiernLaden();
    const { feiern, still } = offeneFeiern({
      heute,
      letztesOeffnen: speicher.letztesOeffnen,
      gezeigt: speicher.gezeigt,
    });
    feiernMerken([...feiern.map((eintrag) => eintrag.id), ...still], heute);
    laufTag = tag;
    laufQueue = feiern;
    setQueue(feiern);
    setIndex(0);
  }, [bereit, tag, heute]);

  useEffect(() => {
    setOffen(false);
  }, [index]);

  useEffect(() => {
    if (!feier) return;
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorher;
    };
  }, [feier]);

  if (!feier) return null;

  const letzte = index >= queue.length - 1;
  const schliessen = () => setQueue([]);
  const weiter = () => {
    if (letzte) schliessen();
    else setIndex((wert) => wert + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/40 p-3 sm:items-center"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feier-titel"
        data-feier={feier.art}
        className="app-karte relative max-h-[85dvh] w-full max-w-md overflow-y-auto p-5"
      >
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {queue.length > 1 ? `${index + 1} von ${queue.length}` : "Für euch"}
            </p>
            <button
              type="button"
              onClick={schliessen}
              aria-label="Schließen"
              className="rounded-full border border-border p-2 text-muted-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div id="feier-titel" className="relative mt-2">
            <FeierKarte feier={feier} offen={offen} onOeffnen={() => setOffen(true)} />
          </div>
          <button
            type="button"
            onClick={weiter}
            className="relative mt-5 min-h-12 w-full rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {letzte ? "Schließen" : "Weiter"}
          </button>
        </div>
      </div>
    </div>
  );
}
