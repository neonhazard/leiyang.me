'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatting';

interface CategoryRow {
  id: string;
  label: string;
  equivalentAmount: number | null;
  inflationRate: number | null;
  latestYoY: number | null;
}

interface Props {
  amount: number;
  fromYear: number;
  toYear: number;
}

export default function CategoryBreakdown({ amount, fromYear, toYear }: Props) {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const url = `/api/purchasing-power/categories?amount=${amount}&fromYear=${fromYear}&toYear=${toYear}`;
    fetch(url)
      .then(r => r.json())
      .then((res: { categories?: CategoryRow[] }) => {
        if (cancelled) return;
        setRows(res.categories ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [amount, fromYear, toYear]);

  if (loading) return <div className="text-muted text-sm py-6 text-center">Loading categories…</div>;
  if (rows.length === 0) return null;

  const sorted = [...rows].sort((a, b) => (b.inflationRate ?? -Infinity) - (a.inflationRate ?? -Infinity));

  return (
    <div className="bg-surface border border-rule p-6">
      <h3 className="text-xl font-semibold text-fg mb-1">
        Category Breakdown <span className="text-muted text-sm font-normal">· US National</span>
      </h3>
      <p className="text-muted text-sm mb-4">
        How {formatCurrency(amount)} from {fromYear} translates by spending category in {toYear}.
        Categories use national CPI series — independent of the city above, since BLS only publishes category breakdowns at the national level.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule text-muted text-left">
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 px-4 font-medium text-right">Equivalent in {toYear}</th>
              <th className="py-2 px-4 font-medium text-right">Total Inflation</th>
              <th className="py-2 pl-4 font-medium text-right">Latest YoY</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => (
              <tr key={r.id} className="border-b border-rule/40">
                <td className="py-2 pr-4 text-fg">{r.label}</td>
                <td className="py-2 px-4 text-right text-fg font-mono">
                  {r.equivalentAmount != null ? formatCurrency(r.equivalentAmount) : '—'}
                </td>
                <td className="py-2 px-4 text-right text-accent font-mono">
                  {r.inflationRate != null ? `${r.inflationRate >= 0 ? '+' : ''}${r.inflationRate.toFixed(1)}%` : '—'}
                </td>
                <td className="py-2 pl-4 text-right text-muted font-mono">
                  {r.latestYoY != null ? `${r.latestYoY >= 0 ? '+' : ''}${r.latestYoY.toFixed(2)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted text-xs mt-3">Some categories (Education, Recreation) only have data from 1993 onward.</p>
    </div>
  );
}
