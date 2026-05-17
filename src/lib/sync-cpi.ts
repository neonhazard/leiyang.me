import { sql } from './db';
import { ALL_SERIES, CpiSeries } from '@/constants/purchasing-power';

const FRED_API_KEY = process.env.FRED_API_KEY;
const BLS_API_KEY = process.env.BLS_API_KEY;

interface Observation {
  year: number;
  month: number;
  value: number;
}

async function fetchFredSeries(seriesId: string): Promise<Observation[]> {
  if (!FRED_API_KEY) throw new Error('FRED_API_KEY missing');
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=asc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED ${seriesId} ${res.status}: ${await res.text()}`);
  const json = await res.json() as { observations: Array<{ date: string; value: string }> };
  return json.observations
    .filter(o => o.value !== '.')
    .map(o => {
      const [y, m] = o.date.split('-').map(Number);
      return { year: y, month: m, value: parseFloat(o.value) };
    })
    .filter(o => Number.isFinite(o.value));
}

async function fetchBlsSeries(seriesId: string): Promise<Observation[]> {
  if (!BLS_API_KEY) throw new Error('BLS_API_KEY missing');
  const currentYear = new Date().getFullYear();
  const results: Observation[] = [];
  for (let startYear = 1965; startYear <= currentYear; startYear += 20) {
    const endYear = Math.min(startYear + 19, currentYear);
    const res = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seriesid: [seriesId],
        startyear: String(startYear),
        endyear: String(endYear),
        registrationkey: BLS_API_KEY,
      }),
    });
    if (!res.ok) throw new Error(`BLS ${seriesId} ${res.status}`);
    const json = await res.json() as {
      Results?: { series: Array<{ data: Array<{ year: string; period: string; value: string }> }> };
    };
    const data = json.Results?.series?.[0]?.data ?? [];
    for (const d of data) {
      if (!d.period.startsWith('M')) continue;
      const month = parseInt(d.period.slice(1), 10);
      if (month < 1 || month > 12) continue;
      const v = parseFloat(d.value);
      if (!Number.isFinite(v)) continue;
      results.push({ year: parseInt(d.year, 10), month, value: v });
    }
  }
  return results;
}

async function upsertObservations(series: CpiSeries, obs: Observation[]): Promise<number> {
  if (obs.length === 0) return 0;
  const seriesIds = obs.map(() => series.seriesId);
  const years = obs.map(o => o.year);
  const months = obs.map(o => o.month);
  const values = obs.map(o => o.value);
  const sources = obs.map(() => series.source);
  await sql`
    INSERT INTO cpi_observations (series_id, year, month, value, source)
    SELECT * FROM UNNEST(
      ${seriesIds}::text[],
      ${years}::int[],
      ${months}::int[],
      ${values}::numeric[],
      ${sources}::text[]
    )
    ON CONFLICT (series_id, year, month) DO UPDATE
      SET value = EXCLUDED.value,
          source = EXCLUDED.source,
          fetched_at = now()
  `;
  return obs.length;
}

export async function syncOne(series: CpiSeries): Promise<{ seriesId: string; rows: number; status: 'ok' | 'error'; error?: string }> {
  try {
    const obs = series.source === 'FRED'
      ? await fetchFredSeries(series.seriesId)
      : await fetchBlsSeries(series.seriesId);
    const rows = await upsertObservations(series, obs);
    await sql`
      INSERT INTO cpi_sync_runs (series_id, rows_upserted, status)
      VALUES (${series.seriesId}, ${rows}, 'ok')
    `;
    return { seriesId: series.seriesId, rows, status: 'ok' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await sql`
      INSERT INTO cpi_sync_runs (series_id, rows_upserted, status, error)
      VALUES (${series.seriesId}, 0, 'error', ${msg})
    `;
    return { seriesId: series.seriesId, rows: 0, status: 'error', error: msg };
  }
}

export async function syncAllSeries() {
  const results = [];
  for (const series of ALL_SERIES) {
    const r = await syncOne(series);
    results.push(r);
    console.log(`[sync] ${series.id} (${series.seriesId}) ${r.status} rows=${r.rows}${r.error ? ` err=${r.error}` : ''}`);
  }
  const totalRows = results.reduce((acc, r) => acc + r.rows, 0);
  const errors = results.filter(r => r.status === 'error').length;
  return { totalRows, errors, results };
}

if (require.main === module) {
  // Allow direct invocation: `tsx src/lib/sync-cpi.ts`
  (async () => {
    const out = await syncAllSeries();
    console.log(JSON.stringify({ totalRows: out.totalRows, errors: out.errors }, null, 2));
    process.exit(out.errors > 0 ? 1 : 0);
  })();
}
