"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Masthead from "@/components/Masthead";
import WorldMap from "@/components/WorldMap";
import CountryChecklist from "@/components/CountryChecklist";
import type { Continent, Country } from "@/constants/world-countries";
import {
  COUNTRIES as DEFAULT_COUNTRIES,
  MAP_VIEW_WIDTH as DEFAULT_W,
  MAP_VIEW_HEIGHT as DEFAULT_H,
} from "@/constants/world-countries-equirectangular";
import { LEI_VISITED } from "@/constants/lei-visited";

const STORAGE_VISITED = "visited-countries-v1";
const STORAGE_METRIC = "visited-countries-metric-v1";
const STORAGE_SCOPE = "visited-countries-scope-v1";
const STORAGE_PROJECTION = "visited-countries-projection-v1";

type Metric = "count" | "area";
type Scope = "un" | "all";
type Projection = "mercator" | "miller" | "equirectangular";

interface ProjectionData {
  countries: readonly Country[];
  width: number;
  height: number;
}

const DEFAULT_DATA: ProjectionData = {
  countries: DEFAULT_COUNTRIES,
  width: DEFAULT_W,
  height: DEFAULT_H,
};

const CONTINENT_ORDER: Continent[] = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
  "Antarctica",
];

export default function CountriesVisitedPage() {
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [scope, setScope] = useState<Scope>("all");
  const [metric, setMetric] = useState<Metric>("count");
  const [projection, setProjection] = useState<Projection>("equirectangular");
  const [projData, setProjData] = useState<ProjectionData>(DEFAULT_DATA);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount. We deliberately initialize state to
  // the SSR-safe empty default and then setState here so the first client paint
  // matches the server output, avoiding hydration mismatches. Disabling the
  // set-state-in-effect rule for this one-shot mount-time read is intentional.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_VISITED);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setVisited(new Set(parsed.filter((x): x is string => typeof x === "string")));
        }
      }
      const m = localStorage.getItem(STORAGE_METRIC);
      if (m === "count" || m === "area") setMetric(m);
      const s = localStorage.getItem(STORAGE_SCOPE);
      if (s === "un" || s === "all") setScope(s);
      const p = localStorage.getItem(STORAGE_PROJECTION);
      if (p === "mercator" || p === "miller" || p === "equirectangular") setProjection(p);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist each piece after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_VISITED, JSON.stringify([...visited]));
    } catch {
      // ignore quota / disabled storage
    }
  }, [visited, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_METRIC, metric);
    } catch {
      // ignore
    }
  }, [metric, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_SCOPE, scope);
    } catch {
      // ignore
    }
  }, [scope, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_PROJECTION, projection);
    } catch {
      // ignore
    }
  }, [projection, hydrated]);

  // Lazy-load the selected projection's data. Equirectangular is statically
  // imported as the default so the initial render needs no fetch; the other
  // two are pulled in on demand.
  useEffect(() => {
    if (projection === "equirectangular") {
      setProjData(DEFAULT_DATA);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const mod =
          projection === "miller"
            ? await import("@/constants/world-countries-miller")
            : await import("@/constants/world-countries-mercator");
        if (cancelled) return;
        setProjData({
          countries: mod.COUNTRIES,
          width: mod.MAP_VIEW_WIDTH,
          height: mod.MAP_VIEW_HEIGHT,
        });
      } catch {
        // ignore failed dynamic imports
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projection]);

  const handleToggle = useCallback((iso: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(iso)) next.delete(iso);
      else next.add(iso);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setVisited(new Set());
  }, []);

  const handleLoadLei = useCallback(() => {
    setVisited(new Set(LEI_VISITED));
  }, []);

  const scopedCountries = useMemo(
    () => (scope === "un" ? projData.countries.filter((c) => c.isUNMember) : projData.countries),
    [scope, projData.countries],
  );

  const stats = useMemo(() => {
    const inScope = scopedCountries;
    const totalCount = inScope.length;
    let totalArea = 0;
    let visitedCount = 0;
    let visitedArea = 0;
    const byContinentTotal: Record<Continent, { count: number; area: number }> = {
      Africa: { count: 0, area: 0 },
      Antarctica: { count: 0, area: 0 },
      Asia: { count: 0, area: 0 },
      Europe: { count: 0, area: 0 },
      "North America": { count: 0, area: 0 },
      Oceania: { count: 0, area: 0 },
      "South America": { count: 0, area: 0 },
    };
    const byContinentVisited: Record<Continent, { count: number; area: number }> = {
      Africa: { count: 0, area: 0 },
      Antarctica: { count: 0, area: 0 },
      Asia: { count: 0, area: 0 },
      Europe: { count: 0, area: 0 },
      "North America": { count: 0, area: 0 },
      Oceania: { count: 0, area: 0 },
      "South America": { count: 0, area: 0 },
    };
    for (const c of inScope) {
      totalArea += c.areaKm2;
      byContinentTotal[c.continent].count += 1;
      byContinentTotal[c.continent].area += c.areaKm2;
      if (visited.has(c.iso)) {
        visitedCount += 1;
        visitedArea += c.areaKm2;
        byContinentVisited[c.continent].count += 1;
        byContinentVisited[c.continent].area += c.areaKm2;
      }
    }
    const pct =
      metric === "count"
        ? totalCount === 0 ? 0 : (visitedCount / totalCount) * 100
        : totalArea === 0 ? 0 : (visitedArea / totalArea) * 100;
    return {
      totalCount,
      visitedCount,
      totalArea,
      visitedArea,
      pct,
      byContinentTotal,
      byContinentVisited,
    };
  }, [scopedCountries, visited, metric]);

  return (
    <div className="min-h-screen bg-page">
      <Masthead />

      <main className="shell py-12">
        <div className="mb-10">
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 12,
            }}
          >
            Side projects · tool · 02
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 600,
              fontVariationSettings: '"opsz" 72',
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: "0 0 16px",
              color: "var(--fg)",
            }}
          >
            Countries{" "}
            <span
              style={{
                fontFamily: "var(--font-bodoni), serif",
                fontStyle: "italic",
                color: "var(--accent)",
              }}
            >
              visited
            </span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 18, fontWeight: 300, maxWidth: 560 }}>
            Click any country on the map (or tick it in the checklist below) to mark
            it as visited. Your selection lives in your browser only.
          </p>
        </div>

        <div className="cv-action-row">
          <div className="cv-seg" role="group" aria-label="Country set">
            <button type="button" aria-pressed={scope === "all"} onClick={() => setScope("all")}>
              All {projData.countries.length}
            </button>
            <button type="button" aria-pressed={scope === "un"} onClick={() => setScope("un")}>
              UN states · 193
            </button>
          </div>

          <div className="cv-seg" role="group" aria-label="Percentage metric">
            <button type="button" aria-pressed={metric === "count"} onClick={() => setMetric("count")}>
              By count
            </button>
            <button type="button" aria-pressed={metric === "area"} onClick={() => setMetric("area")}>
              By land area
            </button>
          </div>

          <div className="cv-seg" role="group" aria-label="Map projection">
            <button
              type="button"
              aria-pressed={projection === "equirectangular"}
              onClick={() => setProjection("equirectangular")}
            >
              Flat
            </button>
            <button
              type="button"
              aria-pressed={projection === "miller"}
              onClick={() => setProjection("miller")}
            >
              Miller
            </button>
            <button
              type="button"
              aria-pressed={projection === "mercator"}
              onClick={() => setProjection("mercator")}
            >
              Mercator
            </button>
          </div>

          <div className="cv-spacer" />

          <button
            type="button"
            className="btn"
            onClick={handleLoadLei}
            disabled={LEI_VISITED.length === 0}
            title={
              LEI_VISITED.length === 0
                ? "Lei's list isn't filled in yet."
                : "Replace current selection with Lei's countries."
            }
          >
            See where Lei has been
          </button>
          <button type="button" className="btn" onClick={handleReset}>
            Reset
          </button>
        </div>

        <WorldMap
          countries={projData.countries}
          viewWidth={projData.width}
          viewHeight={projData.height}
          visited={visited}
          onToggle={handleToggle}
        />

        <div className="cv-stats-row">
          <div className="cv-headline">
            <span className="cv-headline-kicker">World explored</span>
            <span className="cv-headline-pct">
              {formatPct(stats.pct)}
              <span className="it">%</span>
            </span>
            <span className="cv-headline-sub">
              <b>{stats.visitedCount}</b> of {stats.totalCount}{" "}
              {scope === "un" ? "UN states" : "countries & territories"}
              {metric === "area" && (
                <>
                  {" "}· <b>{formatKm2(stats.visitedArea)}</b> km² of{" "}
                  {formatKm2(stats.totalArea)} km²
                </>
              )}
            </span>
          </div>

          <div className="cv-continents">
            {CONTINENT_ORDER.map((cont) => {
              const total = stats.byContinentTotal[cont];
              const vis = stats.byContinentVisited[cont];
              if (total.count === 0) return null;
              const ratio =
                metric === "count"
                  ? total.count === 0 ? 0 : vis.count / total.count
                  : total.area === 0 ? 0 : vis.area / total.area;
              return (
                <div key={cont} className="cv-continent-row">
                  <span className="cv-continent-name">{cont}</span>
                  <div className="cv-continent-bar" aria-hidden="true">
                    <div
                      className="cv-continent-bar-fill"
                      style={{ transform: `scaleX(${ratio})` }}
                    />
                  </div>
                  <span className="cv-continent-count">
                    <b>{vis.count}</b> / {total.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <CountryChecklist
          countries={projData.countries}
          visited={visited}
          onToggle={handleToggle}
          unOnly={scope === "un"}
        />
      </main>
    </div>
  );
}

function formatPct(n: number): string {
  if (n === 0) return "0";
  if (n < 1) return n.toFixed(2);
  if (n < 10) return n.toFixed(1);
  return Math.round(n).toString();
}

function formatKm2(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}
