'use client';

import React from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import FeaturedStations from '@/components/FeaturedStations';
import useNetwork from '@/data/network';
import styles from './page.module.css';

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
    return <div className="text-center mt-8">Even laden…</div>;
  }
  if (isError) {
    return <div className="text-center mt-8">Fout bij laden data</div>;
  }

  return (
    <main className={styles.container}>
      {/* 1) StatsCard */}
      <StatsCard {...stats} />

      {/* 2) FeaturedStations */}
      <FeaturedStations
        stations={stations}
        userLocation={userLocation}
      />

      {/* 3) Ontdek alle stations button */}
      <div className="mt-6">
        <Link href="/stations">
        <button className={styles.discoverButton}>
  📍 Ontdek alle stations
</button>

        </Link>
      </div>
    </main>
  );
}
