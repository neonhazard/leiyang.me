import { NextRequest, NextResponse } from 'next/server';
import { CITY_SERIES, PURCHASING_POWER_METADATA } from '@/constants/purchasing-power';
import { getAnnualAverage } from '@/lib/cpi';

interface CalculationRequest {
  amount: number;
  fromYear: number;
  toYear: number;
  location: keyof typeof CITY_SERIES;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();
    const { amount, fromYear, toYear, location } = body;
    const currentYear = new Date().getFullYear();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }
    if (fromYear < 1913 || toYear < 1913) {
      return NextResponse.json({ error: 'Years must be 1913 or later' }, { status: 400 });
    }
    if (fromYear > currentYear || toYear > currentYear) {
      return NextResponse.json({ error: 'Years cannot be in the future' }, { status: 400 });
    }
    const series = CITY_SERIES[location];
    if (!series) {
      return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
    }

    const [fromCPI, toCPI] = await Promise.all([
      getAnnualAverage(series.seriesId, fromYear),
      getAnnualAverage(series.seriesId, toYear),
    ]);

    if (fromCPI == null || toCPI == null) {
      return NextResponse.json(
        { error: `CPI data not available for ${location} in ${fromCPI == null ? fromYear : toYear}. Try a different year or sync the database.` },
        { status: 503 }
      );
    }

    const equivalentAmount = amount * (toCPI / fromCPI);
    const inflationRate = ((toCPI - fromCPI) / fromCPI) * 100;

    return NextResponse.json({
      originalAmount: amount,
      originalYear: fromYear,
      targetYear: toYear,
      location,
      equivalentAmount: Math.round(equivalentAmount * 100) / 100,
      inflationRate: Math.round(inflationRate * 100) / 100,
      cpiData: {
        fromCPI: Math.round(fromCPI * 100) / 100,
        toCPI: Math.round(toCPI * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Error calculating purchasing power:', error);
    return NextResponse.json({ error: 'Failed to calculate purchasing power. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(PURCHASING_POWER_METADATA);
}
