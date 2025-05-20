'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './StationItem.module.css';

export default function StationItem({
  id,
  name,
  coords,
  distance,       // bv. "850 m" of "1.2 km"
  distanceValue,  // bv. 850  (in meters)
  xp,
  bikes,
  total,
  mode = 'ophalen',   // 'ophalen' of 'afzetten'
  tags = [],          // array met badges
  threshold = 1000,   // afstand in meters voor “dichtbij”
}) {
  const router = useRouter();

  // bepalen of we “dichtbij genoeg” zijn
  const isNearby = 
    typeof distanceValue === 'number' && 
    distanceValue <= threshold;

  // knoptekst: Ophalen of Afzetten als dichtbij, anders Route
  const startLabel  = mode === 'ophalen' ? 'Ophalen' : 'Afzetten';
  const buttonLabel = isNearby ? startLabel : 'Route';

  useEffect(() => {
    console.log(
      `[StationItem] ${name} – ${distanceValue}m → ${buttonLabel}`
    );
  }, [name, distanceValue, buttonLabel]);

  const handleClick = () => {
    if (isNearby) {
      // start-flow: neem de mode en xp mee in de URL
      router.push(`/start/${id}?mode=${mode}&xp=${xp}`);
    } else {
      // route via Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      {/* 🏷️ Badges */}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((t) => {
            let cls;
            if (t === 'Overvol')      cls = styles.tagOver;
            else if (t === 'Te leeg') cls = styles.tagEmpty;
            else                       cls = styles.tagNearest;
            return (
              <span key={t} className={cls}>
                {t}
              </span>
            );
          })}
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
