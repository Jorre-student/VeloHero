// File: src/app/stations/page.js
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getDistance } from '@/helpers/get-distance';
import StationItem from '@/components/StationItem';
import useNetwork from '@/data/network';
import styles from './page.module.css';

export default function StationsPage() {
  const { stations, userLocation, isLoading, isError } = useNetwork();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('xp');

  // Hooks in vaste volgorde
  const enriched = useMemo(
    () => stations.map((s) => {
      const { distance } = getDistance(
        userLocation.lat,
        userLocation.lng,
        s.coords.lat,
        s.coords.lng
      );
      const label = distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(1)} km`;
      return { ...s, distance, distanceLabel: label };
    }),
    [stations, userLocation]
  );

  const nearestId = useMemo(() => {
    const nearest = enriched.reduce((best, s) => (!best || s.distance < best.distance) ? s : best, null);
    return nearest?.id;
  }, [enriched]);

  const filtered = useMemo(
    () => enriched
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sortBy === 'xp' ? b.xp - a.xp : a.distance - b.distance),
    [enriched, search, sortBy]
  );

  if (isLoading) {
    return <div className={styles.message}>Even laden…</div>;
  }
  if (isError) {
    return <div className={styles.message}>Fout bij laden stations</div>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>← Home</Link>
        <h1 className={styles.heading}>Alle stations</h1>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Zoek een locatie"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <div className={styles.sort}>
          <button
            className={sortBy === 'xp' ? styles.active : ''}
            onClick={() => setSortBy('xp')}
          >
            Meeste XP
          </button>
          <button
            className={sortBy === 'distance' ? styles.active : ''}
            onClick={() => setSortBy('distance')}
          >
            Afstand
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.map((s) => (
          <StationItem
            key={s.id}
            name={s.name}
            distance={s.distanceLabel}
            xp={s.xp}
            bikes={s.bikes}
            total={s.total}
            status={s.status}
            tag={
              s.free <= 2 ? 'Overvol'
                : s.id === nearestId ? 'Dichtste bij'
                : undefined
            }
          />
        ))}
      </div>
    </main>
  );
}
