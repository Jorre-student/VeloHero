'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getDistance } from '@/helpers/get-distance';
import StationItem from '@/components/StationItem';
import useNetwork from '@/data/network';
import styles from './page.module.css';

export default function StationsPage() {
  // 1) State & data‐hook
  const [mode, setMode]     = useState('ophalen');  // 'ophalen' of 'afzetten'
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('xp');       // 'xp' of 'distance'
  const { stations, userLocation, isLoading, isError } = useNetwork();

  // 2) Verrijk met bezettings%, XP en afstand
  const enriched = useMemo(() => {
    return stations.map((s) => {
      const total    = s.bikes + s.free;
      const occupied = (s.bikes / total) * 100;       // % bezet

      let xp = 0;
      if (mode === 'ophalen') {
        if (occupied >= 60) {
          xp = ((occupied - 60) / 40) * 100;
        }
      } else {
        if (occupied <= 40) {
          xp = ((40 - occupied) / 40) * 100;
        }
      }
      xp = Math.max(0, Math.min(100, Math.round(xp)));

      const { distance: distMeters } = getDistance(
        userLocation.lat,
        userLocation.lng,
        s.coords.lat,
        s.coords.lng
      );
      const distanceLabel =
        distMeters < 1000
          ? `${distMeters} m`
          : `${(distMeters / 1000).toFixed(1)} km`;

      return {
        ...s,
        occupied,
        xp,
        distanceValue: distMeters,
        distanceLabel,
      };
    });
  }, [stations, userLocation, mode]);

// 3) Bepaal dichtsbijzijnde station *onder de XP-kandidaten*
const nearestId = useMemo(() => {
  // 3a) Bekijken welke stations xp>0 hebben (mode-specifiek)
  const candidates = enriched.filter((s) => s.xp > 0);
  if (candidates.length === 0) return null;

  // 3b) Reduce op afstand
  const nearest = candidates.reduce((best, s) => {
    if (!best || s.distanceValue < best.distanceValue) return s;
    return best;
  }, null);

  return nearest.id;
}, [enriched]);


  // 4) Filter & sort
  const filtered = useMemo(() => {
    return enriched
      .filter((s) => s.xp > 0 && s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortBy === 'distance'
          ? a.distanceValue - b.distanceValue
          : b.xp - a.xp
      );
  }, [enriched, search, sortBy]);

  // 5) Loading / Error
  if (isLoading) return <div className={styles.message}>Even laden…</div>;
  if (isError)   return <div className={styles.message}>Fout bij laden stations</div>;

  // 6) Render
  return (
    <main className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>← Home</Link>
        <h1 className={styles.heading}>Alle stations</h1>
      </div>

      {/* Mode‐switch */}
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
        {filtered.map((s) => {
          // bouw tags-array
          const tags = [];
          if (s.free <= 2) tags.push('Overvol');
          if (s.bikes <= 2) tags.push('Te leeg');
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
              total={s.bikes + s.free}
              status={mode}
              tags={tags}
            />
          );
        })}
      </div>
    </main>
  );
}
