import { NextRequest, NextResponse } from 'next/server';
import { CITY_SERIES, CATEGORY_SERIES } from '@/constants/purchasing-power';
import { getAnnualSeries, getAnnualSeriesWithFallback, getMultiTierAnnualSeries } from '@/lib/cpi';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const location = url.searchParams.get('location');
  const category = url.searchParams.get('category');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  if (location && CITY_SERIES[location]) {
    const fromY = from ? parseInt(from, 10) : 1947;
    const toY = to ? parseInt(to, 10) : new Date().getFullYear();
    // Flat deepest-wins data (for CSV export and single-line use)
    const data = await getAnnualSeriesWithFallback(location, fromY, toY);
    // Per-tier full-coverage data (for the chart's separate lines)
    const { byTier } = await getMultiTierAnnualSeries(location, fromY, toY);
    const series = CITY_SERIES[location];
    const fallbackUsed = data.some(d => d.tier !== series.tier);
    return NextResponse.json({
      id: series.id,
      label: series.label,
      seriesId: series.seriesId,
      data,
      byTier,
      fallbackUsed,
    });
  }

  if (category && CATEGORY_SERIES[category]) {
    const series = CATEGORY_SERIES[category];
    const data = await getAnnualSeries(
      series.seriesId,
      from ? parseInt(from, 10) : undefined,
      to ? parseInt(to, 10) : undefined
    );
    return NextResponse.json({ id: series.id, label: series.label, seriesId: series.seriesId, data });
  }

  return NextResponse.json({ error: 'Provide a valid ?location= or ?category=' }, { status: 400 });
}
