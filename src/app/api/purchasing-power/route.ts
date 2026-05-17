import { NextRequest, NextResponse } from 'next/server';
import { CITY_SERIES, PURCHASING_POWER_METADATA } from '@/constants/purchasing-power';
import { getChainedInflation } from '@/lib/cpi';

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
    if (!CITY_SERIES[location]) {
      return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
    }

    const chained = await getChainedInflation(location, fromYear, toYear);
    if (!chained) {
      return NextResponse.json(
        { error: `CPI data not available for ${location} in the range ${fromYear}-${toYear}.` },
        { status: 503 }
      );
    }

    const equivalentAmount = amount * chained.ratio;
    const inflationRate = (chained.ratio - 1) * 100;

    return NextResponse.json({
      originalAmount: amount,
      originalYear: fromYear,
      targetYear: toYear,
      location,
      equivalentAmount: Math.round(equivalentAmount * 100) / 100,
      inflationRate: Math.round(inflationRate * 100) / 100,
      ratio: chained.ratio,
      phases: chained.phases.map(p => ({
        ...p,
        startCpi: Math.round(p.startCpi * 100) / 100,
        endCpi: Math.round(p.endCpi * 100) / 100,
        ratio: Math.round(p.ratio * 10000) / 10000,
      })),
    });
  } catch (error) {
    console.error('Error calculating purchasing power:', error);
    return NextResponse.json({ error: 'Failed to calculate purchasing power. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(PURCHASING_POWER_METADATA);
}
