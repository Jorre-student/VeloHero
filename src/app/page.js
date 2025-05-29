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
      <StatsCard
        level={level}
        xp={xp}
        xpToNext={xpToNext}
        bikesMoved={bikesMoved}
        stationsHelped={stationsHelped}
      />

      <FeaturedStations
        stations={stations}
        userLocation={userLocation}
        mode="ophalen"
        threshold={1000}
      />
      
      <div className={styles.discoverWrapper}>
        <Link href="/stations" className={styles.discoverButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" />
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" />
          </svg>
          <span>Ontdek alle stations</span>
        </Link>
      </div>
    </main>
  );
}
