import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchasing Power Calculator",
  description:
    "Calculate how US dollar purchasing power has changed over time using official CPI data from FRED and BLS. Compare inflation by year, city, and spending category.",
  alternates: { canonical: "/tools/purchasing-power" },
};

export default function PurchasingPowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
