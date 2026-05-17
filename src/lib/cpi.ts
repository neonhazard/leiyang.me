import { sql } from './db';
import { CITY_SERIES, CATEGORY_SERIES, HEADLINE_SERIES_ID } from '@/constants/purchasing-power';

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

export async function getCityComparison(amount: number, fromYear: number, toYear: number) {
  const cityIds = Object.values(CITY_SERIES).map(s => s.seriesId);
  const rows = await sql`
    SELECT series_id, year, AVG(value)::numeric AS avg
    FROM cpi_observations
    WHERE series_id = ANY(${cityIds}::text[])
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

  return Object.values(CITY_SERIES).map(city => {
    const v = bySeries.get(city.seriesId);
    if (!v?.from || !v?.to) {
      return { id: city.id, label: city.label, equivalentAmount: null, inflationRate: null };
    }
    const equivalent = amount * (v.to / v.from);
    const rate = ((v.to - v.from) / v.from) * 100;
    return {
      id: city.id,
      label: city.label,
      equivalentAmount: Math.round(equivalent * 100) / 100,
      inflationRate: Math.round(rate * 100) / 100,
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
