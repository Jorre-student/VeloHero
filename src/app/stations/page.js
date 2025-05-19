// File: src/app/stations/page.js
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getDistance } from '@/helpers/get-distance';
import StationItem from '@/components/StationItem';
import useNetwork from '@/data/network';
import styles from './page.module.css';

export default function StationsPage() {
  // 1) State en hooks
  const [mode, setMode] = useState('ophalen');       // 'ophalen' of 'afzetten'
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('xp');        // 'xp' of 'distance'
  const { stations, userLocation, isLoading, isError } = useNetwork();

  // 2) Verrijk stations met bezetting, XP en afstand
  const enriched = useMemo(() => {
    return stations.map((s) => {
      const total = s.bikes + s.free;
      const occupied = (s.bikes / total) * 100; // bezettings%

      let xp = 0;
      if (mode === 'ophalen') {
        // alleen stations ≥ 60% bezet komen in aanmerking
        if (occupied >= 60) {
          xp = ((occupied - 60) / 40) * 100;
        }
      } else {
        // afzetten: alleen stations ≤ 40% bezet
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
        occupied,            // percentage
        xp,                  // 0–100
        distanceValue: distMeters,
        distanceLabel,
      };
    });
  }, [stations, userLocation, mode]);

  // 3) Bepaal voor deze mode het “beste” station
  const nearestId = useMemo(() => {
    if (enriched.length === 0) return null;

    // Filter op XP>0, kies hoogste XP (en tie‐breaker via afstand)
    const candidates = enriched.filter((s) => s.xp > 0);
    if (candidates.length === 0) return null;

    const best = candidates.reduce((bestSoFar, s) => {
      if (!bestSoFar) return s;
      if (s.xp > bestSoFar.xp) return s;
      if (s.xp === bestSoFar.xp && s.distanceValue < bestSoFar.distanceValue) {
        return s;
      }
      return bestSoFar;
    }, null);

    return best?.id ?? null;
  }, [enriched]);

  // 4) Filter en sorteer
  const filtered = useMemo(() => {
    return enriched
      .filter((s) => s.xp > 0 && s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortBy === 'distance'
          ? a.distanceValue - b.distanceValue
          : b.xp - a.xp
      );
  }, [enriched, search, sortBy]);

  // 5) Loading/Error
  if (isLoading) {
    return <div className={styles.message}>Even laden…</div>;
  }
  if (isError) {
    return <div className={styles.message}>Fout bij laden stations</div>;
  }

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
            total={s.bikes + s.free}
            status={s.status}
            tag={
              s.id === nearestId
                ? mode === 'ophalen'
                  ? 'Dichtste bij'
                  : 'Rustigste'
                : undefined
            }
          />
        ))}
      </div>
    </main>
  );
}
