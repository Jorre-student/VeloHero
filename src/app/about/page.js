'use client';

import styles from './page.module.css';
import useNetwork from '@/data/network';

import StatsCard from '@/components/StatsCard';

// Dummy data voor StatsCard
const stats = {
  level: 5,
  xp: 125,
  xpToNext: 250,
  bikesMoved: 32,
  stationsHelped: 6,
};

export default function Home() {
  return (
    <main className="max-w-md mx-auto p-4">
      <StatsCard {...stats} />
      {/* later kun je hier nog StationItem-list zetten */}
    </main>
  );
}
