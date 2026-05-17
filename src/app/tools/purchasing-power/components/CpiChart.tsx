'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea, CartesianGrid } from 'recharts';

interface Props {
  location: string;
  fromYear: number;
  toYear: number;
}

interface SeriesPoint { year: number; value: number; }

export default function CpiChart({ location, fromYear, toYear }: Props) {
  const [data, setData] = useState<SeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/purchasing-power/series?location=${encodeURIComponent(location)}`)
      .then(r => r.json())
      .then((res: { data?: SeriesPoint[]; error?: string }) => {
        if (cancelled) return;
        if (res.error) {
          setError(res.error);
          setData([]);
        } else {
          setError(null);
          setData(res.data ?? []);
        }
        setLoading(false);
      })
      .catch(e => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load chart');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [location]);

  if (loading) return <div className="text-muted text-sm py-8 text-center">Loading chart…</div>;
  if (error) return <div className="text-muted text-sm py-8 text-center">Chart unavailable: {error}</div>;
  if (data.length === 0) return null;

  return (
    <div className="bg-elevated border border-rule p-4">
      <h3 className="text-fg font-semibold mb-3">CPI History</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--rule)" strokeDasharray="2 4" />
            <XAxis dataKey="year" stroke="var(--muted)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} width={48} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--rule)', color: 'var(--fg)' }}
              labelStyle={{ color: 'var(--muted)' }}
              formatter={(v) => [typeof v === 'number' ? v.toFixed(2) : String(v), 'CPI']}
            />
            <ReferenceArea x1={fromYear} x2={toYear} fill="var(--accent)" fillOpacity={0.12} />
            <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
