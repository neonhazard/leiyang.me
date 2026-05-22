import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Masthead from '@/components/Masthead';
import { HEADLINE_SERIES_ID, MIN_YEAR } from '@/constants/purchasing-power';
import { getAnnualAverage } from '@/lib/cpi';
import { formatCurrency } from '@/utils/formatting';
import CpiChart from '../components/CpiChart';
import CityComparisonTable from '../components/CityComparisonTable';

export const revalidate = 86400;

export async function generateStaticParams() {
  const params: Array<{ year: string }> = [];
  for (let y = MIN_YEAR; y <= new Date().getFullYear() - 1; y++) {
    params.push({ year: String(y) });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `What is $100 in ${year} worth today? — Lei Yang`,
    description: `Calculate the purchasing power of US dollars from ${year} in today's terms using official CPI data from FRED and BLS.`,
    alternates: { canonical: `/tools/purchasing-power/${year}` },
  };
}

export default async function PurchasingPowerYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(yearNum) || yearNum < MIN_YEAR || yearNum >= currentYear) {
    notFound();
  }
  const toYear = currentYear - 1; // most recent full year of CPI data
  const [fromCPI, toCPI] = await Promise.all([
    getAnnualAverage(HEADLINE_SERIES_ID, yearNum),
    getAnnualAverage(HEADLINE_SERIES_ID, toYear),
  ]);

  if (fromCPI == null || toCPI == null) {
    notFound();
  }

  const baseAmount = 100;
  const equivalent = baseAmount * (toCPI / fromCPI);
  const inflationRate = ((toCPI - fromCPI) / fromCPI) * 100;
  const yearsBetween = toYear - yearNum;
  const annualizedRate = (Math.pow(toCPI / fromCPI, 1 / yearsBetween) - 1) * 100;

  return (
    <div className="min-h-screen bg-page">
      <Masthead />
      <main className="shell py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted text-sm mb-4">
            <Link href="/tools/purchasing-power" className="hover:text-accent">← Purchasing Power</Link>
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 600,
              fontVariationSettings: '"opsz" 72',
              fontSize: 'clamp(28px, 4vw, 56px)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              marginBottom: 16,
              color: 'var(--fg)',
            }}
          >
            {formatCurrency(baseAmount)} in <span style={{ fontFamily: 'var(--font-bodoni), serif', fontStyle: 'italic', color: 'var(--accent)' }}>{yearNum}</span> is worth{' '}
            <span style={{ fontFamily: 'var(--font-bodoni), serif', fontStyle: 'italic', color: 'var(--accent)' }}>{formatCurrency(equivalent)}</span> in {toYear}
          </h1>

          <p className="text-xl text-muted mb-10">
            That&apos;s a cumulative inflation of {inflationRate >= 0 ? '+' : ''}{inflationRate.toFixed(1)}% over {yearsBetween} years
            ({annualizedRate >= 0 ? '+' : ''}{annualizedRate.toFixed(2)}% annualized), measured by the US National CPI.
          </p>

          <div className="bg-surface border border-rule p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-muted text-xs uppercase tracking-wide">CPI {yearNum}</p>
                <p className="text-2xl font-bold text-fg mt-1">{fromCPI.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide">CPI {toYear}</p>
                <p className="text-2xl font-bold text-fg mt-1">{toCPI.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide">$1 in {yearNum}</p>
                <p className="text-2xl font-bold text-accent mt-1">{formatCurrency(toCPI / fromCPI)}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <CpiChart location="US" fromYear={yearNum} toYear={toYear} />
          </div>

          <div className="mb-8">
            <CityComparisonTable amount={baseAmount} fromYear={yearNum} toYear={toYear} />
          </div>

          <div className="bg-elevated border border-rule rounded-lg p-6 text-center">
            <p className="text-fg mb-4">Try the interactive calculator with a different amount or city.</p>
            <Link
              href={`/tools/purchasing-power?fromYear=${yearNum}`}
              className="btn btn-primary inline-block"
            >
              Open Calculator
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
