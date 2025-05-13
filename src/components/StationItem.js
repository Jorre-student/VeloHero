// File: src/components/StationItem.js
'use client';
import React, { useEffect } from 'react';
import styles from './StationItem.module.css';

export default function StationItem({
  name,
  distance,
  distanceValue,   // nummer in meters
  xp,
  bikes,
  total,
  tag,
}) {
  // haal de raw meters op uit props
  // Bepaal button label: starten als dichterbij dan 100 m
  const isNearby = typeof distanceValue === 'number' && distanceValue < 100;
  const buttonLabel = isNearby ? 'Starten' : 'Route';

  // Logging van elke stap
  useEffect(() => {
    console.log(
      `[StationItem] ${name} → distanceValue: ${distanceValue}m, ` +
      `label: ${buttonLabel}`
    );
  }, [name, distanceValue, buttonLabel]);

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
        <button className={styles.button}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
