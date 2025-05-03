// File: src/components/FeaturedStations.js
'use client';
import React from 'react';
import StationItem from '@/components/StationItem';
import { getDistance } from '@/helpers/get-distance';
import styles from './FeaturedStations.module.css';

export default function FeaturedStations({
  stations = [],
  userLocation = { lat: 0, lng: 0 },
}) {
  // 0️⃣ Fallbacks
  if (stations === undefined) {
    return <div>Even laden…</div>;
  }
  if (stations.length === 0) {
    return <div>Geen stations gevonden</div>;
  }

  // Helper: meters naar leesbare string
  const formatDist = (meters) => {
    if (typeof meters !== 'number' || isNaN(meters)) return '–';
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // 1️⃣ Bereken het dichtsbijzijnde station
  const nearestStation = stations.reduce((best, station) => {
    const { distance } = getDistance(
      userLocation.lat,
      userLocation.lng,
      station.coords.lat,
      station.coords.lng
    );
    if (!best || distance < best.distanceValue) {
      return {
        ...station,
        distanceValue: distance,
        distance: formatDist(distance),
      };
    }
    return best;
  }, null);

  // 2️⃣ Bereken station met minste vrije slots (en tie-breaker op afstand)
  const minFree = Math.min(...stations.map((s) => s.free));
  const leastSlotsStation = stations
    .filter((s) => s.free === minFree)
    .map((station) => {
      const { distance } = getDistance(
        userLocation.lat,
        userLocation.lng,
        station.coords.lat,
        station.coords.lng
      );
      return {
        ...station,
        distanceValue: distance,
        distance: formatDist(distance),
      };
    })
    .sort((a, b) => a.distanceValue - b.distanceValue)[0];

  // 3️⃣ Render beide secties
  return (
    <section className={styles.container}>
      <div className={styles.sectionWrapper}>
        <h2 className={styles.heading}>Dichtsbijzijnde station</h2>
        <StationItem {...nearestStation} />
      </div>
      <div className={styles.sectionWrapper}>
        <h2 className={styles.heading}>Minste vrije slots</h2>
        <StationItem {...leastSlotsStation} />
      </div>
    </section>
  );
}
