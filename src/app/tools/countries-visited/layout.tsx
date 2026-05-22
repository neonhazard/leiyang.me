import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countries Visited — Interactive World Map",
  description:
    "An interactive world map tracking countries visited, built by Lei Yang. Explore and visualize travel across the globe.",
  alternates: { canonical: "/tools/countries-visited" },
};

export default function CountriesVisitedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
