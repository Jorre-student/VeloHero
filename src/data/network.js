// File: src/data/network.js
import fetcher from './_fetcher';
import useSWR from 'swr';

export default function useNetwork() {
  const { data, error, isLoading } = useSWR(
    'https://api.citybik.es/v2/networks/velo-antwerpen',
    fetcher
  );

  // Transform API data into our station shape
  const stations =
    data?.network?.stations?.map((s) => ({
      id: s.id,
      name: s.name,
      coords: { lat: s.latitude, lng: s.longitude },
      free: s.empty_slots,
      bikes: s.free_bikes,
      total: s.empty_slots + s.free_bikes,
      xp: Math.floor(Math.random() * 50), // placeholder XP
      status: s.empty_slots === 0 ? 'vol' : 'open',
    })) ?? [];

  // Derive a default user location (center of Antwerpen) or use API-provided location
  const userLocation = data?.network?.location
    ? {
        lat: data.network.location.latitude,
        lng: data.network.location.longitude,
      }
    : { lat: 51.219448, lng: 4.402464 };

  return {
    stations,
    userLocation,
    isLoading,
    isError: error,
  };
}
