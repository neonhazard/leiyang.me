import { sql } from '../src/lib/db';
import { ALL_SERIES } from '../src/constants/purchasing-power';

interface CoverageRow {
  series_id: string;
  total_rows: number;
  min_year: number;
  max_year: number;
  distinct_years: number;
  avg_per_year: number;
}

async function main() {
  const rows = await sql`
    SELECT
      series_id,
      COUNT(*)::int                                              AS total_rows,
      MIN(year)::int                                             AS min_year,
      MAX(year)::int                                             AS max_year,
      COUNT(DISTINCT year)::int                                  AS distinct_years,
      ROUND(COUNT(*)::numeric / NULLIF(COUNT(DISTINCT year), 0), 1) AS avg_per_year
    FROM cpi_observations
    GROUP BY series_id
    ORDER BY series_id
  ` as Array<{
    series_id: string;
    total_rows: number;
    min_year: number;
    max_year: number;
    distinct_years: number;
    avg_per_year: string;
  }>;

  const byId = new Map<string, CoverageRow>(
    rows.map(r => [r.series_id, { ...r, avg_per_year: parseFloat(r.avg_per_year) }])
  );

  console.log('label                                  series          src   rows  span         years   obs/yr');
  console.log('────────────────────────────────────── ─────────────── ───── ───── ──────────── ─────── ──────');
  for (const s of ALL_SERIES) {
    const r = byId.get(s.seriesId);
    if (!r) {
      console.log(`${s.label.padEnd(38)} ${s.seriesId.padEnd(15)} ${s.source.padEnd(5)} (no data)`);
      continue;
    }
    console.log(
      `${s.label.padEnd(38)} ${s.seriesId.padEnd(15)} ${s.source.padEnd(5)} ${String(r.total_rows).padStart(5)} ${String(r.min_year)}-${String(r.max_year).padEnd(7)} ${String(r.distinct_years).padStart(5)}   ${String(r.avg_per_year).padStart(5)}`
    );
  }

  // Gaps: years between min and max where there are NO observations at all
  console.log('\nGap report (years between min_year and max_year with zero observations):');
  for (const s of ALL_SERIES) {
    const r = byId.get(s.seriesId);
    if (!r) continue;
    const span = r.max_year - r.min_year + 1;
    const missing = span - r.distinct_years;
    if (missing > 0) {
      console.log(`  ${s.label.padEnd(38)} missing ${missing} of ${span} years`);
    }
  }
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
