// src/components/StatsCard.js
'use client';
import React from 'react';
import styles from './StatsCard.module.css';

export default function StatsCard({
  level,
  xp,
  xpToNext,
  bikesMoved,
  stationsHelped,
}) {
  const percent = Math.min(100, Math.round((xp / xpToNext) * 100));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.level}>{level}</div>
        <div className={styles.progressWrapper}>
          <div className={styles.progressText}>
            {xp} XP van {xpToNext}
          </div>
          <div className={styles.progressBar}>
            <div className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{bikesMoved}</div>
          <div className={styles.statLabel}>Fietsen verplaatst</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{stationsHelped}</div>
          <div className={styles.statLabel}>Stations geholpen</div>
        </div>
      </div>
    </div>
  );
}
