"use client";

import { useMemo, useState } from "react";
import type { Continent, Country } from "@/constants/world-countries";

interface CountryChecklistProps {
  countries: readonly Country[];
  visited: Set<string>;
  onToggle: (iso: string) => void;
  unOnly: boolean;
}

const CONTINENT_ORDER: Continent[] = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
  "Antarctica",
];

export default function CountryChecklist({
  countries,
  visited,
  onToggle,
  unOnly,
}: CountryChecklistProps) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const buckets: Record<Continent, Country[]> = {
      Africa: [],
      Antarctica: [],
      Asia: [],
      Europe: [],
      "North America": [],
      Oceania: [],
      "South America": [],
    };
    for (const c of countries) {
      if (unOnly && !c.isUNMember) continue;
      if (q && !c.name.toLowerCase().includes(q)) continue;
      buckets[c.continent].push(c);
    }
    return buckets;
  }, [countries, query, unOnly]);

  return (
    <div className="cv-list">
      <div className="cv-list-head">
        <h2 className="cv-list-title">
          Country <span className="it">checklist</span>
        </h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries…"
          className="cv-list-search"
          aria-label="Search countries"
        />
      </div>

      <div className="cv-list-grid">
        {CONTINENT_ORDER.map((cont) => {
          const items = grouped[cont];
          if (!items.length) return null;
          const visitedCount = items.filter((c) => visited.has(c.iso)).length;
          return (
            <section key={cont} className="cv-list-col">
              <header className="cv-list-col-head">
                <span className="cv-list-col-name">{cont}</span>
                <span className="cv-list-col-count">
                  {visitedCount} / {items.length}
                </span>
              </header>
              <ul className="cv-list-items">
                {items.map((c) => {
                  const isVisited = visited.has(c.iso);
                  return (
                    <li key={c.iso}>
                      <label className="cv-list-item">
                        <input
                          type="checkbox"
                          checked={isVisited}
                          onChange={() => onToggle(c.iso)}
                        />
                        <span className="cv-list-item-name">{c.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
