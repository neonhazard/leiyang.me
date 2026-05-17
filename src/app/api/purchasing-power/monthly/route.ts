import { NextResponse } from 'next/server';
import { getLatestYoY, getLatestMonthly } from '@/lib/cpi';
import { HEADLINE_SERIES_ID } from '@/constants/purchasing-power';

export async function GET() {
  const [yoy, recent] = await Promise.all([
    getLatestYoY(HEADLINE_SERIES_ID),
    getLatestMonthly(HEADLINE_SERIES_ID, 13),
  ]);
  if (!yoy) {
    return NextResponse.json({ error: 'Insufficient monthly data' }, { status: 503 });
  }
  return NextResponse.json({
    yoyRate: Math.round(yoy.rate * 100) / 100,
    latestDate: yoy.latestDate,
    previousDate: yoy.previousDate,
    recentMonths: recent,
  });
}
