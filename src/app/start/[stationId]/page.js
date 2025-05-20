'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useNetwork from '@/data/network';
import fetcher from '@/data/_fetcher';
import styles from './page.module.css';

export default function StartPage() {
  const { stationId } = useParams();
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Mode & berekende XP uit de URL
  const mode    = searchParams.get('mode') === 'afzetten' ? 'afzetten' : 'ophalen';
  const gainedXp = Number(searchParams.get('xp')) || 0;

  // States
  const [secondsLeft, setSecondsLeft]   = useState(60);
  const [initialBikes, setInitialBikes] = useState(null);
  const [status, setStatus]             = useState('pending'); 
  // 'pending' | 'success' | 'failure'

  // Haal alle stations uit de hook
  const { stations } = useNetwork();

  // Zoek huidig station
  const currentStation = useMemo(
    () => stations.find((s) => s.id === stationId),
    [stations, stationId]
  );
  const stationName = currentStation?.name ?? stationId;

  // Sla initiële bike-count op
  useEffect(() => {
    if (currentStation && initialBikes === null) {
      setInitialBikes(currentStation.bikes);
    }
  }, [currentStation, initialBikes]);

  // Countdown‐effect
  useEffect(() => {
    if (status !== 'pending') return;
    if (secondsLeft <= 0) {
      setStatus('failure');
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, status]);

  // Polling: detecteer bike-count verandering
  useEffect(() => {
    if (status !== 'pending' || initialBikes === null) return;
    const iv = setInterval(async () => {
      try {
        const data = await fetcher(
          'https://api.citybik.es/v2/networks/velo-antwerpen'
        );
        const st = data.network.stations.find((s) => s.id === stationId);
        if (!st) return;

        if (mode === 'ophalen' && st.bikes < initialBikes) {
          clearInterval(iv);
          setStatus('success');
        }
        if (mode === 'afzetten' && st.bikes > initialBikes) {
          clearInterval(iv);
          setStatus('success');
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [initialBikes, stationId, status, mode]);

  // SVG‐progress berekenen
  const { circumference, progressOffset } = useMemo(() => {
    const radius = 45;
    const c = 2 * Math.PI * radius;
    const pct = (60 - secondsLeft) / 60;
    return { circumference: c, progressOffset: pct * c };
  }, [secondsLeft]);

  // === RENDER ===
  if (status === 'pending') {
    return (
      <main className={styles.container}>
        <h1 className={styles.heading}>{stationName}</h1>
        <p className={styles.subheading}>
          {mode === 'ophalen'
            ? 'Neem een fiets binnen de tijd'
            : 'Plaats een fiets binnen de tijd'}
        </p>

        <div className={styles.timerWrapper}>
          <svg className={styles.circle} viewBox="0 0 100 100">
            <circle className={styles.circleBg} cx="50" cy="50" r="45" />
            <circle
              className={styles.circleFg}
              cx="50"
              cy="50"
              r="45"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
            />
          </svg>
          <div className={styles.timerText}>{secondsLeft} s</div>
        </div>

        {initialBikes !== null && (
          <div className={styles.availabilitySmall}>
            {initialBikes}/{currentStation.bikes + currentStation.free}
          </div>
        )}

        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => router.back()}
        >
          Annuleren
        </button>
      </main>
    );
  }

  if (status === 'success') {
    return (
      <main className={styles.container}>
        <h1 className={styles.heading}>{stationName}</h1>
        <p className={styles.subheading}>
          {mode === 'ophalen'
            ? 'Je hebt een fiets binnen de tijd genomen'
            : 'Je hebt een fiets binnen de tijd geplaatst'}
        </p>
        <div className={styles.resultWrapper}>
          <div className={styles.checkCircle}>✔︎</div>
        </div>
        <button
          type="button"
          className={styles.claimButton}
          onClick={() => router.push('/')}
        >
          Ontvang {gainedXp} XP
        </button>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{stationName}</h1>
      <p className={styles.subheading}>
        Tijd verlopen!
      </p>
      <div className={styles.resultWrapper}>
        <div className={styles.crossCircle}>✕</div>
      </div>
      <button
        type="button"
        className={styles.claimButton}
        onClick={() => router.push('/')}
      >
        Opnieuw proberen
      </button>
    </main>
  );
}
