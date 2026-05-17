'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Masthead from '@/components/Masthead';
import { PURCHASING_POWER_METADATA, MIN_YEAR } from '@/constants/purchasing-power';
import { formatNumberWithCommas, getNumericValue, formatCurrency } from '@/utils/formatting';
import { calculateSliderPosition, calculateRangeWidth } from '@/utils/slider';
import MonthlyInflationCard from './components/MonthlyInflationCard';
import CpiChart from './components/CpiChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import CityComparisonTable from './components/CityComparisonTable';
import CsvExportButton from './components/CsvExportButton';
import '@/styles/slider.css';

interface InflationPhase {
  tier: 'national' | 'region' | 'metro';
  label: string;
  startYear: number;
  endYear: number;
  startCpi: number;
  endCpi: number;
  ratio: number;
}

interface CalculationResult {
  originalAmount: number;
  originalYear: number;
  targetYear: number;
  location: string;
  equivalentAmount: number;
  inflationRate: number;
  ratio: number;
  phases: InflationPhase[];
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
    return Number.isInteger(p) && p >= MIN_YEAR && p <= currentYear ? p : 1990;
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
  const [error, setError] = useState<string>('');

  const metadata = PURCHASING_POWER_METADATA;

  const [locationDateRange, setLocationDateRange] = useState<{min: number, max: number} | null>(null);
  const [coverage, setCoverage] = useState<Record<string, { min: number; max: number; years: number }> | null>(null);

  useEffect(() => {
    fetch('/api/purchasing-power/coverage')
      .then(r => r.ok ? r.json() : null)
      .then(res => setCoverage(res?.coverage ?? null))
      .catch(() => setCoverage(null));
  }, []);

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
      setLocationDateRange(metadata.dateRanges[location] || { min: MIN_YEAR, max: new Date().getFullYear() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Auto-fetch the calculation whenever inputs change. Debounced so amount
  // typing doesn't flood the API.
  useEffect(() => {
    const amountNum = parseFloat(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) return;
    const range = metadata.dateRanges[location];
    if (range && (fromYear < range.min || toYear > range.max || fromYear > toYear)) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch('/api/purchasing-power', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum, fromYear, toYear, location }),
        signal: controller.signal,
      })
        .then(async r => ({ ok: r.ok, data: await r.json() }))
        .then(({ ok, data }) => {
          if (controller.signal.aborted) return;
          if (!ok) {
            setError(data.error || 'Failed to calculate');
          } else {
            setError('');
            setResult(data);
          }
        })
        .catch(err => {
          if (err?.name === 'AbortError') return;
          setError(err instanceof Error ? err.message : 'An error occurred');
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [amount, fromYear, toYear, location, metadata.dateRanges]);


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
                  <optgroup label="National">
                    {metadata.locations.filter(l => l.tier === 'national').map(loc => (
                      <option key={loc.id} value={loc.id} className="bg-elevated">{loc.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Census Regions">
                    {metadata.locations.filter(l => l.tier === 'region').map(loc => (
                      <option key={loc.id} value={loc.id} className="bg-elevated">{loc.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Metropolitan Areas">
                    {metadata.locations.filter(l => l.tier === 'metro').map(loc => (
                      <option key={loc.id} value={loc.id} className="bg-elevated">{loc.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

            </div>

            {/* Year Range with Slider - Full Width */}
            <div className="mt-6">
              <label className="block text-fg font-semibold mb-2">
                Year Range
              </label>

              {/* Local Coverage Info */}
              {coverage && coverage[location] && (() => {
                const isUS = location === 'US';
                const isRegion = metadata.locations.find(l => l.id === location)?.tier === 'region';
                const fallbackText = isUS
                  ? 'no fallback needed (US National is the base series).'
                  : isRegion
                    ? 'fall back to the US National CPI year-by-year.'
                    : 'fall back to the regional, then US National CPI year-by-year.';
                return (
                  <p className="text-muted text-sm mb-3">
                    Local CPI data for {metadata.locations.find(l => l.id === location)?.name}: <span className="text-fg">{coverage[location].min}–{coverage[location].max}</span> ({coverage[location].years} years on record).
                    {' '}Years outside this range {fallbackText}
                  </p>
                );
              })()}

              {/* Visual Range Display with draggable handles */}
              {(() => {
                const minYear = locationDateRange?.min ?? MIN_YEAR;
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
                <span>{locationDateRange?.min ?? MIN_YEAR}</span>
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
                    min={locationDateRange?.min ?? MIN_YEAR}
                    max={locationDateRange?.max ?? new Date().getFullYear()}
                    step={1}
                    value={fromYear}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (Number.isInteger(v)) setFromYear(v);
                    }}
                    onBlur={(e) => {
                      const min = locationDateRange?.min ?? MIN_YEAR;
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
                    min={locationDateRange?.min ?? MIN_YEAR}
                    max={locationDateRange?.max ?? new Date().getFullYear()}
                    step={1}
                    value={toYear}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (Number.isInteger(v)) setToYear(v);
                    }}
                    onBlur={(e) => {
                      const min = locationDateRange?.min ?? MIN_YEAR;
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

              {/* Chained inflation notice (only when multiple tiers/phases were used) */}
              {result.phases.length > 1 && (
                <div className="bg-elevated border-l-2 border-accent/60 p-3 mb-6 text-sm text-muted">
                  <strong className="text-fg font-medium">Chained calculation:</strong>{' '}
                  Inflation is computed year-by-year using the most-local CPI series available for each year pair, then multiplied through. This avoids mixing series with different reference bases. See the phase breakdown below.
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
                    <h3 className="text-fg font-semibold mb-2">
                      {result.phases.length > 1 ? 'Calculation Phases' : 'CPI Data'}
                    </h3>
                    {result.phases.length === 0 ? (
                      <p className="text-muted text-sm">Same year — no inflation to apply.</p>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {result.phases.map((p, i) => (
                          <div key={i} className="flex justify-between gap-2 border-b border-rule/30 last:border-0 pb-1.5 last:pb-0">
                            <div>
                              <p className="text-fg">{p.startYear}{p.startYear !== p.endYear ? `–${p.endYear}` : ''}</p>
                              <p className="text-muted text-xs">{p.label}</p>
                            </div>
                            <div className="text-right font-mono">
                              <p className="text-fg">{p.startCpi} → {p.endCpi}</p>
                              <p className="text-accent text-xs">
                                {p.ratio >= 1 ? '+' : ''}{((p.ratio - 1) * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        ))}
                        {result.phases.length > 1 && (
                          <div className="flex justify-between pt-1 border-t border-rule">
                            <span className="text-fg font-medium">Combined</span>
                            <span className="text-accent font-mono font-semibold">
                              {result.inflationRate >= 0 ? '+' : ''}{result.inflationRate.toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
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

            </div>
          )}

          {/* Historical CPI Chart — always visible */}
          <div className="mt-8">
            <CpiChart location={location} fromYear={fromYear} toYear={toYear} />
          </div>

          {/* City Comparison — always visible */}
          {Number.isFinite(parseFloat(amount)) && parseFloat(amount) > 0 && (
            <div className="mt-8">
              <CityComparisonTable
                amount={parseFloat(amount)}
                fromYear={fromYear}
                toYear={toYear}
                highlightId={location}
              />
            </div>
          )}

          {/* Category Breakdown — always visible */}
          {Number.isFinite(parseFloat(amount)) && parseFloat(amount) > 0 && (
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
                <h3 className="text-xl font-semibold text-accent mb-4">Data &amp; Coverage</h3>
                <p className="text-muted mb-4">
                  Official Consumer Price Index data covering <strong>1 national index, 4 census regions, 16 metropolitan areas,</strong> and <strong>7 spending categories</strong> (food, housing, apparel, transportation, medical, recreation, education).
                </p>
                <ul className="text-muted mb-4 list-disc list-inside space-y-2">
                  <li><strong>FRED</strong> — US National Average and category series</li>
                  <li><strong>BLS</strong> — Regional and metropolitan area series</li>
                </ul>
                <p className="text-muted">
                  All CPI values are cached in Postgres and refreshed monthly after BLS releases new figures (mid-month), so the page loads instantly without hitting the agency APIs on every request.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-accent mb-4">How the Math Works</h3>
                <p className="text-muted mb-4">
                  Each year-over-year ratio is computed separately and chained together:
                </p>
                <code className="block bg-elevated border border-rule px-3 py-2 rounded text-sm font-mono text-fg mb-4">
                  ratio = ∏ (CPI<sub>y</sub> / CPI<sub>y−1</sub>)
                </code>
                <p className="text-muted mb-4">
                  Chaining year-over-year is necessary because metro CPI series and the national index use different reference bases (e.g., 2017=100 vs. 1982–84=100). Dividing across those bases directly would produce a meaningless number.
                </p>
                <p className="text-muted">
                  When a metro is missing CPI for some years (several BLS metro series start in 1965, 1978, or even 2017), the calculator falls back to the regional series, then to the national series — year by year, picking the deepest tier that has both endpoints. Rows that used fallback are marked with <span className="font-mono text-fg">*</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
