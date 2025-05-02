'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import useNetwork from '@/data/network';
import { getDistance } from '@/helpers/get-distance';
import Link from 'next/link';

export default function Home() {
  const [filter, setFilter] = useState('');
  const [location, setLocation] = useState({});
  const { network, isLoading, isError } = useNetwork();

  // Zo vang je alle asynchrone fouten op en zie je in de console de echte err.message en err.stack in plaats van {}
  useEffect(() => {
    async function loadStations() {
      try {
        const res = await fetch('/api/stations');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStations(data);
      } catch (err) {
        console.error('Stations laden mislukt:', err);
      }
    }
    loadStations();
  }, []);

  // use effect gebruiken om bv iets op te roepen enkel bij opstart van de app
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const stations = network.stations.filter(
    (station) => station.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
  );

  // map stations to add disrance to current location
  stations.map((station) => {
    station.distance =
      getDistance(
        location.latitude,
        location.longitude,
        station.latitude,
        station.longitude
      ).distance / 1000;
  });

  // sort stations by distance
  stations.sort((a, b) => a.distance - b.distance);

  function handleFilterChange(e) {
    setFilter(e.target.value);
  }

  return (
    <div>
      <h1 className={styles.title}>Stations</h1>
      <input type="text" value={filter} onChange={handleFilterChange} />
      {stations.map((station) => (
        <div key={station.id}>
          <Link href={`/stations/${station.id}`}>
            {station.name}: {station.distance}km
          </Link>
        </div>
      ))}
    </div>
  );
}
