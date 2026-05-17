'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface Props {
  location: string;
  fromYear: number;
  toYear: number;
}

type Tier = 'national' | 'region' | 'metro';

interface TierSeries { label: string; seriesId: string; data: Array<{ year: number; value: number }> }
interface ApiResponse {
  id?: string;
  label?: string;
  error?: string;
  byTier?: Partial<Record<Tier, TierSeries>>;
}

interface ChartRow {
  year: number;
  metro: number | null;
  region: number | null;
  national: number | null;
}

const TIER_STYLE: Record<Tier, { stroke: string; dash?: string }> = {
  metro:    { stroke: 'var(--accent)' },
  region:   { stroke: '#f59e0b', dash: '6 4' },   // amber
  national: { stroke: '#94a3b8', dash: '3 4' },   // slate
};

export default function CpiChart({ location, fromYear, toYear }: Props) {
  const [byTier, setByTier] = useState<ApiResponse['byTier']>({});
  const [label, setLabel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `/api/purchasing-power/series?location=${encodeURIComponent(location)}&from=${fromYear}&to=${toYear}`;
    fetch(url)
      .then(r => r.json())
      .then((res: ApiResponse) => {
        if (cancelled) return;
        if (res.error) {
          setError(res.error);
          setByTier({});
        } else {
          setError(null);
          setByTier(res.byTier ?? {});
          setLabel(res.label ?? '');
        }
        setLoading(false);
      })
      .catch(e => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load chart');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [location, fromYear, toYear]);

  if (loading) return <div className="text-muted text-sm py-8 text-center">Loading chart…</div>;
  if (error) return <div className="text-muted text-sm py-8 text-center">Chart unavailable: {error}</div>;

  const tiersPresent: Tier[] = (['metro', 'region', 'national'] as const).filter(t => byTier?.[t]);
  if (tiersPresent.length === 0) return null;

  // Build a unified set of years covered by ANY tier, then for each year emit one
  // row with each tier's value (or null). Recharts plots each tier as its own
  // continuous line over the years where its value is non-null.
  const yearSet = new Set<number>();
  for (const t of tiersPresent) {
    for (const p of byTier![t]!.data) yearSet.add(p.year);
  }
  const years = [...yearSet].sort((a, b) => a - b);

  const tierMaps: Partial<Record<Tier, Map<number, number>>> = {};
  for (const t of tiersPresent) {
    tierMaps[t] = new Map(byTier![t]!.data.map(p => [p.year, p.value]));
  }

  const chartRows: ChartRow[] = years.map(year => ({
    year,
    metro:    tierMaps.metro?.get(year)    ?? null,
    region:   tierMaps.region?.get(year)   ?? null,
    national: tierMaps.national?.get(year) ?? null,
  }));

  const showLegend = tiersPresent.length > 1;

  return (
    <div className="bg-elevated border border-rule p-4">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-fg font-semibold">CPI History · {fromYear}–{toYear}</h3>
        <span className="text-muted text-xs">{label || location}</span>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartRows} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--rule)" strokeDasharray="2 4" />
            <XAxis dataKey="year" stroke="var(--muted)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} width={48} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--rule)', color: 'var(--fg)' }}
              labelStyle={{ color: 'var(--muted)' }}
              formatter={(v, name) => [typeof v === 'number' ? v.toFixed(2) : String(v), String(name)]}
            />
            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {(['metro', 'region', 'national'] as const).map(t =>
              byTier?.[t] ? (
                <Line
                  key={t}
                  type="monotone"
                  dataKey={t}
                  name={byTier[t]!.label}
                  stroke={TIER_STYLE[t].stroke}
                  strokeDasharray={TIER_STYLE[t].dash}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showLegend && (
        <p className="text-muted text-xs mt-2">
          Each tier uses its own CPI series with its own reference base — values aren&apos;t directly comparable across lines, only within a line.
        </p>
      )}
    </div>
  );
}
