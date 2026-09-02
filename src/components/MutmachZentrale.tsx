import { Moon, Sparkles, Sunrise, Trophy, HeartHandshake, CalendarHeart, School } from "lucide-react";
import {
  PHASEN,
  GEBURTSDATUM,
  datumFuerWoche,
  formatDatum,
  phaseFuerWoche,
  type Phase,
} from "@/data/lebenslinie";

const TAG_MS = 1000 * 60 * 60 * 24;
const KITA_BEGINN = new Date(2030, 5, 1); // 01.06.2030

const MUTMACH_SPRUECHE = [
  "Du machst das gerade gut genug – und genug ist genau richtig.",
  "Kein Kind erinnert sich an eine aufgeräumte Wohnung, aber an ruhige Arme.",
  "Jede durchwachte Nacht ist eine Nacht, die nie wiederkommt.",
  "Diese Phase hat ein Ablaufdatum. Wirklich.",
  "Ihr seid kein Elternteam auf Probe – ihr seid genau das richtige Team.",
  "Heute reicht: satt, sauber, geliebt.",
  "Fortschritt ist selten linear – Rückschritte gehören dazu.",
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
    <div
      className={[
        "rounded-2xl border p-3",
        akzent ? "border-primary/40 bg-primary/10" : "border-border bg-card",
      ].join(" ")}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1.5 font-display text-2xl leading-none font-semibold">{wert}</p>
      {sub ? <p className="mt-1 text-xs leading-snug text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function MutmachZentrale({
  heuteWoche,
  onPhaseWaehlen,
}: {
  heuteWoche: number;
  onPhaseWaehlen: (woche: number) => void;
}) {
  const heute = new Date();
  const aktuellePhase = phaseFuerWoche(heuteWoche);
  const idx = PHASEN.findIndex((p) => p.id === aktuellePhase.id);
  const naechste: Phase | undefined = PHASEN[idx + 1];

  const geschaffteNaechte = Math.max(0, tageDiff(heute, GEBURTSDATUM));
  const naechteBisNaechste = naechste
    ? Math.max(0, tageDiff(datumFuerWoche(naechste.von), heute))
    : 0;

  const naechsteRuhige = PHASEN.slice(idx + 1).find((p) => p.stress <= 2);
  const naechteBisRuhe = naechsteRuhige
    ? Math.max(0, tageDiff(datumFuerWoche(naechsteRuhige.von), heute))
    : 0;

  // Tagesgenauer Fortschritt innerhalb der aktuellen Phase:
  // Phase läuft vom ersten Tag der Startwoche bis zum letzten Tag der Endwoche.
  const phaseStartDatum = datumFuerWoche(aktuellePhase.von);
  const phaseEndDatum = datumFuerWoche(aktuellePhase.bis + 1);
  const phasenDauerTage = Math.max(1, tageDiffExact(phaseEndDatum, phaseStartDatum));
  const verstricheneTage = Math.max(0, tageDiffExact(heute, phaseStartDatum));
  const phasenFortschritt = Math.min(
    100,
    Math.max(0, (verstricheneTage / phasenDauerTage) * 100),
  );
  const tageRest = Math.max(0, tageDiffExact(phaseEndDatum, heute));

  const spruch =
    MUTMACH_SPRUECHE[
      Math.floor(heute.getTime() / TAG_MS) % MUTMACH_SPRUECHE.length
    ] ?? MUTMACH_SPRUECHE[0];

  const kuschelStunden = Math.round(geschaffteNaechte * 4);

  // Kita-Beginn: 01.06.2030
  const tageBisKita = Math.max(0, tageDiff(KITA_BEGINN, heute));
  const kitaGesamtTage = Math.max(1, tageDiffExact(KITA_BEGINN, GEBURTSDATUM));
  const kitaFortschritt = Math.min(
    100,
    Math.max(0, (tageDiffExact(heute, GEBURTSDATUM) / kitaGesamtTage) * 100),
  );

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <HeartHandshake className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold tracking-wide uppercase">Mutmach-Zentrale</h2>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kachel
          icon={Moon}
          label="Noch Nächte"
          akzent
          wert={naechste ? `${naechteBisNaechste}` : "Ziel erreicht"}
          sub={
            naechste
              ? `bis „${naechste.titel}“ (ab ${formatDatum(datumFuerWoche(naechste.von))})`
              : "Ihr habt die komplette Lebenslinie geschafft."
          }
        />
        <Kachel
          icon={Trophy}
          label="Schon geschafft"
          wert={`${geschaffteNaechte} Nächte`}
          sub={`≈ ${kuschelStunden} Stunden Kuscheln, Tragen und Trösten.`}
        />
        <Kachel
          icon={Sunrise}
          label="Nächste ruhige Phase"
          wert={
            naechsteRuhige ? (naechteBisRuhe === 0 ? "Jetzt!" : `${naechteBisRuhe} Nächte`) : "Jetzt!"
          }
          sub={
            naechsteRuhige
              ? `„${naechsteRuhige.titel}“ – Stresslevel ${naechsteRuhige.stress}/5`
              : "Ihr seid gerade in einer entspannten Phase."
          }
        />
        <Kachel
          icon={CalendarHeart}
          label="Diese Phase"
          wert={`${Math.round(phasenFortschritt)} %`}
          sub={`Woche ${aktuellePhase.von}–${aktuellePhase.bis} · ${
            tageRest >= 14
              ? `noch ${Math.floor(tageRest / 7)} Wochen`
              : `noch ${Math.ceil(tageRest)} Tage`
          }`}
        />
        <Kachel
          icon={School}
          label="Bis Kita-Beginn"
          wert={`${tageBisKita} Nächte`}
          sub={`01.06.2030 · ${Math.round(kitaFortschritt)} % der Kita-Vorbereitung geschafft`}
        />
      </div>

      {/* Fortschrittsbalken Phase */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Fortschritt in dieser Phase</span>
          <span>{Math.round(phasenFortschritt)} %</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${phasenFortschritt}%` }}
          />
        </div>
      </div>

      {/* Vorfreude auf die nächste Phase */}
      {naechste ? (
        <button
          type="button"
          onClick={() => onPhaseWaehlen(naechste.von)}
          className="mt-4 w-full rounded-2xl border border-border bg-accent/40 p-3 text-left transition-colors hover:bg-accent"
        >
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Darauf dürft ihr euch freuen
          </p>
          <ul className="mt-1.5 space-y-0.5 text-sm leading-snug">
            {naechste.meilensteine.slice(0, 3).map((m) => (
              <li key={m} className="before:mr-1.5 before:content-['✦']">
                {m}
              </li>
            ))}
          </ul>
        </button>
      ) : null}

      <p className="mt-4 rounded-2xl bg-calm-soft p-3 text-sm leading-snug font-medium">
        „{spruch}“
      </p>
    </section>
  );
}
