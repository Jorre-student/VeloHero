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
}) {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.status}>
          {status === 'open' ? '★ dichtbij' : '⚠️ vol'}
        </div>
        <div className={styles.title}>{name}</div>
        <div className={styles.distance}>{distance}</div>
      </div>
      <div className={styles.availability}>
        {bikes}/{total}
      </div>
      <div className={styles.info}>
        <div className={styles.xp}>{xp} XP</div>
        <button className={styles.button}>
          {status === 'open' ? 'Start' : 'Route'}
        </button>
      </div>
    </div>
  );
}
