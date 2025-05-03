// File: src/app/stations/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import StationItem from '@/components/StationItem';
import useNetwork from '@/data/network';
import styles from './page.module.css';

export default function StationsPage() {
  const { stations, isLoading, isError } = useNetwork();

  if (isLoading) {
    return <div className={styles.message}>Even laden…</div>;
  }
  if (isError) {
    return <div className={styles.message}>Fout bij laden stations</div>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Alle stations</h1>
      <Link href="/" className={styles.backLink}>
        ← Terug naar Home
      </Link>
      <div className={styles.list}>
        {stations.map((station) => (
          <StationItem key={station.id} {...station} />
        ))}
      </div>
    </main>
  );
}
