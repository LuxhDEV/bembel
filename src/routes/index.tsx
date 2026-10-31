import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Baby,
  Moon,
  Search,
  Sparkles,
  Heart,
  Gamepad2,
  CloudRain,
  X,
  Utensils,
  Lightbulb,
  Stethoscope,
  AlertTriangle,
  Sun,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";

import { MutmachZentrale } from "@/components/MutmachZentrale";
import { Nahfokus } from "@/components/Nahfokus";

import {
  PHASEN,
  MAX_WOCHE,
  STRESS_TEXT,
  aktuelleWoche,
  alterText,
  datumFuerWoche,
  formatDatum,
  phaseFuerWoche,
  type Phase,
} from "@/data/lebenslinie";
import { STORAGE_KEYS, bereichAusSpeicher, mottoFuerWoche, type Bereich } from "@/data/wahrnehmung";
import { useStoredString } from "@/hooks/use-stored-string";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Die Lebenslinie – diese Woche" },
      {
        name: "description",
        content:
          "Diese Woche mit Lina: Schlaf, Meilensteine und ein ruhiges Mantra. Die Gesamtansicht bleibt einen Tipp entfernt.",
      },
      { property: "og:title", content: "Die Lebenslinie – diese Woche" },
      {
        property: "og:description",
        content:
          "Wo seid ihr gerade? Stress-Tacho, Schlaf-Status und Meilensteine für die Woche, die gerade läuft.",
      },
    ],
  }),
  component: Lebenslinie,
});

const TON_STYLE: Record<Phase["ton"], { chip: string; line: string; label: string }> = {
  ruhig: {
    chip: "bg-calm-soft text-foreground border-calm/30",
    line: "bg-calm",
    label: "Ruhige Aufbau-Phase",
  },
  wachstum: {
    chip: "bg-growth-soft text-foreground border-growth/40",
    line: "bg-growth",
    label: "Wachstums- & Entspannungssprung",
  },
  intensiv: {
    chip: "bg-intense-soft text-foreground border-intense/40",
    line: "bg-intense",
    label: "Intensiv- & Entwicklungsphase",
  },
};

type Filter = "alle" | "regression" | "spiel" | "schlaf";

const FILTER: { id: Filter; label: string; icon: typeof Heart }[] = [
  { id: "alle", label: "Ganze Lebenslinie", icon: Heart },
  { id: "regression", label: "Unruhigere Phasen", icon: CloudRain },
  { id: "spiel", label: "Spaß & Spiel-Meilensteine", icon: Gamepad2 },
  { id: "schlaf", label: "Schlaf-Entwicklung", icon: Moon },
];

function StressTacho({ wert, gross = false }: { wert: number; gross?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" aria-label={`Stresslevel ${wert} von 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={[
              "rounded-full transition-all",
              gross ? "h-3 w-7" : "h-2 w-4",
              i <= wert ? (i <= 2 ? "bg-calm" : i === 3 ? "bg-growth" : "bg-intense") : "bg-border",
            ].join(" ")}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{wert}/5</span>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  titel,
  text,
}: {
  icon: typeof Heart;
  titel: string;
  text: string;
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {titel}
        </p>
        <p className="text-sm leading-snug">{text}</p>
      </div>
    </div>
  );
}

function InfoListe({
  icon: Icon,
  titel,
  punkte,
}: {
  icon: typeof Heart;
  titel: string;
  punkte: string[];
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {titel}
        </p>
        <ul className="mt-0.5 space-y-0.5 text-sm leading-snug">
          {punkte.map((t) => (
            <li key={t} className="before:mr-1.5 before:content-['•']">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const BEREICHE: { id: Bereich; label: string; icon: typeof Sun }[] = [
  { id: "heute", label: "Heute", icon: Sun },
  { id: "wochen", label: "Wochen", icon: CalendarDays },
  { id: "meilensteine", label: "Meilensteine", icon: Sparkles },
  { id: "gesamt", label: "Gesamt", icon: LayoutGrid },
];

function BereichNav({
  bereich,
  onWaehlen,
  variante,
}: {
  bereich: Bereich;
  onWaehlen: (naechster: Bereich) => void;
  variante: "leiste" | "seite";
}) {
  return (
    <nav
      aria-label="Bereiche"
      className={
        variante === "leiste"
          ? "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] shadow-[0_-10px_28px_-18px_oklch(0.4_0.03_70/0.5)] backdrop-blur lg:hidden"
          : "sticky top-0 flex h-dvh flex-col gap-1 border-r border-border bg-card/80 p-4"
      }
    >
      {variante === "seite" ? (
        <div className="px-3 pt-2 pb-4">
          <p className="flex items-center gap-2 font-display text-xl font-semibold">
            <Baby className="h-5 w-5 text-primary" />
            Lebenslinie
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Seit 30.06.2026</p>
        </div>
      ) : null}
      <div className={variante === "leiste" ? "grid grid-cols-4 gap-1" : "flex flex-col gap-1.5"}>
        {BEREICHE.map((eintrag) => {
          const Icon = eintrag.icon;
          const aktiv = bereich === eintrag.id;
          return (
            <button
              key={eintrag.id}
              type="button"
              aria-current={aktiv ? "page" : undefined}
              onClick={() => onWaehlen(eintrag.id)}
              className={[
                "font-semibold transition-colors",
                variante === "leiste"
                  ? "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-[11px]"
                  : "flex min-h-12 items-center gap-3 rounded-2xl px-3 text-left text-sm",
                aktiv
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent",
              ].join(" ")}
            >
              <Icon className={variante === "leiste" ? "h-5 w-5" : "h-4 w-4"} />
              {eintrag.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Lebenslinie() {
  const heuteWoche = Math.max(0, Math.min(MAX_WOCHE, aktuelleWoche()));
  const [filter, setFilter] = useState<Filter>("alle");
  const [suche, setSuche] = useState("");
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [bereichRoh, setBereichRoh] = useStoredString(STORAGE_KEYS.bereich, "heute");
  const bereich = bereichAusSpeicher(bereichRoh);
  const gesamt = bereich === "gesamt";
  const bereichSetzen = (naechster: Bereich) => setBereichRoh(naechster);

  const aktuellePhase = phaseFuerWoche(heuteWoche);
  const wochenMotto = mottoFuerWoche(heuteWoche);

  const sichtbar = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return PHASEN.filter((p) => {
      const passtFilter = filter === "alle" || p.tags.includes(filter);
      if (!passtFilter) return false;
      if (!q) return true;
      const text = [
        p.titel,
        p.kurz,
        p.abschnitt,
        p.schlaf,
        p.schlafStatus,
        p.motivation,
        p.wachfenster,
        p.schlafbedarf,
        p.ernaehrung,
        p.elternfokus,
        p.vorsorge,
        p.achtung,
        ...p.spielideen,
        ...p.alltagstipps,
        ...p.meilensteine,
      ]

        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [filter, suche]);

  const detail = gewaehlt === null ? null : phaseFuerWoche(gewaehlt);
  const phasenListe = gesamt ? sichtbar : [aktuellePhase];

  const titel =
    bereich === "wochen"
      ? "Diese und die nächsten Wochen"
      : bereich === "meilensteine"
        ? "Momente, auf die ihr euch freuen dürft"
        : bereich === "gesamt"
          ? `${alterText(heuteWoche)} – ${aktuellePhase.titel}`
          : wochenMotto;
  const untertitel =
    bereich === "heute"
      ? aktuellePhase.titel
      : bereich === "gesamt"
        ? wochenMotto
        : "Die Lebenslinie · seit 30.06.2026";

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <div className="hidden lg:block">
        <BereichNav bereich={bereich} onWaehlen={bereichSetzen} variante="seite" />
      </div>
      <main className="min-w-0">
        <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28 lg:max-w-5xl lg:px-8 lg:pt-8 lg:pb-12">
          <header>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase lg:hidden">
              <Baby className="h-4 w-4 text-primary" />
              Die Lebenslinie
            </p>
            <h1 className="mt-2 font-display text-3xl leading-tight font-semibold sm:text-4xl">
              {titel}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">{untertitel}</p>

            {bereich === "heute" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="app-karte p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Stress-Tacho</p>
                  <div className="mt-2">
                    <StressTacho wert={aktuellePhase.stress} gross />
                  </div>
                  <p className="mt-1 text-sm">{STRESS_TEXT[aktuellePhase.stress]}</p>
                </div>
                <div className="app-karte p-3">
                  <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Moon className="h-3.5 w-3.5" /> Schlaf-Status
                  </p>
                  <p className="mt-2 text-sm leading-snug">{aktuellePhase.schlafStatus}</p>
                </div>
                <div className={`app-karte p-3 ${TON_STYLE[aktuellePhase.ton].chip}`}>
                  <p className="flex items-center gap-1 text-xs font-semibold opacity-70">
                    <Sparkles className="h-3.5 w-3.5" /> Mantra der Woche
                  </p>
                  <p className="mt-2 text-sm leading-snug font-medium">
                    „{aktuellePhase.motivation}“
                  </p>
                </div>
              </div>
            ) : null}
          </header>

          <div className="mt-5 space-y-5">
            {bereich === "heute" || bereich === "meilensteine" || bereich === "gesamt" ? (
              <MutmachZentrale
                heuteWoche={heuteWoche}
                onPhaseWaehlen={(w) => setGewaehlt(w)}
                bereich={bereich === "wochen" ? "heute" : bereich}
              />
            ) : null}

            {bereich === "wochen" ? (
              <Nahfokus heuteWoche={heuteWoche} onWocheWaehlen={(w) => setGewaehlt(w)} />
            ) : null}

            {gesamt ? (
              <section className="app-karte p-4">
                <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                  <span>Woche 0</span>
                  <span className="font-semibold text-foreground">
                    Wir sind bei Woche {heuteWoche}
                  </span>
                  <span>Woche 208</span>
                </div>
                <div className="relative mt-6 mb-6 h-4 w-full overflow-visible rounded-full">
                  <div className="flex h-4 w-full overflow-hidden rounded-full">
                    {PHASEN.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setGewaehlt(p.von)}
                        title={`Woche ${p.von}–${p.bis}: ${p.titel}`}
                        aria-label={`Woche ${p.von} bis ${p.bis}: ${p.titel}`}
                        className={`h-full ${TON_STYLE[p.ton].line} opacity-80 transition-opacity hover:opacity-100`}
                        style={{ width: `${((p.bis - p.von + 1) / (MAX_WOCHE + 1)) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div
                    className="pointer-events-none absolute -top-3 -translate-x-1/2"
                    style={{ left: `${(heuteWoche / MAX_WOCHE) * 100}%` }}
                  >
                    <div className="h-10 w-1 rounded-full bg-foreground/80" />
                    <div className="absolute -top-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-background bg-foreground" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {(["ruhig", "wachstum", "intensiv"] as const).map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${TON_STYLE[t].line}`} />
                      {TON_STYLE[t].label}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Filter & Suche – nur in der Gesamtansicht, damit der Alltag nah bleibt */}
            {gesamt ? (
              <section className="mt-5 space-y-3">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={suche}
                    onChange={(e) => setSuche(e.target.value)}
                    placeholder="Suche: Karten spielen, unruhige Abende, Lächeln, Obstgarten …"
                    className="min-h-12 w-full rounded-2xl border border-border bg-card py-3 pr-4 pl-10 text-base outline-none focus:border-primary/60"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {FILTER.map((f) => {
                    const Icon = f.icon;
                    const aktiv = filter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={[
                          "flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
                          aktiv
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:bg-accent",
                        ].join(" ")}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {bereich === "heute" || bereich === "gesamt" ? (
              <section className="relative">
                <div className="absolute top-2 bottom-2 left-[15px] w-0.5 rounded-full bg-border sm:left-[19px]" />
                <div className="space-y-4">
                  {phasenListe.map((p) => {
                    const istJetzt = heuteWoche >= p.von && heuteWoche <= p.bis;
                    return (
                      <article key={p.id} className="relative pl-10 sm:pl-14">
                        <span
                          className={`absolute top-6 left-2 h-4 w-4 rounded-full border-2 border-background sm:left-[11px] ${TON_STYLE[p.ton].line}`}
                        />
                        <div
                          className={[
                            "app-karte p-4",
                            istJetzt ? "border-foreground/40 shadow-sm" : "border-border",
                          ].join(" ")}
                        >
                          {istJetzt && (
                            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background">
                              Wo wir gerade sind
                            </span>
                          )}
                          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            {p.abschnitt}
                          </p>
                          <h2 className="mt-1 text-lg font-semibold">
                            {gesamt ? `Woche ${p.von}–${p.bis}: ${p.titel}` : p.titel}
                          </h2>
                          <p className="text-sm text-muted-foreground">{p.kurz}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <StressTacho wert={p.stress} />
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${TON_STYLE[p.ton].chip}`}
                            >
                              {TON_STYLE[p.ton].label}
                            </span>
                          </div>

                          <p className="mt-3 flex gap-2 text-sm">
                            <Moon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>{p.schlaf}</span>
                          </p>

                          <ul className="mt-2 space-y-1 text-sm">
                            {p.meilensteine.map((m) => (
                              <li key={m} className="flex gap-2">
                                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div className="rounded-2xl bg-accent/50 p-3">
                              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                                Wachfenster
                              </p>
                              <p className="text-sm">{p.wachfenster}</p>
                            </div>
                            <div className="rounded-2xl bg-accent/50 p-3">
                              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                                Schlafbedarf
                              </p>
                              <p className="text-sm">{p.schlafbedarf}</p>
                            </div>
                          </div>

                          <details className="group mt-3 rounded-2xl border border-border/70 p-3">
                            <summary className="cursor-pointer list-none text-sm font-semibold text-primary">
                              Mehr Infos: Ernährung, Spielideen, Tipps &amp; Vorsorge
                            </summary>
                            <div className="mt-3 space-y-3">
                              <InfoBlock icon={Utensils} titel="Ernährung" text={p.ernaehrung} />
                              <InfoListe icon={Gamepad2} titel="Spielideen" punkte={p.spielideen} />
                              <InfoListe
                                icon={Lightbulb}
                                titel="Alltagstipps"
                                punkte={p.alltagstipps}
                              />
                              <InfoBlock
                                icon={Heart}
                                titel="Für euch als Eltern"
                                text={p.elternfokus}
                              />
                              <InfoBlock
                                icon={Stethoscope}
                                titel="Vorsorge & Termine"
                                text={p.vorsorge}
                              />
                              <InfoBlock
                                icon={AlertTriangle}
                                titel="Gut zu wissen"
                                text={p.achtung}
                              />
                            </div>
                          </details>

                          {gesamt ? (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {Array.from({ length: p.bis - p.von + 1 }, (_, i) => p.von + i).map(
                                (w) => (
                                  <button
                                    key={w}
                                    type="button"
                                    onClick={() => setGewaehlt(w)}
                                    className={[
                                      "h-9 min-w-9 rounded-xl px-1.5 text-xs font-semibold transition-transform hover:scale-105",
                                      w === heuteWoche
                                        ? "bg-foreground text-background"
                                        : `${TON_STYLE[p.ton].chip} border`,
                                    ].join(" ")}
                                  >
                                    {w}
                                  </button>
                                ),
                              )}
                            </div>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                  {gesamt && sichtbar.length === 0 && (
                    <p className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                      Nichts gefunden. Versuch es z. B. mit „Memory“, „Witching Hour“ oder
                      „Beikost“.
                    </p>
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
      <BereichNav bereich={bereich} onWaehlen={bereichSetzen} variante="leiste" />

      {/* Detailansicht */}
      {detail && gewaehlt !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-6"
          onClick={() => setGewaehlt(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {detail.abschnitt}
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  Woche {gewaehlt} · {detail.titel}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDatum(datumFuerWoche(gewaehlt))} –{" "}
                  {formatDatum(new Date(datumFuerWoche(gewaehlt + 1).getTime() - 86400000))}
                </p>
                <p className="mt-1 text-sm font-medium">{mottoFuerWoche(gewaehlt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setGewaehlt(null)}
                aria-label="Schließen"
                className="rounded-full border border-border p-2 text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-border p-3">
                <p className="text-xs font-semibold text-muted-foreground">Stress-Tacho</p>
                <div className="mt-2">
                  <StressTacho wert={detail.stress} gross />
                </div>
                <p className="mt-1 text-sm">{STRESS_TEXT[detail.stress]}</p>
              </div>

              <div className="rounded-2xl border border-border p-3">
                <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <Moon className="h-3.5 w-3.5" /> Schlaf
                </p>
                <p className="mt-1 text-sm">{detail.schlaf}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Wachfenster: {detail.wachfenster} · Schlafbedarf: {detail.schlafbedarf}
                </p>
              </div>

              <div className="rounded-2xl border border-border p-3">
                <p className="text-xs font-semibold text-muted-foreground">Meilensteine</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {detail.meilensteine.map((m) => (
                    <li key={m} className="flex gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 rounded-2xl border border-border p-3">
                <InfoBlock icon={Utensils} titel="Ernährung" text={detail.ernaehrung} />
                <InfoListe icon={Gamepad2} titel="Spielideen" punkte={detail.spielideen} />
                <InfoListe icon={Lightbulb} titel="Alltagstipps" punkte={detail.alltagstipps} />
                <InfoBlock icon={Heart} titel="Für euch als Eltern" text={detail.elternfokus} />
                <InfoBlock icon={Stethoscope} titel="Vorsorge & Termine" text={detail.vorsorge} />
                <InfoBlock icon={AlertTriangle} titel="Gut zu wissen" text={detail.achtung} />
              </div>

              <div className={`rounded-2xl border p-3 ${TON_STYLE[detail.ton].chip}`}>
                <p className="text-xs font-semibold opacity-70">Motivation</p>
                <p className="mt-1 text-sm font-medium">„{detail.motivation}“</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
