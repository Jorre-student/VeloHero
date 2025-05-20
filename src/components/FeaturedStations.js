'use client';

import React from 'react';
import StationItem from '@/components/StationItem';
import { getDistance } from '@/helpers/get-distance';
import styles from './FeaturedStations.module.css';

export default function FeaturedStations({
  stations = [],
  userLocation = { lat: 0, lng: 0 },
  mode = 'ophalen',    // 'ophalen' of 'afzetten'
  threshold = 1000,    // afstand in meters voor “dichtbij”
}) {
  if (!stations) return <div>Even laden…</div>;
  if (stations.length === 0) return <div>Geen stations gevonden</div>;

  const fmt = (m) =>
    typeof m === 'number' && !isNaN(m)
      ? m < 1000
        ? `${m} m`
        : `${(m / 1000).toFixed(1)} km`
      : '–';

  // 1) Dichtsbijzijnde station
  const nearest = stations.reduce((best, s) => {
    const { distance } = getDistance(
      userLocation.lat,
      userLocation.lng,
      s.coords.lat,
      s.coords.lng
    );
    return !best || distance < best.distanceValue
      ? { ...s, distanceValue: distance, distance: fmt(distance) }
      : best;
  }, null);

  // 2) Station met minste vrije slots
  const minFree = Math.min(...stations.map((s) => s.free));
  const least = stations
    .filter((s) => s.free === minFree)
    .map((s) => {
      const { distance } = getDistance(
        userLocation.lat,
        userLocation.lng,
        s.coords.lat,
        s.coords.lng
      );
      return { ...s, distanceValue: distance, distance: fmt(distance) };
    })
    .sort((a, b) => a.distanceValue - b.distanceValue)[0];

  // 3) Tags helper
  const makeTags = (s) => {
    const tags = [];
    if (s.free <= 2) tags.push('Overvol');
    if (s.bikes <= 2) tags.push('Te leeg');
    tags.push('Dichtste bij');
    return tags;
  };

  return (
    <section className={styles.container}>
      {/* Dichtsbijzijnde */}
      <div className={styles.sectionWrapper}>
        <h2 className={styles.heading}>Dichtsbijzijnde station</h2>
        {nearest && (
          <StationItem
            id={nearest.id}
            name={nearest.name}
            coords={nearest.coords}
            distance={nearest.distance}
            distanceValue={nearest.distanceValue}
            xp={nearest.xp}
            bikes={nearest.bikes}
            total={nearest.total}
            mode={mode}
            tags={makeTags(nearest)}
            threshold={threshold}
          />
        )}
      </div>

      {/* Minste vrije slots */}
      <div className={styles.sectionWrapper}>
        <h2 className={styles.heading}>Minste vrije slots</h2>
        {least && (
          <StationItem
            id={least.id}
            name={least.name}
            coords={least.coords}
            distance={least.distance}
            distanceValue={least.distanceValue}
            xp={least.xp}
            bikes={least.bikes}
            total={least.total}
            mode={mode}
            tags={makeTags(least)}
            threshold={threshold}
          />
        )}
      </div>
    </section>
  );
}
