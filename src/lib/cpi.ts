import { sql } from './db';
import { CITY_SERIES, CATEGORY_SERIES, HEADLINE_SERIES_ID, CpiSeries, CityTier } from '@/constants/purchasing-power';

export interface YearValue {
  year: number;
  value: number;
}

interface ObservationRow {
  year: number;
  month: number;
  value: string;
}

interface AnnualRow {
  year: number;
  avg: string;
}

export async function getAnnualAverage(seriesId: string, year: number): Promise<number | null> {
  const rows = await sql`
    SELECT AVG(value)::numeric AS avg
    FROM cpi_observations
    WHERE series_id = ${seriesId} AND year = ${year}
  ` as Array<{ avg: string | null }>;
  const avg = rows[0]?.avg;
  return avg == null ? null : parseFloat(avg);
}

/**
 * Annual series that follows the metro -> region -> national fallback chain
 * per year. Returns one point per year in [fromYear, toYear], tagged with
 * which tier supplied it, so callers can show provenance.
 */
export interface YearValueWithTier extends YearValue {
  tier: CityTier;
  sourceLabel: string;
}

export async function getAnnualSeriesWithFallback(
  cityId: string,
  fromYear: number,
  toYear: number
): Promise<YearValueWithTier[]> {
  const chain: CpiSeries[] = [];
  let current: CpiSeries | undefined = CITY_SERIES[cityId];
  while (current) {
    chain.push(current);
    current = current.parent ? CITY_SERIES[current.parent] : undefined;
  }
  if (chain.length === 0) return [];

  const seriesIds = chain.map(s => s.seriesId);
  const rows = await sql`
    SELECT series_id, year, AVG(value)::numeric AS avg
    FROM cpi_observations
    WHERE series_id = ANY(${seriesIds}::text[])
      AND year BETWEEN ${fromYear} AND ${toYear}
    GROUP BY series_id, year
  ` as Array<{ series_id: string; year: number; avg: string }>;

  const tierRank = (t: CityTier) => (t === 'metro' ? 0 : t === 'region' ? 1 : 2);
  const byYear = new Map<number, YearValueWithTier>();
  for (const r of rows) {
    const series = chain.find(s => s.seriesId === r.series_id);
    if (!series) continue;
    const existing = byYear.get(r.year);
    if (existing && tierRank(existing.tier) <= tierRank(series.tier)) continue;
    byYear.set(r.year, {
      year: r.year,
      value: parseFloat(r.avg),
      tier: series.tier,
      sourceLabel: series.label,
    });
  }

  const out: YearValueWithTier[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    const v = byYear.get(y);
    if (v) out.push(v);
  }
  return out;
}

/**
 * Returns one independent series per tier in the city's fallback chain (metro,
 * region, national). Each tier's line spans its own full data availability
 * within [fromYear, toYear] — so the region line stays continuous even where
 * metro data exists. Used by the chart for side-by-side comparison.
 */
export interface MultiTierSeries {
  byTier: Partial<Record<CityTier, { label: string; seriesId: string; data: YearValue[] }>>;
}

export async function getMultiTierAnnualSeries(
  cityId: string,
  fromYear: number,
  toYear: number
): Promise<MultiTierSeries> {
  const chain: CpiSeries[] = [];
  let current: CpiSeries | undefined = CITY_SERIES[cityId];
  while (current) {
    chain.push(current);
    current = current.parent ? CITY_SERIES[current.parent] : undefined;
  }
  if (chain.length === 0) return { byTier: {} };

  const seriesIds = chain.map(s => s.seriesId);
  const rows = await sql`
    SELECT series_id, year, AVG(value)::numeric AS avg
    FROM cpi_observations
    WHERE series_id = ANY(${seriesIds}::text[])
      AND year BETWEEN ${fromYear} AND ${toYear}
    GROUP BY series_id, year
    ORDER BY year ASC
  ` as Array<{ series_id: string; year: number; avg: string }>;

  const byTier: MultiTierSeries['byTier'] = {};
  for (const series of chain) {
    const data = rows
      .filter(r => r.series_id === series.seriesId)
      .map(r => ({ year: r.year, value: parseFloat(r.avg) }));
    if (data.length > 0) {
      byTier[series.tier] = { label: series.label, seriesId: series.seriesId, data };
    }
  }
  return { byTier };
}

export async function getAnnualSeries(seriesId: string, fromYear?: number, toYear?: number): Promise<YearValue[]> {
  const rows = (fromYear != null && toYear != null
    ? await sql`
        SELECT year, AVG(value)::numeric AS avg
        FROM cpi_observations
        WHERE series_id = ${seriesId}
          AND year BETWEEN ${fromYear} AND ${toYear}
        GROUP BY year
        ORDER BY year ASC
      `
    : await sql`
        SELECT year, AVG(value)::numeric AS avg
        FROM cpi_observations
        WHERE series_id = ${seriesId}
        GROUP BY year
        ORDER BY year ASC
      `) as AnnualRow[];
  return rows.map(r => ({ year: r.year, value: parseFloat(r.avg) }));
}

export async function getLatestMonthly(seriesId: string, monthsBack = 24): Promise<Array<{ year: number; month: number; value: number }>> {
  const rows = await sql`
    SELECT year, month, value
    FROM cpi_observations
    WHERE series_id = ${seriesId}
    ORDER BY year DESC, month DESC
    LIMIT ${monthsBack}
  ` as ObservationRow[];
  return rows
    .map(r => ({ year: r.year, month: r.month, value: parseFloat(r.value) }))
    .reverse();
}

export async function getLatestYoY(seriesId: string): Promise<{ rate: number; latestDate: string; previousDate: string } | null> {
  const recent = await getLatestMonthly(seriesId, 13);
  if (recent.length < 13) return null;
  const latest = recent[recent.length - 1];
  const yearAgo = recent[0];
  const rate = ((latest.value - yearAgo.value) / yearAgo.value) * 100;
  const fmt = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
  return { rate, latestDate: fmt(latest.year, latest.month), previousDate: fmt(yearAgo.year, yearAgo.month) };
}

/**
 * Walk the fallback chain (metro -> region -> national) returning the first
 * tier that has data for the given year. Returns null only if even US National
 * is missing the year (shouldn't happen for years >= 1947).
 */
export interface AnnualWithSource {
  value: number;
  sourceId: string;
  sourceTier: CityTier;
  sourceLabel: string;
}

/**
 * Compute the cumulative inflation ratio between fromYear and toYear by
 * walking year-over-year, picking the deepest tier (metro > region > national)
 * that has data for both endpoints of each year pair. Phases (contiguous runs
 * using the same tier) are recorded so the UI can show provenance.
 *
 * Critical: this avoids the cross-tier ratio bug where metro CPI (e.g., base
 * 2017=100) and region/national CPI (base 1982-84=100) would otherwise be
 * mixed in a single division and produce a meaningless number.
 */
export interface InflationPhase {
  tier: CityTier;
  label: string;
  startYear: number;
  endYear: number;
  startCpi: number;
  endCpi: number;
  ratio: number;
}

export interface ChainedInflation {
  ratio: number;
  phases: InflationPhase[];
}

export async function getChainedInflation(
  cityId: string,
  fromYear: number,
  toYear: number
): Promise<ChainedInflation | null> {
  if (fromYear === toYear) return { ratio: 1, phases: [] };
  if (fromYear > toYear) [fromYear, toYear] = [toYear, fromYear];

  const chain: CpiSeries[] = [];
  let cur: CpiSeries | undefined = CITY_SERIES[cityId];
  while (cur) {
    chain.push(cur);
    cur = cur.parent ? CITY_SERIES[cur.parent] : undefined;
  }
  if (chain.length === 0) return null;

  const seriesIds = chain.map(s => s.seriesId);
  const rows = await sql`
    SELECT series_id, year, AVG(value)::numeric AS avg
    FROM cpi_observations
    WHERE series_id = ANY(${seriesIds}::text[])
      AND year BETWEEN ${fromYear} AND ${toYear}
    GROUP BY series_id, year
  ` as Array<{ series_id: string; year: number; avg: string }>;

  const tierMaps = new Map<string, Map<number, number>>();
  for (const s of chain) tierMaps.set(s.seriesId, new Map());
  for (const r of rows) tierMaps.get(r.series_id)!.set(r.year, parseFloat(r.avg));

  let totalRatio = 1;
  const phases: InflationPhase[] = [];
  let phaseTier: CpiSeries | null = null;
  let phaseStartYear = fromYear;
  let phaseStartCpi = 0;

  for (let y = fromYear + 1; y <= toYear; y++) {
    let tier: CpiSeries | null = null;
    for (const s of chain) {
      const map = tierMaps.get(s.seriesId)!;
      if (map.has(y - 1) && map.has(y)) {
        tier = s;
        break;
      }
    }
    if (!tier) return null;

    const map = tierMaps.get(tier.seriesId)!;
    const prevVal = map.get(y - 1)!;
    const currVal = map.get(y)!;
    totalRatio *= currVal / prevVal;

    if (!phaseTier) {
      phaseTier = tier;
      phaseStartYear = y - 1;
      phaseStartCpi = prevVal;
    } else if (phaseTier.seriesId !== tier.seriesId) {
      const prevPhaseMap = tierMaps.get(phaseTier.seriesId)!;
      const endVal = prevPhaseMap.get(y - 1)!;
      phases.push({
        tier: phaseTier.tier,
        label: phaseTier.label,
        startYear: phaseStartYear,
        endYear: y - 1,
        startCpi: phaseStartCpi,
        endCpi: endVal,
        ratio: endVal / phaseStartCpi,
      });
      phaseTier = tier;
      phaseStartYear = y - 1;
      phaseStartCpi = prevVal;
    }
  }

  if (phaseTier) {
    const map = tierMaps.get(phaseTier.seriesId)!;
    const endVal = map.get(toYear)!;
    phases.push({
      tier: phaseTier.tier,
      label: phaseTier.label,
      startYear: phaseStartYear,
      endYear: toYear,
      startCpi: phaseStartCpi,
      endCpi: endVal,
      ratio: endVal / phaseStartCpi,
    });
  }

  return { ratio: totalRatio, phases };
}

export async function getAnnualAverageWithFallback(
  cityId: string,
  year: number
): Promise<AnnualWithSource | null> {
  let current: CpiSeries | undefined = CITY_SERIES[cityId];
  while (current) {
    const value = await getAnnualAverage(current.seriesId, year);
    if (value != null) {
      return { value, sourceId: current.id, sourceTier: current.tier, sourceLabel: current.label };
    }
    current = current.parent ? CITY_SERIES[current.parent] : undefined;
  }
  return null;
}

export async function getCityComparison(amount: number, fromYear: number, toYear: number) {
  // National at the top as the reference, then metros. Regions live in the dropdown.
  const cities = [
    CITY_SERIES.US,
    ...Object.values(CITY_SERIES).filter(s => s.tier === 'metro'),
  ];

  // Build each city's fallback chain (metro -> region -> national) and the
  // union of every series id we'll need so we can fetch in one round-trip.
  const chainsByCity = new Map<string, CpiSeries[]>();
  const allSeriesIds = new Set<string>();
  for (const city of cities) {
    const chain: CpiSeries[] = [];
    let cur: CpiSeries | undefined = city;
    while (cur) {
      chain.push(cur);
      allSeriesIds.add(cur.seriesId);
      cur = cur.parent ? CITY_SERIES[cur.parent] : undefined;
    }
    chainsByCity.set(city.id, chain);
  }

  const seriesIds = [...allSeriesIds];
  const rows = await sql`
    SELECT series_id, year, AVG(value)::numeric AS avg
    FROM cpi_observations
    WHERE series_id = ANY(${seriesIds}::text[])
      AND year BETWEEN ${fromYear} AND ${toYear}
    GROUP BY series_id, year
  ` as Array<{ series_id: string; year: number; avg: string }>;

  const bySeries = new Map<string, Map<number, number>>();
  for (const id of seriesIds) bySeries.set(id, new Map());
  for (const r of rows) bySeries.get(r.series_id)!.set(r.year, parseFloat(r.avg));

  return cities.map(city => {
    const chain = chainsByCity.get(city.id)!;
    if (fromYear === toYear) {
      return { id: city.id, label: city.label, equivalentAmount: amount, inflationRate: 0, fallbackUsed: false };
    }

    let totalRatio = 1;
    let fallbackUsed = false;
    for (let y = fromYear + 1; y <= toYear; y++) {
      let tier: CpiSeries | null = null;
      for (const s of chain) {
        const map = bySeries.get(s.seriesId)!;
        if (map.has(y - 1) && map.has(y)) { tier = s; break; }
      }
      if (!tier) {
        return { id: city.id, label: city.label, equivalentAmount: null, inflationRate: null, fallbackUsed: false };
      }
      if (tier.id !== city.id) fallbackUsed = true;
      const map = bySeries.get(tier.seriesId)!;
      totalRatio *= map.get(y)! / map.get(y - 1)!;
    }

    const equivalent = amount * totalRatio;
    const rate = (totalRatio - 1) * 100;
    return {
      id: city.id,
      label: city.label,
      equivalentAmount: Math.round(equivalent * 100) / 100,
      inflationRate: Math.round(rate * 100) / 100,
      fallbackUsed,
    };
  });
}

export async function getCategoryBreakdown(amount: number, fromYear: number, toYear: number) {
  const catIds = Object.values(CATEGORY_SERIES).map(s => s.seriesId);
  const rows = await sql`
    SELECT series_id, year, AVG(value)::numeric AS avg
    FROM cpi_observations
    WHERE series_id = ANY(${catIds}::text[])
      AND year IN (${fromYear}, ${toYear})
    GROUP BY series_id, year
  ` as Array<{ series_id: string; year: number; avg: string }>;

  const bySeries = new Map<string, { from?: number; to?: number }>();
  for (const r of rows) {
    const v = parseFloat(r.avg);
    const entry = bySeries.get(r.series_id) ?? {};
    if (r.year === fromYear) entry.from = v;
    if (r.year === toYear) entry.to = v;
    bySeries.set(r.series_id, entry);
  }

  const out = [];
  for (const cat of Object.values(CATEGORY_SERIES)) {
    const v = bySeries.get(cat.seriesId);
    const latestYoY = await getLatestYoY(cat.seriesId);
    if (!v?.from || !v?.to) {
      out.push({
        id: cat.id,
        label: cat.label,
        equivalentAmount: null,
        inflationRate: null,
        latestYoY: latestYoY?.rate ?? null,
      });
      continue;
    }
    const equivalent = amount * (v.to / v.from);
    const rate = ((v.to - v.from) / v.from) * 100;
    out.push({
      id: cat.id,
      label: cat.label,
      equivalentAmount: Math.round(equivalent * 100) / 100,
      inflationRate: Math.round(rate * 100) / 100,
      latestYoY: latestYoY?.rate ?? null,
    });
  }
  return out;
}

export async function getHeadlineSeriesId(): Promise<string> {
  return HEADLINE_SERIES_ID;
}
