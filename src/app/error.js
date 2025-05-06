'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Onverwachte fout:', error);
  }, [error]);

  return (
    <div>
      <h1>Er ging iets mis!</h1>
      <button onClick={() => reset()}>Opnieuw proberen</button>
    </div>
  );
}
