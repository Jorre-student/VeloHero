'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, ArrowDownUp, Search } from 'lucide-react';
import StationItem from '@/components/StationItem';
import useNetwork from '@/data/network';
import { getDistance } from '@/helpers/get-distance';
import styles from './page.module.css';

export default function SuccessPage() {
  const { stationId } = useParams();
  const router = useRouter();
  const { stations, userLocation, isLoading, isError } = useNetwork();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('xp');

  // 1) Verrijk met distance & label
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
      return { ...s, distance, distanceLabel };
    });
  }, [stations, userLocation]);

  // 2) Bepaal emptiest station voor tag "Leeg"
  const emptiest = useMemo(() => {
    if (enriched.length === 0) return null;
    const maxFree = Math.max(...enriched.map((s) => s.free));
    return enriched.find((s) => s.free === maxFree);
  }, [enriched]);

  // 3) Bepaal nearest station voor tag "Dichtste bij"
  const nearest = useMemo(() => {
    if (enriched.length === 0) return null;
    return enriched.reduce(
      (best, s) => (!best || s.distance < best.distance ? s : best),
      null
    );
  }, [enriched]);

  // 4) Filter & sort
  const filtered = useMemo(() => {
    return enriched
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortBy === 'xp' ? b.xp - a.xp : a.distance - b.distance
      );
  }, [enriched, search, sortBy]);

  if (isLoading) return <div className={styles.message}>Even laden…</div>;
  if (isError) return <div className={styles.message}>Fout bij laden stations</div>;

  return (
    <main className={styles.container}>
      {/* Header met Annuleren */}
      <div className={styles.header}>
        <button
          onClick={() => router.back()}
          className={styles.cancelButton}
        >
          <X size={16} />
          Annuleren
        </button>
      </div>

      {/* Intro-tekst */}
      <p className={styles.intro}>
        Zoek een rustig station om de fiets naartoe te brengen!
      </p>

      {/* Zoek & Sorteer controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Zoek een locatie"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />
        </div>
        <button
          className={`${styles.sortButton} ${
            sortBy === 'xp' ? styles.active : ''
          }`}
          onClick={() => setSortBy('xp')}
        >
          Meeste XP
        </button>
        <button
          className={`${styles.sortButton} ${
            sortBy === 'distance' ? styles.active : ''
          }`}
          onClick={() => setSortBy('distance')}
        >
          Afstand
        </button>
      </div>

      {/* Lijst van stations */}
      <div className={styles.list}>
        {filtered.map((s) => (
          <StationItem
            key={s.id}
            id={s.id}
            name={s.name}
            coords={s.coords}
            distance={s.distanceLabel}
            distanceValue={s.distance}
            xp={s.xp}
            bikes={s.bikes}
            total={s.total}
            status={s.status}
            tag={
              s.id === emptiest?.id
                ? 'Leeg'
                : s.id === nearest?.id
                ? 'Dichtste bij'
                : undefined
            }
          />
        ))}
      </div>
    </main>
  );
}
