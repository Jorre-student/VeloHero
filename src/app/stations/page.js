// File: src/app/stations/page.js
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getDistance } from '@/helpers/get-distance';
import StationItem from '@/components/StationItem';
import useNetwork from '@/data/network';
import styles from './page.module.css';

export default function StationsPage() {
  // 1) State & hooks
  const [mode, setMode] = useState('ophalen');          // 'ophalen' of 'afzetten'
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('xp');           // 'xp' of 'distance'
  const { stations, userLocation, isLoading, isError } = useNetwork();

  // 2) Verrijk alle stations met afstand en XP
  const enriched = useMemo(() => {
    return stations.map((s) => {
      const total       = s.free + s.bikes;
      const occupiedPct = (s.bikes / total) * 100;
      let xp = 0;

      if (mode === 'ophalen') {
        if (occupiedPct >= 60) {
          xp = ((occupiedPct - 60) / 40) * 100;
        }
      } else {
        if (occupiedPct <= 40) {
          xp = ((40 - occupiedPct) / 40) * 100;
        }
      }
      xp = Math.max(0, Math.min(100, Math.round(xp)));

      const { distance } = getDistance(
        userLocation.lat,
        userLocation.lng,
        s.coords.lat,
        s.coords.lng
      );
      const distanceLabel =
        distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(1)} km`;

      return {
        ...s,
        total,
        xp,
        distanceValue: distance,
        distanceLabel,
      };
    });
  }, [stations, userLocation, mode]);

  // 3) Filter en sorteer: alleen xp>0 en zoekterm
  const filtered = useMemo(() => {
    return enriched
      .filter((s) => s.xp > 0 && s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortBy === 'distance'
          ? a.distanceValue - b.distanceValue
          : b.xp - a.xp
      );
  }, [enriched, search, sortBy]);

  // 4) Bereken nearestId uit de gefilterde lijst
  const nearestId = useMemo(() => {
    if (filtered.length === 0) return null;
    return filtered.reduce((best, s) =>
      best.distanceValue < s.distanceValue ? best : s
    ).id;
  }, [filtered]);

  // 5) Loading / Error
  if (isLoading) return <div className={styles.message}>Even laden…</div>;
  if (isError)   return <div className={styles.message}>Fout bij laden stations</div>;

  // 6) Render
  return (
    <main className={styles.container}>

      {/* Header + mode switch */}
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

      {/* Stationslijst met tags */}
      <div className={styles.list}>
        {filtered.map((s) => {
          // bouw tags-array per station
          const tags = [];
          if (s.free <= 2)     tags.push('Overvol');
          if (s.bikes <= 2)    tags.push('Te leeg');
          if (s.id === nearestId) tags.push('Dichtste bij');

          return (
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
              tags={tags}
              threshold={1000}
            />
          );
        })}
      </div>
    </main>
  );
}
