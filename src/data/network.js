// File: src/data/network.js
import fetcher from './_fetcher';
import useSWR from 'swr';
import { useState, useEffect } from 'react';

export default function useNetwork() {
  // 1️⃣ Haal stations uit de CityBikes API
  const { data, error, isLoading } = useSWR(
    'https://api.citybik.es/v2/networks/velo-antwerpen',
    fetcher
  );

  const stations =
    data?.network?.stations?.map((s) => ({
      id: s.id,
      name: s.name,
      coords: {
        lat: s.latitude,
        lng: s.longitude,
      },
      free: s.empty_slots,
      bikes: s.free_bikes,
      total: s.empty_slots + s.free_bikes,
      xp: Math.max(0, 100 - s.empty_slots * 10),
      status: s.empty_slots === 0 ? 'vol' : 'open',
    })) ?? [];

  // 2️⃣ Bewaar de locatie in state, initieel uit API of fallback
  const [userLocation, setUserLocation] = useState(() => {
    if (data?.network?.location) {
      return {
        lat: data.network.location.latitude,
        lng: data.network.location.longitude,
      };
    }
    return { lat: 51.219448, lng: 4.402464 };
  });

  // 3️⃣ In een effect vraag je de browser om je echte locatie
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserLocation({
            lat: coords.latitude,
            lng: coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocatie geweigerd of fout:', err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return {
    stations,
    userLocation,
    isLoading,
    isError: error,
  };
}
