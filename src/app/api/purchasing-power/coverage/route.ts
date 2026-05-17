import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { CITY_SERIES } from '@/constants/purchasing-power';

interface CoverageRow {
  series_id: string;
  min_year: number;
  max_year: number;
  years_with_data: number;
}

export async function GET() {
  const seriesIds = Object.values(CITY_SERIES).map(s => s.seriesId);
  const rows = await sql`
    SELECT
      series_id,
      MIN(year)::int            AS min_year,
      MAX(year)::int            AS max_year,
      COUNT(DISTINCT year)::int AS years_with_data
    FROM cpi_observations
    WHERE series_id = ANY(${seriesIds}::text[])
    GROUP BY series_id
  ` as CoverageRow[];

  const bySeries = new Map(rows.map(r => [r.series_id, r]));
  const coverage: Record<string, { min: number; max: number; years: number }> = {};
  for (const series of Object.values(CITY_SERIES)) {
    const r = bySeries.get(series.seriesId);
    if (r) coverage[series.id] = { min: r.min_year, max: r.max_year, years: r.years_with_data };
  }
  return NextResponse.json({ coverage });
}
