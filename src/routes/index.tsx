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
} from "lucide-react";


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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Die Lebenslinie – Kindesentwicklung Woche 0 bis 208" },
      {
        name: "description",
        content:
          "Interaktive Zeitlinie von der Geburt bis zum 4. Lebensjahr: Schlafentwicklung, Meilensteine, Stresslevel und ein Mantra für jede Woche.",
      },
      { property: "og:title", content: "Die Lebenslinie – Begleitung durch Woche 0 bis 208" },
      {
        property: "og:description",
        content:
          "Wo seid ihr gerade? Stress-Tacho, Schlaf-Status und Meilensteine für jede Woche der ersten vier Jahre.",
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
  { id: "regression", label: "Schwierige Phasen / Regressions", icon: CloudRain },
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
              i <= wert
                ? i <= 2
                  ? "bg-calm"
                  : i === 3
                    ? "bg-growth"
                    : "bg-intense"
                : "bg-border",
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


function Lebenslinie() {
  const heuteWoche = Math.max(0, Math.min(MAX_WOCHE, aktuelleWoche()));
  const [filter, setFilter] = useState<Filter>("alle");
  const [suche, setSuche] = useState("");
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);

  const aktuellePhase = phaseFuerWoche(heuteWoche);

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

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header & Status-Dashboard */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-sand/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Baby className="h-4 w-4 text-primary" />
            Die Lebenslinie · seit 30.06.2026
          </div>

          <h1 className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl">
            {alterText(heuteWoche)} – {aktuellePhase.titel}
          </h1>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground">Stress-Tacho</p>
              <div className="mt-2">
                <StressTacho wert={aktuellePhase.stress} gross />
              </div>
              <p className="mt-1 text-sm">{STRESS_TEXT[aktuellePhase.stress]}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-3">
              <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Moon className="h-3.5 w-3.5" /> Schlaf-Status
              </p>
              <p className="mt-2 text-sm leading-snug">{aktuellePhase.schlafStatus}</p>
            </div>

            <div
              className={`rounded-2xl border p-3 ${TON_STYLE[aktuellePhase.ton].chip}`}
            >
              <p className="flex items-center gap-1 text-xs font-semibold opacity-70">
                <Sparkles className="h-3.5 w-3.5" /> Mantra der Woche
              </p>
              <p className="mt-2 text-sm leading-snug font-medium">
                „{aktuellePhase.motivation}“
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4">
        <MutmachZentrale heuteWoche={heuteWoche} onPhaseWaehlen={(w) => setGewaehlt(w)} />

        {/* Übersichtsleiste 0–208 */}
        <section className="mt-6 rounded-3xl border border-border bg-card p-4">
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

        {/* Filter & Suche */}
        <section className="mt-5 space-y-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Suche: Karten spielen, Schreiphase, Lächeln, Obstgarten …"
              className="w-full rounded-2xl border border-border bg-card py-3 pr-4 pl-10 text-sm outline-none focus:border-primary/60"
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
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
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

        {/* Zeitstrahl */}
        <section className="relative mt-8">
          <div className="absolute top-2 bottom-2 left-[15px] w-0.5 rounded-full bg-border sm:left-[19px]" />
          <div className="space-y-4">
            {sichtbar.map((p) => {
              const istJetzt = heuteWoche >= p.von && heuteWoche <= p.bis;
              return (
                <article key={p.id} className="relative pl-10 sm:pl-14">
                  <span
                    className={`absolute top-6 left-2 h-4 w-4 rounded-full border-2 border-background sm:left-[11px] ${TON_STYLE[p.ton].line}`}
                  />
                  <div
                    className={[
                      "rounded-3xl border bg-card p-4 transition-shadow hover:shadow-sm",
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
                      Woche {p.von}–{p.bis}: {p.titel}
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
                        <InfoBlock
                          icon={Utensils}
                          titel="Ernährung"
                          text={p.ernaehrung}
                        />
                        <InfoListe
                          icon={Gamepad2}
                          titel="Spielideen"
                          punkte={p.spielideen}
                        />
                        <InfoListe
                          icon={Lightbulb}
                          titel="Alltagstipps"
                          punkte={p.alltagstipps}
                        />
                        <InfoBlock icon={Heart} titel="Für euch als Eltern" text={p.elternfokus} />
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



                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {Array.from({ length: p.bis - p.von + 1 }, (_, i) => p.von + i).map(
                        (w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setGewaehlt(w)}
                            className={[
                              "h-7 min-w-7 rounded-lg px-1.5 text-[11px] font-semibold transition-transform hover:scale-110",
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
                  </div>
                </article>
              );
            })}
            {sichtbar.length === 0 && (
              <p className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nichts gefunden. Versuch es z. B. mit „Memory“, „Witching Hour“ oder
                „Beikost“.
              </p>
            )}
          </div>
        </section>
      </div>

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
    </main>
  );
}
