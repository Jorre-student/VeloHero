// File: src/app/start/[stationId]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useNetwork from '@/data/network';
import fetcher from '@/data/_fetcher';
import styles from './page.module.css';

export default function StartPage() {
  const { stationId } = useParams();
  const router = useRouter();

  // 1️⃣ Countdown state
  const [secondsLeft, setSecondsLeft] = useState(60);

  // 2️⃣ Initial count vrije slots
  const [initialFree, setInitialFree] = useState(null);

  // 3️⃣ Debug-flag om removal te simuleren
  const [simulateRemoval, setSimulateRemoval] = useState(false);

  // 4️⃣ Haal stations uit je hook
  const { stations } = useNetwork();

  // 5️⃣ Countdown-effect
  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [secondsLeft]);

  // 6️⃣ Sla initialFree op als stations geladen zijn
  useEffect(() => {
    if (initialFree === null && stations.length > 0) {
      const st = stations.find((s) => s.id === stationId);
      if (st) {
        setInitialFree(st.free);
        console.log(`🚩 initialFree voor ${stationId}:`, st.free);
      }
    }
  }, [stations, stationId, initialFree]);

  // 7️⃣ Polling-effect, elke seconde free_bikes loggen en removal detecteren
  useEffect(() => {
    if (initialFree !== null && secondsLeft > 0) {
      const intervalId = setInterval(async () => {
        try {
          const data = await fetcher(
            'https://api.citybik.es/v2/networks/velo-antwerpen'
          );
          const st = data.network.stations.find((s) => s.id === stationId);
          if (st) {
            // 🔍 Log het actuele aantal fietsen (free_bikes)
            console.log(`[Polling] huidige free_bikes voor ${stationId}:`, st.free_bikes);

            // ▶️ Simulatie
            if (simulateRemoval) {
              clearInterval(intervalId);
              console.log('✅ Simulated removal!');
              router.push(`/success/${stationId}`);
              return;
            }

            // ✅ Detectie echte removal
            if (st.empty_slots < initialFree) {
              console.log('✅ Fietsremoval gedetecteerd!');
              clearInterval(intervalId);
              setSecondsLeft(0);
              router.push(`/success/${stationId}`);
            }
          }
        } catch (err) {
          console.error('Polling fout:', err);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [initialFree, secondsLeft, stationId, router, simulateRemoval]);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Station {stationId}</h1>
      <p>Neem een fiets binnen de tijd</p>

      <div className={styles.timer}>{secondsLeft} s</div>

      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => router.back()}
        >
          Annuleren
        </button>

        <button
          type="button"
          className={styles.simulateButton}
          onClick={() => setSimulateRemoval(true)}
        >
          Simuleer weghalen
        </button>
      </div>
    </main>
  );
}
