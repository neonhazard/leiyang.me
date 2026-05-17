'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatting';

interface CityRow {
  id: string;
  label: string;
  equivalentAmount: number | null;
  inflationRate: number | null;
}

interface Props {
  amount: number;
  fromYear: number;
  toYear: number;
  highlightId?: string;
}

export default function CityComparisonTable({ amount, fromYear, toYear, highlightId }: Props) {
  const [rows, setRows] = useState<CityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const url = `/api/purchasing-power/cities?amount=${amount}&fromYear=${fromYear}&toYear=${toYear}`;
    fetch(url)
      .then(r => r.json())
      .then((res: { cities?: CityRow[] }) => {
        if (cancelled) return;
        setRows(res.cities ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [amount, fromYear, toYear]);

  if (loading) return <div className="text-muted text-sm py-6 text-center">Loading city comparison…</div>;
  if (rows.length === 0) return null;

  const usRow = rows.find(r => r.id === 'US');
  const metroRows = rows.filter(r => r.id !== 'US');
  const sortedMetros = metroRows.sort((a, b) => (b.inflationRate ?? -Infinity) - (a.inflationRate ?? -Infinity));
  const sorted = usRow ? [usRow, ...sortedMetros] : sortedMetros;

  return (
    <div className="bg-surface border border-rule p-6">
      <h3 className="text-xl font-semibold text-fg mb-1">City Comparison</h3>
      <p className="text-muted text-sm mb-4">
        {formatCurrency(amount)} from {fromYear} converted to {toYear} dollars across US metros
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule text-muted text-left">
              <th className="py-2 pr-4 font-medium">Location</th>
              <th className="py-2 px-4 font-medium text-right">Equivalent in {toYear}</th>
              <th className="py-2 pl-4 font-medium text-right">Total Inflation</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => (
              <tr
                key={r.id}
                className={`border-b ${r.id === 'US' ? 'border-rule bg-elevated/40' : 'border-rule/40'} ${r.id === highlightId ? 'bg-elevated' : ''}`}
              >
                <td className="py-2 pr-4 text-fg">
                  {r.label}
                  {r.id === 'US' && <span className="text-muted text-xs ml-2">(reference)</span>}
                  {r.id === highlightId && <span className="text-accent text-xs ml-2">(selected)</span>}
                </td>
                <td className="py-2 px-4 text-right text-fg font-mono">
                  {r.equivalentAmount != null ? formatCurrency(r.equivalentAmount) : '—'}
                </td>
                <td className="py-2 pl-4 text-right text-accent font-mono">
                  {r.inflationRate != null ? `${r.inflationRate >= 0 ? '+' : ''}${r.inflationRate.toFixed(1)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted text-xs mt-3">Em-dash means CPI for that year/city isn&apos;t in the dataset (regional series start in 1965 and some have gaps).</p>
    </div>
  );
}
