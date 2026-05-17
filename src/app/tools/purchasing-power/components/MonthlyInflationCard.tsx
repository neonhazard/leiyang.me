'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  yoyRate: number;
  latestDate: string;
  previousDate: string;
  recentMonths: Array<{ year: number; month: number; value: number }>;
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

  return (
    <div className="bg-surface border border-rule p-4 flex items-center justify-between gap-6 mb-6">
      <div>
        <p className="text-muted text-xs uppercase tracking-wide">Latest 12-month inflation</p>
        <p className="text-3xl font-bold text-fg mt-1">
          {data.yoyRate >= 0 ? '+' : ''}{data.yoyRate.toFixed(2)}%
        </p>
        <p className="text-muted text-xs mt-1">
          {data.previousDate} → {data.latestDate} (US National Average)
        </p>
      </div>
      <div style={{ width: 140, height: 56 }}>
        <ResponsiveContainer>
          <LineChart data={data.recentMonths}>
            <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
