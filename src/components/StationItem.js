// File: src/components/StationItem.js
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './StationItem.module.css';

export default function StationItem({
  id,
  name,
  coords,           // { lat, lng }
  distance,         // string “350 m” of “1.2 km”
  distanceValue,    // nummer in meters
  xp,
  bikes,
  total,
  status,
  tag,
}) {
  const router = useRouter();

  // bepaal of we “Starten” (dichtbij) of “Route” tonen
  const isNearby = typeof distanceValue === 'number' && distanceValue < 100;
  const buttonLabel = isNearby ? 'Starten' : 'Route';

  // debug-logging
  useEffect(() => {
    console.log(
      `[StationItem] ${name} → distanceValue: ${distanceValue}m, label: ${buttonLabel}`
    );
  }, [name, distanceValue, buttonLabel]);

  const handleClick = () => {
    if (isNearby) {
      // interne navigatie naar onze Start-flow
      router.push(`/start/${id}`);
    } else {
      // open Google Maps met destination=coords
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      {tag && (
        <div className={tag === 'Overvol' ? styles.tagOver : styles.tagNearest}>
          {tag}
        </div>
      )}

      <div className={styles.info}>
        <div className={styles.title}>{name}</div>
        <div className={styles.distance}>{distance}</div>
      </div>

      <div className={styles.availability}>
        {bikes} / {total}
      </div>

      <div className={styles.info}>
        <div className={xp === 0 ? styles.xpZero : styles.xp}>{xp} XP</div>
        <button
          type="button"
          onClick={handleClick}
          className={styles.button}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
