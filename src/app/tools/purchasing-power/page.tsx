'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Masthead from '@/components/Masthead';
import { PURCHASING_POWER_METADATA } from '@/constants/purchasing-power';
import { formatNumberWithCommas, getNumericValue, formatCurrency } from '@/utils/formatting';
import { calculateSliderPosition, calculateRangeWidth } from '@/utils/slider';
import MonthlyInflationCard from './components/MonthlyInflationCard';
import CpiChart from './components/CpiChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import CityComparisonTable from './components/CityComparisonTable';
import CsvExportButton from './components/CsvExportButton';
import '@/styles/slider.css';

interface CalculationResult {
  originalAmount: number;
  originalYear: number;
  targetYear: number;
  location: string;
  equivalentAmount: number;
  inflationRate: number;
  cpiData: {
    fromCPI: number;
    toCPI: number;
  };
  usingSampleData?: boolean;
  usingFallbackData?: boolean;
  actualLocation?: string;
}

export default function PurchasingPowerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <PurchasingPowerCalculator />
    </Suspense>
  );
}

function PurchasingPowerCalculator() {
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const initialFromYear = (() => {
    const p = parseInt(searchParams.get('fromYear') ?? '', 10);
    return Number.isInteger(p) && p >= 1913 && p <= currentYear ? p : 1990;
  })();
  const initialAmount = (() => {
    const p = parseFloat(searchParams.get('amount') ?? '');
    return Number.isFinite(p) && p > 0 ? String(p) : '10000';
  })();
  const initialLocation = (() => {
    const p = searchParams.get('location') ?? '';
    return PURCHASING_POWER_METADATA.locations.some(l => l.id === p) ? p : 'US';
  })();

  const [amount, setAmount] = useState<string>(initialAmount);
  const [displayAmount, setDisplayAmount] = useState<string>(formatNumberWithCommas(initialAmount));
  const [fromYear, setFromYear] = useState<number>(initialFromYear);
  const [toYear, setToYear] = useState<number>(currentYear);
  const [location, setLocation] = useState<string>(initialLocation);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const metadata = PURCHASING_POWER_METADATA;

  const [locationDateRange, setLocationDateRange] = useState<{min: number, max: number} | null>(null);

  const handleAmountChange = (value: string) => {
    try {
      const numericValue = getNumericValue(value);
      setAmount(numericValue);
      setDisplayAmount(formatNumberWithCommas(value));
    } catch {
      setAmount(value);
      setDisplayAmount(value);
    }
  };

  useEffect(() => {
    if (location && metadata.dateRanges) {
      setLocationDateRange(metadata.dateRanges[location] || { min: 1913, max: new Date().getFullYear() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/purchasing-power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          fromYear,
          toYear,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-page">
      <Masthead />

      <main className="shell py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 600,
                fontVariationSettings: '"opsz" 72',
                fontSize: "clamp(32px, 5vw, 72px)",
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                marginBottom: 16,
                color: "var(--fg)",
              }}
            >
              Purchasing{" "}
              <span style={{ fontFamily: "var(--font-bodoni), serif", fontStyle: "italic", color: "var(--accent)" }}>
                Power
              </span>
            </h1>
            <p className="text-xl text-muted">
              See how the value of money changes over time using official CPI data
            </p>
          </div>

          {/* Monthly Inflation Widget */}
          <MonthlyInflationCard />

          {/* Calculator Form */}
          <div className="bg-surface border border-rule p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Amount Input */}
              <div>
                <label className="block text-fg font-semibold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full px-4 py-3 bg-elevated border border-rule text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent h-12"
                  placeholder="Enter amount (e.g., 1,000,000)"
                />
              </div>

              {/* Location Selection */}
              <div>
                <label className="block text-fg font-semibold mb-2">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-elevated border border-rule text-fg focus:outline-none focus:ring-2 focus:ring-accent h-12"
                >
                  {metadata.locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-elevated">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Year Range with Slider - Full Width */}
            <div className="mt-6">
              <label className="block text-fg font-semibold mb-2">
                Year Range
              </label>

              {/* Available Data Range Info */}
              {locationDateRange && (
                <p className="text-muted text-sm mb-3">
                  Available data: {locationDateRange.min} - {locationDateRange.max}
                </p>
              )}

              {/* Visual Range Display with draggable handles */}
              {(() => {
                const minYear = locationDateRange?.min ?? 1913;
                const maxYear = locationDateRange?.max ?? new Date().getFullYear();
                const fromPosition = calculateSliderPosition(fromYear, minYear, maxYear);
                const rangeWidth = calculateRangeWidth(fromYear, toYear, minYear, maxYear);

                return (
                  <div className="relative mb-2" style={{ height: 32 }}>
                    {/* Track */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-rule rounded-lg" />
                    {/* Active range */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-2 bg-accent rounded-lg"
                      style={{ left: `${fromPosition}%`, width: `${rangeWidth}%` }}
                    />
                    {/* From handle */}
                    <input
                      type="range"
                      min={minYear}
                      max={maxYear}
                      step={1}
                      value={fromYear}
                      onChange={(e) => {
                        const v = Math.min(parseInt(e.target.value, 10), toYear);
                        setFromYear(v);
                      }}
                      className="dual-range"
                      aria-label="From year"
                    />
                    {/* To handle */}
                    <input
                      type="range"
                      min={minYear}
                      max={maxYear}
                      step={1}
                      value={toYear}
                      onChange={(e) => {
                        const v = Math.max(parseInt(e.target.value, 10), fromYear);
                        setToYear(v);
                      }}
                      className="dual-range"
                      aria-label="To year"
                    />
                  </div>
                );
              })()}

              {/* Slider Labels */}
              <div className="flex justify-between text-xs text-muted mb-6">
                <span>{locationDateRange?.min ?? 1913}</span>
                <span className="text-fg font-semibold">
                  {fromYear} – {toYear} ({toYear - fromYear} year{toYear - fromYear !== 1 ? 's' : ''})
                </span>
                <span>{locationDateRange?.max ?? new Date().getFullYear()}</span>
              </div>

              {/* Year Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted text-sm mb-1">From Year</label>
                  <input
                    type="number"
                    min={locationDateRange?.min ?? 1913}
                    max={locationDateRange?.max ?? new Date().getFullYear()}
                    step={1}
                    value={fromYear}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (Number.isInteger(v)) setFromYear(v);
                    }}
                    onBlur={(e) => {
                      const min = locationDateRange?.min ?? 1913;
                      const max = locationDateRange?.max ?? new Date().getFullYear();
                      const v = parseInt(e.target.value, 10);
                      const clamped = Number.isInteger(v)
                        ? Math.max(min, Math.min(v, Math.min(toYear, max)))
                        : fromYear;
                      setFromYear(clamped);
                    }}
                    className="w-full px-3 py-2 bg-elevated border border-rule text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-muted text-sm mb-1">To Year</label>
                  <input
                    type="number"
                    min={locationDateRange?.min ?? 1913}
                    max={locationDateRange?.max ?? new Date().getFullYear()}
                    step={1}
                    value={toYear}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (Number.isInteger(v)) setToYear(v);
                    }}
                    onBlur={(e) => {
                      const min = locationDateRange?.min ?? 1913;
                      const max = locationDateRange?.max ?? new Date().getFullYear();
                      const v = parseInt(e.target.value, 10);
                      const clamped = Number.isInteger(v)
                        ? Math.min(max, Math.max(v, Math.max(fromYear, min)))
                        : toYear;
                      setToYear(clamped);
                    }}
                    className="w-full px-3 py-2 bg-elevated border border-rule text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleCalculate}
                disabled={loading || !amount || !metadata}
                className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'Calculate Purchasing Power'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-lg p-4 mb-8">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="bg-surface border border-rule p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-fg">
                  Purchasing Power Results
                </h2>
                <CsvExportButton
                  location={location}
                  fromYear={fromYear}
                  toYear={toYear}
                  amount={parseFloat(amount)}
                />
              </div>

              {/* Sample Data Notice */}
              {result.usingSampleData && (
                <div className="bg-yellow-500/15 border border-yellow-500/40 rounded-lg p-4 mb-6">
                  <p className="text-yellow-300 text-sm">
                    <strong>Demo Mode:</strong> Using sample CPI data. For real-time data, please add your FRED and BLS API keys to the environment variables.
                  </p>
                </div>
              )}

              {/* Fallback Data Notice */}
              {result.usingFallbackData && (
                <div className="bg-blue-500/15 border border-blue-500/40 rounded-lg p-4 mb-6">
                  <p className="text-blue-300 text-sm">
                    <strong>Note:</strong> Regional CPI data for {metadata.locations.find(l => l.id === result.location)?.name} is not available for the selected years.
                    Showing US National Average data instead.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {/* Main Result */}
                <div className="text-center">
                  <div className="bg-elevated border border-rule p-6 mb-4">
                    <p className="text-muted text-sm mb-2">
                      {formatCurrency(result.originalAmount)} in {result.originalYear}
                    </p>
                    <p className="text-4xl font-bold text-fg mb-2">
                      {formatCurrency(result.equivalentAmount)}
                    </p>
                    <p className="text-muted text-sm">
                      in {result.targetYear}
                    </p>
                  </div>

                  <p className="text-lg text-accent font-semibold">
                    {result.inflationRate > 0 ? '+' : ''}{result.inflationRate.toFixed(2)}%
                    {result.inflationRate > 0 ? ' inflation' : ' deflation'}
                  </p>
                </div>

                {/* Detailed Information */}
                <div className="space-y-4">
                  <div className="bg-elevated border border-rule p-4">
                    <h3 className="text-fg font-semibold mb-2">Location</h3>
                    <p className="text-muted">
                      {metadata.locations.find(l => l.id === result.location)?.name}
                    </p>
                    <p className="text-muted text-sm mt-1">
                      Data Source: {metadata.dataSources?.[result.location]}
                    </p>
                  </div>

                  <div className="bg-elevated border border-rule p-4">
                    <h3 className="text-fg font-semibold mb-2">CPI Data</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted">CPI {result.originalYear}</p>
                        <p className="text-fg font-semibold">{result.cpiData.fromCPI}</p>
                      </div>
                      <div>
                        <p className="text-muted">CPI {result.targetYear}</p>
                        <p className="text-fg font-semibold">{result.cpiData.toCPI}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-elevated border border-rule p-4">
                    <h3 className="text-fg font-semibold mb-2">Available Data Range</h3>
                    <p className="text-muted text-sm">
                      {locationDateRange ?
                        `Data available from ${locationDateRange.min} to ${locationDateRange.max}` :
                        'Date range information not available'
                      }
                    </p>
                    <p className="text-muted text-xs mt-1">
                      Note: Date ranges may vary by location and data source
                    </p>
                  </div>
                </div>
              </div>

              {/* Fun Facts */}
              <div className="mt-8 bg-elevated border border-rule rounded-lg p-6">
                <h3 className="text-fg font-semibold mb-4">What this means:</h3>
                <p className="text-muted">
                  {result.inflationRate > 0 ? (
                    <>
                      Due to inflation, you would need <span className="text-accent font-semibold">
                      {formatCurrency(result.equivalentAmount)}
                      </span> in {result.targetYear} to have the same purchasing power as{' '}
                      <span className="text-accent font-semibold">
                      {formatCurrency(result.originalAmount)}
                      </span> in {result.originalYear}.
                    </>
                  ) : (
                    <>
                      Due to deflation, <span className="text-accent font-semibold">
                      {formatCurrency(result.originalAmount)}
                      </span> in {result.originalYear} would only be worth{' '}
                      <span className="text-accent font-semibold">
                      {formatCurrency(result.equivalentAmount)}
                      </span> in {result.targetYear}.
                    </>
                  )}
                </p>
              </div>

              {/* Historical CPI Chart */}
              <div className="mt-6">
                <CpiChart location={location} fromYear={fromYear} toYear={toYear} />
              </div>
            </div>
          )}

          {/* City Comparison */}
          {result && (
            <div className="mt-8">
              <CityComparisonTable
                amount={parseFloat(amount)}
                fromYear={fromYear}
                toYear={toYear}
                highlightId={location}
              />
            </div>
          )}

          {/* Category Breakdown */}
          {result && (
            <div className="mt-8">
              <CategoryBreakdown
                amount={parseFloat(amount)}
                fromYear={fromYear}
                toYear={toYear}
              />
            </div>
          )}

          {/* Information Section */}
          <div className="mt-12 bg-surface border border-rule rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-fg mb-6 text-center">
              About This Calculator
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-accent mb-4">Data Source</h3>
                <p className="text-muted mb-4">
                  This calculator uses official Consumer Price Index (CPI) data from two authoritative sources:
                </p>
                <ul className="text-muted mb-4 list-disc list-inside space-y-2">
                  <li><strong>Bureau of Labor Statistics (BLS)</strong> - For regional metropolitan area CPI data</li>
                  <li><strong>Federal Reserve Economic Data (FRED)</strong> - For US National Average CPI data</li>
                </ul>
                <p className="text-muted">
                  CPI measures the average change over time in the prices paid by urban consumers
                  for a market basket of consumer goods and services.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-accent mb-4">How It Works</h3>
                <p className="text-muted mb-4">
                  The calculator uses the formula: <br />
                  <code className="bg-elevated border border-rule px-2 py-1 rounded text-sm font-mono text-fg">
                    Value in Year B = Value in Year A × (CPI Year B / CPI Year A)
                  </code>
                </p>
                <p className="text-muted">
                  This adjusts the monetary value based on changes in purchasing power over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
