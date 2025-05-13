// src/components/StationItem.js
'use client';
import React, { useEffect } from 'react';
import styles from './StationItem.module.css';

export default function StationItem({
  name,
  coords,            // nieuw
  distance,
  distanceValue,     // nieuw
  xp,
  bikes,
  total,
  status,
  tag,
}) {
  // bepaal of we “Starten” (dichtbij) of “Route” tonen
  const isNearby = typeof distanceValue === 'number' && distanceValue < 100;
  const buttonLabel = isNearby ? 'Starten' : 'Route';

  // log elk station voor debug
  useEffect(() => {
    console.log(
      `[StationItem] ${name} → distanceValue: ${distanceValue}m, label: ${buttonLabel}`
    );
  }, [name, distanceValue, buttonLabel]);

  // click-handler
  const handleClick = () => {
    if (isNearby) {
      // TODO: start-flow (voor straks)
      console.log(`Start-flow voor ${name}`);
    } else {
      // open Google Maps in nieuw tabblad
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
