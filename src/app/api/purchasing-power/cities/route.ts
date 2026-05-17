import { NextRequest, NextResponse } from 'next/server';
import { getCityComparison } from '@/lib/cpi';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const amount = parseFloat(url.searchParams.get('amount') ?? '');
  const fromYear = parseInt(url.searchParams.get('fromYear') ?? '', 10);
  const toYear = parseInt(url.searchParams.get('toYear') ?? '', 10);

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }
  if (!Number.isInteger(fromYear) || !Number.isInteger(toYear)) {
    return NextResponse.json({ error: 'fromYear and toYear required' }, { status: 400 });
  }

  const cities = await getCityComparison(amount, fromYear, toYear);
  return NextResponse.json({ amount, fromYear, toYear, cities });
}
