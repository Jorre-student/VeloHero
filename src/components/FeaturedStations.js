'use client';
import React from 'react';
import StationItem from '@/components/StationItem';
import { getDistance } from '@/helpers/get-distance';
import styles from './FeaturedStations.module.css';

export default function FeaturedStations({ stations, userLocation }) {
  if (!stations) {
    return <div>Even laden…</div>;
  }
  if (stations.length === 0) {
    return <div>Geen stations gevonden</div>;
  }

  // Bepaal dichtsbijzijnde station
  const nearestStation = stations.reduce((nearest, station) => {
    const dist = getDistance(userLocation, station.coords);
    if (!nearest || dist < nearest.distanceValue) {
      return { ...station, distanceValue: dist };
    }
    return nearest;
  }, null);

  // Bepaal station met minste vrije slots + tie-breaker afstand
  const minFree = Math.min(...stations.map((s) => s.free));
  const leastSlotsStation = stations
    .filter((s) => s.free === minFree)
    .map((s) => ({ ...s, distanceValue: getDistance(userLocation, s.coords) }))
    .sort((a, b) => a.distanceValue - b.distanceValue)[0];

  return (
    <section className="space-y-6">
      <h2>Dichtsbijzijnde station</h2>
      <StationItem {...nearestStation} />

      <h2>Minste vrije slots</h2>
      <StationItem {...leastSlotsStation} />
    </section>
  );
}
