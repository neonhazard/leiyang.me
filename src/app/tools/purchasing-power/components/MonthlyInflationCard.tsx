'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

interface MonthlyData {
  yoyRate: number;
  latestDate: string;
  previousDate: string;
  yoySeries: Array<{ ym: string; rate: number }>;
  peakRate: number | null;
  peakDate: string | null;
  avgRate: number;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatYm(ym: string): string {
  const [y, m] = ym.split('-');
  const monthIdx = parseInt(m, 10) - 1;
  return `${MONTH_NAMES[monthIdx]} ${y}`;
}

export default function MonthlyInflationCard() {
  const [data, setData] = useState<MonthlyData | null>(null);

  useEffect(() => {
    fetch('/api/purchasing-power/monthly')
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  // Sparse X-axis ticks: one per January.
  const yearTicks = data.yoySeries
    .filter(p => p.ym.endsWith('-01'))
    .map(p => p.ym);

  return (
    <div className="bg-surface border border-rule p-5 mb-6">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
        <div>
          <p className="text-muted text-xs uppercase tracking-wide">Latest 12-month inflation</p>
          <p className="text-3xl font-bold text-fg mt-1">
            {data.yoyRate >= 0 ? '+' : ''}{data.yoyRate.toFixed(2)}%
          </p>
          <p className="text-muted text-xs mt-1">
            {data.previousDate} → {data.latestDate} (US National Average)
          </p>
        </div>
        {data.peakRate != null && data.peakDate && (
          <div className="text-right text-xs text-muted">
            <p>10-year peak: <span className="text-fg font-mono">{data.peakRate.toFixed(1)}%</span> ({formatYm(data.peakDate)})</p>
            <p className="mt-1">10-year average: <span className="text-fg font-mono">{data.avgRate.toFixed(1)}%</span></p>
            <p className="mt-1">Fed target: <span className="text-fg font-mono">2.0%</span></p>
          </div>
        )}
      </div>
      <div style={{ width: '100%', height: 140 }}>
        <ResponsiveContainer>
          <LineChart data={data.yoySeries} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="var(--rule)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="ym"
              stroke="var(--muted)"
              tick={{ fontSize: 10 }}
              ticks={yearTicks}
              tickFormatter={ym => ym.slice(0, 4)}
            />
            <YAxis
              stroke="var(--muted)"
              tick={{ fontSize: 10 }}
              width={32}
              tickFormatter={v => `${v}%`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--rule)', color: 'var(--fg)' }}
              labelStyle={{ color: 'var(--muted)' }}
              labelFormatter={(ym) => formatYm(String(ym))}
              formatter={(v) => [typeof v === 'number' ? `${v.toFixed(2)}%` : String(v), 'YoY inflation']}
            />
            <ReferenceLine y={2} stroke="var(--muted)" strokeDasharray="4 4" strokeOpacity={0.6} />
            <ReferenceLine y={0} stroke="var(--rule)" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
