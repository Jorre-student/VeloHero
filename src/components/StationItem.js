'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './StationItem.module.css';

export default function StationItem({
  id,
  name,
  coords,
  distance,
  distanceValue,
  xp,
  bikes,
  total,
  status,
  tags = [],    // nu een array van 0–3 strings
}) {
  const router = useRouter();
  const isNearby = status === 'ophalen'
    ? distanceValue < 1000
    : false;  // voor afzetten kun je later een andere drempel kiezen
  const buttonLabel = isNearby ? 'Starten' : 'Route';

  useEffect(() => {
    console.log(
      `[StationItem] ${name} → xp:${xp}, distance:${distanceValue}m, tags:${tags.join(',')}`
    );
  }, [name, xp, distanceValue, tags]);

  const handleClick = () => {
    if (isNearby) {
      router.push(`/start/${id}`);
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      {/* Render alle badges */}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((t) => {
            let cls;
            if (t === 'Overvol')      cls = styles.tagOver;
            else if (t === 'Te leeg') cls = styles.tagEmpty;
            else /* Dichtste bij */   cls = styles.tagNearest;
            return (
              <span key={t} className={cls}>
                {t}
              </span>
            );
          })}
        </div>
      )}

      {/* Rest van het kaartje */}
      <div className={styles.info}>
        <div className={styles.title}>{name}</div>
        <div className={styles.distance}>{distance}</div>
      </div>
      <div className={styles.availability}>
        {bikes} / {total}
      </div>
      <div className={styles.info}>
        <div className={xp === 0 ? styles.xpZero : styles.xp}>{xp} XP</div>
        <button type="button" onClick={handleClick} className={styles.button}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
