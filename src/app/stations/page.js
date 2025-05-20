'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getDistance } from '@/helpers/get-distance';
import StationItem from '@/components/StationItem';
import useNetwork from '@/data/network';
import styles from './page.module.css';

export default function StationsPage() {
  // 1) state/hooks
  const [mode, setMode] = useState('ophalen');   // 'ophalen' of 'afzetten'
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('xp');    // 'xp' of 'distance'
  const { stations, userLocation, isLoading, isError } = useNetwork();

  // 2) verrijk stations met afstand en label
  const enriched = useMemo(() => {
    return stations.map((s) => {
      const { distance } = getDistance(
        userLocation.lat,
        userLocation.lng,
        s.coords.lat,
        s.coords.lng
      );
      const distanceLabel =
        distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(1)} km`;
      return { ...s, distanceValue: distance, distanceLabel };
    });
  }, [stations, userLocation]);

  // 3) bepaal dichtsbijzijnde station‐ID
  const nearestId = useMemo(() => {
    if (enriched.length === 0) return null;
    const nearest = enriched.reduce((prev, curr) =>
      prev.distanceValue < curr.distanceValue ? prev : curr
    );
    return nearest.id;
  }, [enriched]);

  // 4) filter & sort
  const filtered = useMemo(() => {
    return enriched
      .filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortBy === 'distance'
          ? a.distanceValue - b.distanceValue
          : b.xp - a.xp
      );
  }, [enriched, search, sortBy]);

  // 5) loading / error
  if (isLoading) return <div className={styles.message}>Even laden…</div>;
  if (isError)   return <div className={styles.message}>Fout bij laden</div>;

  // 6) render
  return (
    <main className={styles.container}>
      {/* Header + mode‐switch */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>← Home</Link>
        <h1 className={styles.heading}>Alle stations</h1>
      </div>
      <div className={styles.modeSwitch}>
        <button
          className={mode === 'ophalen' ? styles.active : ''}
          onClick={() => setMode('ophalen')}
        >
          Ophalen
        </button>
        <button
          className={mode === 'afzetten' ? styles.active : ''}
          onClick={() => setMode('afzetten')}
        >
          Afzetten
        </button>
      </div>

      {/* Search & Sort */}
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

      {/* Stationslijst */}
      <div className={styles.list}>
        {filtered.map((s) => (
          <StationItem
            key={s.id}
            id={s.id}
            name={s.name}
            coords={s.coords}
            distance={s.distanceLabel}
            distanceValue={s.distanceValue}
            xp={s.xp}
            bikes={s.bikes}
            total={s.total}
            mode={mode}
            tags={
              s.free <= 2
                ? ['Overvol']
                : s.id === nearestId
                ? ['Dichtste bij']
                : []
            }
            threshold={1000}
          />
        ))}
      </div>
    </main>
  );
}
