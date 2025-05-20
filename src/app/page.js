'use client';

import React from 'react';
import Link from 'next/link';
import useNetwork from '@/data/network';
import useProgress from '@/hooks/useProgress';
import StatsCard from '@/components/StatsCard';
import FeaturedStations from '@/components/FeaturedStations';
import styles from './page.module.css';

export default function Home() {
  // 1) Haal netwerk‐data
  const { stations, userLocation, isLoading, isError } = useNetwork();

  // 2) Haal voortgangs‐data
  const { level, xp, xpToNext, bikesMoved, stationsHelped } = useProgress();

  // 3) Loading/Error
  if (isLoading) return <div>Even laden…</div>;
  if (isError)   return <div>Fout bij laden gegevens</div>;

  // 4) Render
  return (
    <main className={styles.container}>
      {/* Stats-kaart */}
      <StatsCard
        level={level}
        xp={xp}
        xpToNext={xpToNext}
        bikesMoved={bikesMoved}
        stationsHelped={stationsHelped}
      />

      {/* FeaturedStations altijd in 'ophalen'-mode */}
      <FeaturedStations
        stations={stations}
        userLocation={userLocation}
        mode="ophalen"
        threshold={1000}  // of je gewenste afstand
      />

      {/* Ontdek-knop */}
      <div className={styles.discoverWrapper}>
        <Link href="/stations">
          <button className={styles.discoverButton}>
            📍 Ontdek alle stations
          </button>
        </Link>
      </div>
    </main>
  );
}
