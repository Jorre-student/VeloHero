// File: src/components/StationItem.js
'use client';
import React from 'react';
import styles from './StationItem.module.css';

export default function StationItem({
  name,
  distance,
  xp,
  bikes,
  total,
  status,
  tag,
}) {
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
        <div className={styles.xp}>{xp} XP</div>
        <button className={styles.button}>
          {status === 'open' ? 'Starten' : 'Route'}
        </button>
      </div>
    </div>
  );
}
