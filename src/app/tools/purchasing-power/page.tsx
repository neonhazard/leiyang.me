'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PURCHASING_POWER_METADATA } from '@/constants/purchasing-power';
import { formatNumberWithCommas, getNumericValue, formatCurrency, generateYearOptions } from '@/utils/formatting';
import { calculateSliderPosition, calculateRangeWidth } from '@/utils/slider';
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

export default function PurchasingPowerCalculator() {
  const [amount, setAmount] = useState<string>('10000');
  const [displayAmount, setDisplayAmount] = useState<string>('10,000');
  const [fromYear, setFromYear] = useState<number>(1990);
  const [toYear, setToYear] = useState<number>(new Date().getFullYear());
  const [location, setLocation] = useState<string>('US');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Use imported metadata
  const metadata = PURCHASING_POWER_METADATA;

  const [locationDateRange, setLocationDateRange] = useState<{min: number, max: number} | null>(null);

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    try {
      const numericValue = getNumericValue(value);
      setAmount(numericValue);
      setDisplayAmount(formatNumberWithCommas(value));
    } catch {
      // If formatting fails, just set the raw value
      setAmount(value);
      setDisplayAmount(value);
    }
  };

  // Update date range when location changes (use hardcoded metadata)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold text-white">Lei Yang</Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/resume" className="text-gray-300 hover:text-white transition-colors">
            Resume
          </Link>
          <Link href="/tools" className="text-purple-400 hover:text-white transition-colors">
            Tools & AI
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Purchasing Power <span className="text-purple-400">Calculator</span>
            </h1>
            <p className="text-xl text-gray-300">
              See how the value of money changes over time using official CPI data
            </p>
          </div>

          {/* Calculator Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Amount Input */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-12"
                  placeholder="Enter amount (e.g., 1,000,000)"
                />
              </div>

              {/* Location Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-12"
                >
                  {metadata.locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-slate-800">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Year Range with Slider - Full Width */}
            <div className="mt-6">
              <label className="block text-white font-semibold mb-2">
                Year Range
              </label>
              
              {/* Available Data Range Info */}
              {locationDateRange && (
                <p className="text-gray-400 text-sm mb-3">
                  Available data: {locationDateRange.min} - {locationDateRange.max}
                </p>
              )}
              
              {/* Visual Range Display */}
              <div className="relative mb-6">
                {(() => {
                  const minYear = locationDateRange?.min || 1913;
                  const maxYear = locationDateRange?.max || new Date().getFullYear();
                  const fromPosition = calculateSliderPosition(fromYear, minYear, maxYear);
                  const toPosition = calculateSliderPosition(toYear, minYear, maxYear);
                  const rangeWidth = calculateRangeWidth(fromYear, toYear, minYear, maxYear);
                  
                  return (
                    <div className="relative h-2 bg-gray-600 rounded-lg">
                      {/* Background track */}
                      <div className="absolute inset-0 h-2 bg-gray-600 rounded-lg"></div>
                      
                      {/* Active range track */}
                      <div 
                        className="absolute h-2 bg-purple-500 rounded-lg"
                        style={{
                          left: `${fromPosition}%`,
                          width: `${rangeWidth}%`
                        }}
                      />
                      
                      {/* From Year Handle */}
                      <div
                        className="absolute w-4 h-4 bg-purple-500 border-2 border-white rounded-full shadow-lg"
                        style={{
                          left: `${fromPosition}%`,
                          transform: 'translateX(-50%) translateY(-25%)',
                          top: '50%'
                        }}
                      />
                      
                      {/* To Year Handle */}
                      <div
                        className="absolute w-4 h-4 bg-purple-500 border-2 border-white rounded-full shadow-lg"
                        style={{
                          left: `${toPosition}%`,
                          transform: 'translateX(-50%) translateY(-25%)',
                          top: '50%'
                        }}
                      />
                    </div>
                  );
                })()}
                
                {/* Slider Labels */}
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{locationDateRange?.min || 1913}</span>
                  <span className="text-white font-semibold">
                    {fromYear} - {toYear}
                  </span>
                  <span>{locationDateRange?.max || new Date().getFullYear()}</span>
                </div>
              </div>
              
              {/* Year Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">From Year</label>
                  <select
                    value={fromYear}
                    onChange={(e) => {
                      const newFromYear = parseInt(e.target.value);
                      if (newFromYear <= toYear) {
                        setFromYear(newFromYear);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    {locationDateRange && generateYearOptions(locationDateRange.min, locationDateRange.max).map((year) => (
                      <option key={year} value={year} className="bg-slate-800">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-1">To Year</label>
                  <select
                    value={toYear}
                    onChange={(e) => {
                      const newToYear = parseInt(e.target.value);
                      if (newToYear >= fromYear) {
                        setToYear(newToYear);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    {locationDateRange && generateYearOptions(locationDateRange.min, locationDateRange.max).map((year) => (
                      <option key={year} value={year} className="bg-slate-800">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Selection Summary */}
              <div className="mt-3 text-center">
                <span className="text-gray-300 text-sm">
                  {toYear - fromYear} year{toYear - fromYear !== 1 ? 's' : ''} selected
                </span>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleCalculate}
                disabled={loading || !amount || !metadata}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Calculating...' : 'Calculate Purchasing Power'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Purchasing Power Results
              </h2>
              
              {/* Sample Data Notice */}
              {result.usingSampleData && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                  <p className="text-yellow-300 text-sm">
                    <strong>Demo Mode:</strong> Using sample CPI data. For real-time data, please add your FRED and BLS API keys to the environment variables.
                  </p>
                </div>
              )}

              {/* Fallback Data Notice */}
              {result.usingFallbackData && (
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
                  <p className="text-blue-300 text-sm">
                    <strong>Note:</strong> Regional CPI data for {metadata.locations.find(l => l.id === result.location)?.name} is not available for the selected years. 
                    Showing US National Average data instead.
                  </p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Main Result */}
                <div className="text-center">
                  <div className="bg-purple-600/30 rounded-lg p-6 mb-4">
                    <p className="text-gray-300 text-sm mb-2">
                      {formatCurrency(result.originalAmount)} in {result.originalYear}
                    </p>
                    <p className="text-4xl font-bold text-white mb-2">
                      {formatCurrency(result.equivalentAmount)}
                    </p>
                    <p className="text-gray-300 text-sm">
                      in {result.targetYear}
                    </p>
                  </div>
                  
                  <p className="text-lg text-purple-400 font-semibold">
                    {result.inflationRate > 0 ? '+' : ''}{result.inflationRate.toFixed(2)}% 
                    {result.inflationRate > 0 ? ' inflation' : ' deflation'}
                  </p>
                </div>

                {/* Detailed Information */}
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Location</h3>
                    <p className="text-gray-300">
                      {metadata.locations.find(l => l.id === result.location)?.name}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Data Source: {metadata.dataSources?.[result.location]}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">CPI Data</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">CPI {result.originalYear}</p>
                        <p className="text-white font-semibold">{result.cpiData.fromCPI}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">CPI {result.targetYear}</p>
                        <p className="text-white font-semibold">{result.cpiData.toCPI}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Available Data Range</h3>
         <p className="text-gray-300 text-sm">
           {locationDateRange ? 
             `Data available from ${locationDateRange.min} to ${locationDateRange.max}` :
             'Date range information not available'
           }
         </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Note: Date ranges may vary by location and data source
                    </p>
                  </div>
                </div>
              </div>

              {/* Fun Facts */}
              <div className="mt-8 bg-white/5 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">What this means:</h3>
                <p className="text-gray-300">
                  {result.inflationRate > 0 ? (
                    <>
                      Due to inflation, you would need <span className="text-purple-400 font-semibold">
                      {formatCurrency(result.equivalentAmount)}
                      </span> in {result.targetYear} to have the same purchasing power as{' '}
                      <span className="text-purple-400 font-semibold">
                      {formatCurrency(result.originalAmount)}
                      </span> in {result.originalYear}.
                    </>
                  ) : (
                    <>
                      Due to deflation, <span className="text-purple-400 font-semibold">
                      {formatCurrency(result.originalAmount)}
                      </span> in {result.originalYear} would only be worth{' '}
                      <span className="text-purple-400 font-semibold">
                      {formatCurrency(result.equivalentAmount)}
                      </span> in {result.targetYear}.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Information Section */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              About This Calculator
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Data Source</h3>
                <p className="text-gray-300 mb-4">
                  This calculator uses official Consumer Price Index (CPI) data from two authoritative sources:
                </p>
                <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                  <li><strong>Bureau of Labor Statistics (BLS)</strong> - For regional metropolitan area CPI data</li>
                  <li><strong>Federal Reserve Economic Data (FRED)</strong> - For US National Average CPI data</li>
                </ul>
                <p className="text-gray-300">
                  CPI measures the average change over time in the prices paid by urban consumers 
                  for a market basket of consumer goods and services.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">How It Works</h3>
                <p className="text-gray-300 mb-4">
                  The calculator uses the formula: <br />
                  <code className="bg-white/10 px-2 py-1 rounded text-sm">
                    Value in Year B = Value in Year A × (CPI Year B / CPI Year A)
                  </code>
                </p>
                <p className="text-gray-300">
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
