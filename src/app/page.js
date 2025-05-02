// File: src/app/page.js
'use client';

import StatsCard from '@/components/StatsCard';
import FeaturedStations from '@/components/FeaturedStations';
import useNetwork from '@/data/network';

// Dummy data voor StatsCard
const stats = {
  level: 5,
  xp: 125,
  xpToNext: 250,
  bikesMoved: 32,
  stationsHelped: 6,
};

export default function Home() {
  const { stations, userLocation, isLoading, isError } = useNetwork();

  if (isLoading) {
    return <div>Even laden…</div>;
  }
  if (isError) {
    return <div>Fout bij laden data</div>;
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-6">
      {/* 1) StatsCard */}
      <StatsCard {...stats} />

      {/* 2) FeaturedStations */}
      <FeaturedStations stations={stations} userLocation={userLocation} />

      {/* 3) optioneel: volledige stationslijst */}
    </main>
  );
}
