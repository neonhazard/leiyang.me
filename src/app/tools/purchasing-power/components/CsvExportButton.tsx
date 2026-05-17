'use client';

import { useState } from 'react';

interface Props {
  location: string;
  fromYear: number;
  toYear: number;
  amount: number;
}

interface SeriesPoint { year: number; value: number; }

export default function CsvExportButton({ location, fromYear, toYear, amount }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/purchasing-power/series?location=${encodeURIComponent(location)}&from=${fromYear}&to=${toYear}`);
      const json = await res.json() as { data?: SeriesPoint[] };
      const points = json.data ?? [];
      if (points.length === 0) return;
      const baseCpi = points[0].value;
      const header = 'year,cpi,equivalent_amount\n';
      const rows = points.map(p => {
        const equiv = (amount * (p.value / baseCpi)).toFixed(2);
        return `${p.year},${p.value.toFixed(3)},${equiv}`;
      }).join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cpi-${location}-${fromYear}-${toYear}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="text-sm text-accent hover:underline disabled:opacity-50"
    >
      {loading ? 'Preparing…' : '↓ Download CSV'}
    </button>
  );
}
