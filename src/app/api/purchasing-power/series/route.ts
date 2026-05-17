import { NextRequest, NextResponse } from 'next/server';
import { CITY_SERIES, CATEGORY_SERIES } from '@/constants/purchasing-power';
import { getAnnualSeries } from '@/lib/cpi';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const location = url.searchParams.get('location');
  const category = url.searchParams.get('category');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  let series;
  if (location && CITY_SERIES[location]) {
    series = CITY_SERIES[location];
  } else if (category && CATEGORY_SERIES[category]) {
    series = CATEGORY_SERIES[category];
  } else {
    return NextResponse.json({ error: 'Provide a valid ?location= or ?category=' }, { status: 400 });
  }

  const data = await getAnnualSeries(
    series.seriesId,
    from ? parseInt(from, 10) : undefined,
    to ? parseInt(to, 10) : undefined
  );

  return NextResponse.json({ id: series.id, label: series.label, seriesId: series.seriesId, data });
}
