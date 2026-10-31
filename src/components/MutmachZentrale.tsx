import { useState } from "react";
import {
  Moon,
  Sparkles,
  Sunrise,
  CalendarHeart,
  School,
  ListChecks,
  ChevronUp,
} from "lucide-react";
import {
  PHASEN,
  GEBURTSDATUM,
  datumFuerWoche,
  formatDatum,
  phaseFuerWoche,
  type Phase,
} from "@/data/lebenslinie";
import {
  EINHEITEN,
  STORAGE_KEYS,
  LEVELS,
  einheitAusSpeicher,
  kleineZahl,
  levelStand,
  naechsterZaubermoment,
  sichtbareLevel,
  sprintStand,
  ungefaehrIn,
  type Einheit,
} from "@/data/wahrnehmung";
import { useStoredString } from "@/hooks/use-stored-string";

const TAG_MS = 1000 * 60 * 60 * 24;
const KITA_BEGINN = new Date(2027, 5, 1); // 01.06.2027

const MUTMACH_SPRUECHE = [
  "Du machst das gerade gut genug – und genug ist genau richtig.",
  "Kein Kind erinnert sich an eine aufgeräumte Wohnung, aber an ruhige Arme.",
  "Jede Nacht, die ihr zusammen wach wart, hat euch näher gebracht.",
  "Diese Phase geht vorbei – und ihr geht sie zusammen.",
  "Ihr seid kein Elternteam auf Probe – ihr seid genau das richtige Team.",
  "Heute reicht: satt, sauber, geliebt.",
  "Wachsen geht in Wellen – Pausen gehören dazu.",
];

function tageDiff(a: Date, b: Date) {
  const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((d1 - d2) / TAG_MS);
}

// Tägengenaue (gebrochene) Differenz für fließende Fortschrittsanzeigen.
function tageDiffExact(a: Date, b: Date) {
  return (a.getTime() - b.getTime()) / TAG_MS;
}

function Kachel({
  icon: Icon,
  label,
  wert,
  sub,
  akzent = false,
}: {
  icon: typeof Moon;
  label: string;
  wert: string;
  sub?: string;
  akzent?: boolean;
}) {
  return (
    <div className={["app-karte p-4", akzent ? "border-primary/30 bg-primary/10" : ""].join(" ")}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1.5 font-display text-2xl leading-tight font-semibold">{wert}</p>
      {sub ? <p className="mt-1 text-xs leading-snug text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function KitaEtappen({ heute, einheit }: { heute: Date; einheit: Einheit }) {
  const [alleAnzeigen, setAlleAnzeigen] = useState(false);
  const start = GEBURTSDATUM.getTime();
  const ende = KITA_BEGINN.getTime();
  const anteil = (f: number) => new Date(start + (ende - start) * f);
  const etappen: { titel: string; datum: Date; emoji: string }[] = [
    { titel: "Herbstanfang", datum: new Date(2026, 8, 23), emoji: "🍂" },
    {
      titel: "Winterzeit: früher dunkel, dafür morgens heller",
      datum: new Date(2026, 9, 25),
      emoji: "🕰️",
    },
    { titel: "Halbzeit bis zur Kita", datum: anteil(1 / 2), emoji: "⚖️" },
    { titel: "Nikolaus", datum: new Date(2026, 11, 6), emoji: "🎅" },
    {
      titel: "Kürzester Tag – ab jetzt werden die Tage wieder länger",
      datum: new Date(2026, 11, 21),
      emoji: "🌅",
    },
    { titel: "Weihnachten", datum: new Date(2026, 11, 24), emoji: "🎄" },
    { titel: "Baby wird ½ Jahr alt", datum: new Date(2026, 11, 30), emoji: "🎂" },
    { titel: "Silvester", datum: new Date(2026, 11, 31), emoji: "🎆" },
    { titel: "Urlaub", datum: new Date(2027, 0, 10), emoji: "🏖️" },
    { titel: "Mamas Geburtstag", datum: new Date(2027, 0, 21), emoji: "💐" },
    { titel: "Erstes neues Gehalt", datum: new Date(2027, 0, 28), emoji: "💶" },
    { titel: "Tage werden spürbar länger (Lichtmess)", datum: new Date(2027, 1, 2), emoji: "🕯️" },
    { titel: "2/3 der Zeit geschafft", datum: anteil(2 / 3), emoji: "💪" },
    {
      titel: "100-Nächte-Marke auf dem Weg zur Kita",
      datum: new Date(ende - 100 * TAG_MS),
      emoji: "💯",
    },
    {
      titel: "50-Nächte-Marke auf dem Weg zur Kita",
      datum: new Date(ende - 50 * TAG_MS),
      emoji: "🌟",
    },
    { titel: "Frühlingsanfang", datum: new Date(2027, 2, 20), emoji: "🌷" },
    { titel: "Sommerzeit: abends wieder lange hell", datum: new Date(2027, 2, 28), emoji: "☀️" },
    { titel: "Ostern", datum: new Date(2027, 2, 28), emoji: "🐣" },
    { titel: "3/4 der Zeit geschafft", datum: anteil(3 / 4), emoji: "🚀" },
    { titel: "Ein-Monats-Marke vor der Kita", datum: new Date(2027, 4, 1), emoji: "📅" },
    { titel: "Schatzis Geburtstag", datum: new Date(2027, 4, 7), emoji: "❤️" },
    { titel: "Eine-Woche-Marke vor der Kita", datum: new Date(2027, 4, 25), emoji: "🎒" },
    { titel: "Kita-Beginn", datum: KITA_BEGINN, emoji: "🏫" },
  ].sort((a, b) => a.datum.getTime() - b.datum.getTime());

  const naechsteIdx = etappen.findIndex((e) => tageDiff(e.datum, heute) >= 0);
  const geschafft = naechsteIdx === -1 ? etappen.length : naechsteIdx;
  const naechste = naechsteIdx === -1 ? null : etappen[naechsteIdx];
  const n = naechste ? tageDiff(naechste.datum, heute) : 0;

  return (
    <div className="mt-4 rounded-2xl border border-border bg-background/50 p-3">
      <p className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <span className="flex items-center gap-1.5">
          <School className="h-3.5 w-3.5" /> Nächste Etappe bis zur Kita
        </span>
        <span>
          {geschafft} / {etappen.length} geschafft
        </span>
      </p>
      {naechste ? (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5">
          <span className="text-2xl" aria-hidden>
            {naechste.emoji}
          </span>
          <div className="flex-1 leading-tight">
            <p className="text-sm font-semibold">{naechste.titel}</p>
            <p className="text-[11px] text-muted-foreground">{formatDatum(naechste.datum)}</p>
          </div>
          <p className="text-right text-sm font-semibold">
            {n === 0 ? "Heute!" : kleineZahl(n, einheit).satz}
          </p>
        </div>
      ) : (
        <p className="mt-2 rounded-xl bg-calm-soft px-3 py-2.5 text-sm font-medium">
          Alle Etappen geschafft – die Kita kann kommen! 🎉
        </p>
      )}

      <button
        type="button"
        onClick={() => setAlleAnzeigen((v) => !v)}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent"
      >
        {alleAnzeigen ? (
          <>
            <ChevronUp className="h-3.5 w-3.5" /> Nur die nächste Etappe anzeigen
          </>
        ) : (
          <>
            <ListChecks className="h-3.5 w-3.5" /> Alle {etappen.length} Etappen anzeigen
          </>
        )}
      </button>

      {alleAnzeigen ? (
        <ul className="mt-2 space-y-1">
          {etappen.map((e, i) => {
            const geschafftEtappe = i < geschafft;
            const istNaechste = i === naechsteIdx;
            const diff = tageDiff(e.datum, heute);
            return (
              <li
                key={`${e.titel}-${e.datum.getTime()}`}
                className={[
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm leading-tight",
                  istNaechste
                    ? "border border-primary/40 bg-primary/10 font-semibold"
                    : geschafftEtappe
                      ? "text-muted-foreground"
                      : "bg-background/60",
                ].join(" ")}
              >
                <span className="text-lg" aria-hidden>
                  {geschafftEtappe ? "✅" : e.emoji}
                </span>
                <span className="flex-1">
                  {e.titel}
                  <span className="block text-[11px] font-normal text-muted-foreground">
                    {formatDatum(e.datum)}
                  </span>
                </span>
                <span className="text-right text-xs font-semibold">
                  {geschafftEtappe
                    ? "geschafft"
                    : diff === 0
                      ? "Heute!"
                      : kleineZahl(diff, einheit).satz}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const KONFETTI_FARBEN = ["bg-primary", "bg-growth", "bg-intense", "bg-calm", "bg-foreground"];

function KonfettiBadge({ sprint }: { sprint: number }) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl border border-growth/40 bg-growth-soft px-3 py-2.5">
      <span className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className={`konfetti-stueck ${KONFETTI_FARBEN[i % KONFETTI_FARBEN.length]}`}
            style={{
              left: `${6 + ((i * 7) % 88)}%`,
              animationDelay: `${(i % 5) * 0.08}s`,
            }}
          />
        ))}
      </span>
      <p className="relative text-sm font-semibold">
        Zehn Nächte voll – Runde {sprint} habt ihr zusammen erlebt
      </p>
    </div>
  );
}

export function MutmachZentrale({
  heuteWoche,
  onPhaseWaehlen,
  bereich,
}: {
  heuteWoche: number;
  onPhaseWaehlen: (woche: number) => void;
  bereich: "heute" | "meilensteine" | "gesamt";
}) {
  const heute = new Date();
  const aktuellePhase = phaseFuerWoche(heuteWoche);
  const idx = PHASEN.findIndex((p) => p.id === aktuellePhase.id);
  const naechste: Phase | undefined = PHASEN[idx + 1];

  const geschaffteNaechte = Math.max(0, tageDiff(heute, GEBURTSDATUM));
  const naechteBisNaechste = naechste
    ? Math.max(0, tageDiff(datumFuerWoche(naechste.von), heute))
    : 0;

  const inRuhe = aktuellePhase.stress <= 2;
  const naechsteRuhige = inRuhe ? undefined : PHASEN.slice(idx + 1).find((p) => p.stress <= 2);
  const naechteBisRuhe = naechsteRuhige
    ? Math.max(0, tageDiff(datumFuerWoche(naechsteRuhige.von), heute))
    : 0;

  const phaseStartDatum = datumFuerWoche(aktuellePhase.von);
  const phaseEndDatum = datumFuerWoche(aktuellePhase.bis + 1);
  const phasenDauerTage = Math.max(1, tageDiffExact(phaseEndDatum, phaseStartDatum));
  const verstricheneTage = Math.max(0, tageDiffExact(heute, phaseStartDatum));
  const phasenFortschritt = Math.min(100, Math.max(0, (verstricheneTage / phasenDauerTage) * 100));

  const spruch =
    MUTMACH_SPRUECHE[Math.floor(heute.getTime() / TAG_MS) % MUTMACH_SPRUECHE.length] ??
    MUTMACH_SPRUECHE[0];

  const sprint = sprintStand(geschaffteNaechte);
  const [einheitRoh, setEinheit] = useStoredString(STORAGE_KEYS.einheit, "wochen");
  const einheit: Einheit = einheitAusSpeicher(einheitRoh);

  const tageBisKita = Math.max(0, tageDiff(KITA_BEGINN, heute));
  const kitaGesamtTage = Math.max(1, tageDiffExact(KITA_BEGINN, GEBURTSDATUM));
  const kitaFortschritt = Math.min(
    100,
    Math.max(0, (tageDiffExact(heute, GEBURTSDATUM) / kitaGesamtTage) * 100),
  );
  const kitaKlein = kleineZahl(tageBisKita, einheit);
  const phaseKlein = kleineZahl(naechteBisNaechste, einheit);
  const ruheKlein = kleineZahl(naechteBisRuhe, einheit);

  const levels = levelStand(geschaffteNaechte);
  const alleLevel = bereich === "gesamt";
  const medalien = sichtbareLevel(geschaffteNaechte, alleLevel);
  const zauber = naechsterZaubermoment(geschaffteNaechte);

  const levelKette = (
    <div>
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Eure Level
      </p>
      {levels.aktuell ? (
        <p className="mt-1 text-sm leading-snug">
          Gerade Level {levels.aktuell.nr}: {levels.aktuell.titel} {levels.aktuell.emoji} – schon{" "}
          {Math.round(levels.fortschritt)} % dieser Stufe
        </p>
      ) : (
        <p className="mt-1 text-sm leading-snug">Alle Level geschafft – wie ihr gewachsen seid.</p>
      )}
      <ol className="mt-3 flex items-stretch gap-2 overflow-x-auto pb-1">
        {medalien.map((level) => {
          const erlebt = geschaffteNaechte >= level.bisTag;
          const laeuft = levels.aktuell?.nr === level.nr;
          return (
            <li
              key={level.nr}
              className={[
                "app-karte flex w-36 shrink-0 flex-col items-center px-2 py-3 text-center",
                erlebt
                  ? "border-primary/40 bg-primary/10"
                  : laeuft
                    ? "border-foreground/30"
                    : "border-dashed opacity-70",
              ].join(" ")}
            >
              <span className="text-2xl" aria-hidden>
                {erlebt || laeuft ? level.emoji : "🔒"}
              </span>
              <span className="mt-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Level {level.nr}
              </span>
              <span className="mt-0.5 text-xs leading-snug font-semibold">{level.titel}</span>
              <span className="mt-1 text-[10px] font-semibold text-muted-foreground">
                {erlebt ? "geschafft" : laeuft ? "gerade" : "später"}
              </span>
            </li>
          );
        })}
      </ol>
      {!alleLevel && medalien.length < LEVELS.length ? (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Die ganze Kette liegt in der Gesamtansicht.
        </p>
      ) : null}
    </div>
  );

  const zauberKarte = zauber ? (
    <div className="rounded-3xl border border-primary/30 bg-primary/10 p-4 shadow-[0_12px_30px_-22px_oklch(0.4_0.04_70/0.45)]">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <Sparkles className="h-3.5 w-3.5" /> Nächster Zaubermoment
      </p>
      <p className="mt-1 font-display text-lg leading-snug font-semibold">{zauber.moment.titel}</p>
      <p className="mt-1 text-sm text-muted-foreground">{ungefaehrIn(zauber.inTagen)}</p>
      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
        Typisches, ungefähres Altersfenster – jedes Kind hat sein Tempo. Kein medizinischer Rat.
      </p>
    </div>
  ) : null;

  if (bereich === "meilensteine") {
    return (
      <section className="space-y-4">
        <div className="app-karte p-4 sm:p-5">{levelKette}</div>
        {zauberKarte}
        {naechste ? (
          <button
            type="button"
            onClick={() => onPhaseWaehlen(naechste.von)}
            className="app-karte w-full p-4 text-left transition-transform active:scale-[0.99]"
          >
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Darauf dürft ihr euch freuen
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-snug">
              {naechste.meilensteine.slice(0, 3).map((m) => (
                <li key={m} className="before:mr-1.5 before:content-['✦']">
                  {m}
                </li>
              ))}
            </ul>
          </button>
        ) : null}
      </section>
    );
  }

  if (bereich === "gesamt") {
    return <section className="app-karte p-4 sm:p-5">{levelKette}</section>;
  }

  return (
    <section className="space-y-4">
      <div className="app-karte bg-primary/10 p-5 sm:p-6">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Zusammen
        </p>
        <p className="mt-2 font-display text-5xl leading-none font-semibold sm:text-6xl">
          {geschaffteNaechte}
        </p>
        <p className="mt-2 text-lg font-medium">Nächte zusammen erlebt</p>
      </div>

      <div className="app-karte p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          <Moon className="h-3.5 w-3.5" /> Zehn Nächte
        </p>
        <p className="mt-1.5 font-display text-xl leading-snug font-semibold">
          {sprint.geschafft
            ? "Neue zehn Nächte: ihr startet bei 0 – ganz in Ruhe"
            : `Nacht ${sprint.nacht} von 10 zusammen erlebt`}
        </p>
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {Array.from({ length: sprint.von }, (_, i) => (
            <span
              key={i}
              className={[
                "h-2.5 flex-1 rounded-full",
                i < sprint.nacht ? "bg-primary" : "bg-border",
              ].join(" ")}
            />
          ))}
        </div>
        <p className="sr-only">
          {sprint.nacht} von {sprint.von} Nächten in diesen zehn Nächten erlebt
        </p>
        {sprint.geschafft && sprint.abgeschlossenerSprint !== null ? (
          <KonfettiBadge sprint={sprint.abgeschlossenerSprint} />
        ) : null}
      </div>

      <div>
        <div
          role="radiogroup"
          aria-label="Einheit für die verbleibende Zeit"
          className="flex flex-wrap gap-2"
        >
          {EINHEITEN.map((option) => {
            const aktiv = einheit === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={aktiv}
                onClick={() => setEinheit(option.id)}
                className={[
                  "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                  aktiv
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-accent",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">Dieselbe Zeit, in kleineren Zahlen.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Kachel
          icon={School}
          label="Weg zur Kita"
          akzent
          wert={tageBisKita === 0 ? "Geschafft" : kitaKlein.satz}
          sub={`01.06.2027 · schon ${Math.round(kitaFortschritt)} % dieses Weges zusammen`}
        />
        <Kachel
          icon={CalendarHeart}
          label="Nächster Abschnitt"
          wert={naechste ? (naechteBisNaechste === 0 ? "Jetzt" : phaseKlein.satz) : "Ihr seid da"}
          sub={
            naechste
              ? `bis „${naechste.titel}“`
              : "Ihr habt die komplette Lebenslinie zusammen erlebt."
          }
        />
        <Kachel
          icon={Sunrise}
          label={inRuhe ? "Ruhige Phase" : "Nächste ruhige Phase"}
          wert={inRuhe ? "Gerade jetzt" : naechteBisRuhe === 0 ? "Jetzt" : ruheKlein.satz}
          sub={
            inRuhe
              ? `„${aktuellePhase.titel}“ – ihr seid mittendrin.`
              : naechsteRuhige
                ? `bis „${naechsteRuhige.titel}“`
                : "Ihr seid gerade in einer entspannten Phase."
          }
        />
      </div>

      <KitaEtappen heute={heute} einheit={einheit} />

      <div className="app-karte p-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Diese Phase: schon {Math.round(phasenFortschritt)} % zusammen</span>
          <span>{Math.round(phasenFortschritt)} %</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${phasenFortschritt}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{aktuellePhase.titel}</p>
      </div>

      {zauberKarte}

      <p className="rounded-3xl bg-calm-soft p-4 text-sm leading-snug font-medium">„{spruch}“</p>
    </section>
  );
}
