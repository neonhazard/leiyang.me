import { NextResponse } from 'next/server';
import { getLatestYoY, getLatestMonthly } from '@/lib/cpi';
import { HEADLINE_SERIES_ID } from '@/constants/purchasing-power';

// 120 months of YoY plus 12 months of lookback baseline
const HISTORY_MONTHS = 132;

export async function GET() {
  const [yoy, recent] = await Promise.all([
    getLatestYoY(HEADLINE_SERIES_ID),
    getLatestMonthly(HEADLINE_SERIES_ID, HISTORY_MONTHS),
  ]);
  if (!yoy) {
    return NextResponse.json({ error: 'Insufficient monthly data' }, { status: 503 });
  }

  // Compute YoY for each month where we have a value 12 months prior.
  const fmt = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
  const yoySeries: Array<{ ym: string; rate: number }> = [];
  for (let i = 12; i < recent.length; i++) {
    const cur = recent[i];
    const prev = recent[i - 12];
    if (!cur || !prev || prev.value === 0) continue;
    const rate = ((cur.value - prev.value) / prev.value) * 100;
    yoySeries.push({ ym: fmt(cur.year, cur.month), rate: Math.round(rate * 100) / 100 });
  }

  let peakRate = -Infinity;
  let peakYm = '';
  let sum = 0;
  for (const p of yoySeries) {
    if (p.rate > peakRate) { peakRate = p.rate; peakYm = p.ym; }
    sum += p.rate;
  }
  const avgRate = yoySeries.length ? sum / yoySeries.length : 0;

  return NextResponse.json({
    yoyRate: Math.round(yoy.rate * 100) / 100,
    latestDate: yoy.latestDate,
    previousDate: yoy.previousDate,
    yoySeries,
    peakRate: yoySeries.length ? Math.round(peakRate * 100) / 100 : null,
    peakDate: peakYm || null,
    avgRate: Math.round(avgRate * 100) / 100,
  });
}
