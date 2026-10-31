import { useEffect, useState } from "react";

import { feiernZuruecksetzen } from "@/data/feiern";
import { mitternacht, parseHeuteParam } from "@/lib/heute";

/**
 * Echtes Datum bis zum Mount, danach optional `?heute=YYYY-MM-DD`.
 * `?feiern=reset` leert gezeigte Feiern, bevor irgendetwas berechnet wird.
 */
export function useHeute(): { heute: Date; bereit: boolean } {
  const [heute, setHeute] = useState(() => mitternacht(new Date()));
  const [bereit, setBereit] = useState(false);

  useEffect(() => {
    const parameter = new URLSearchParams(window.location.search);
    if (parameter.get("feiern") === "reset") feiernZuruecksetzen();
    const simuliert = parseHeuteParam(parameter.get("heute"));
    if (simuliert) setHeute(simuliert);
    setBereit(true);
  }, []);

  return { heute, bereit };
}
