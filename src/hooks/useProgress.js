import { useState, useEffect } from 'react';

export default function useProgress() {
  const [xpTotal, setXpTotal]               = useState(0);
  const [bikesMoved, setBikesMoved]         = useState(0);
  const [stationsHelped, setStationsHelped] = useState(0);

  useEffect(() => {
    const xp    = parseInt(localStorage.getItem('xpTotal'))        || 0;
    const bikes = parseInt(localStorage.getItem('bikesMoved'))     || 0;
    const stns  = parseInt(localStorage.getItem('stationsHelped')) || 0;
    setXpTotal(xp);
    setBikesMoved(bikes);
    setStationsHelped(stns);
  }, []);

  const addXp = (amount) => {
    const next = xpTotal + amount;
    setXpTotal(next);
    localStorage.setItem('xpTotal', next);
  };

  const recordAction = (mode) => {
    if (mode === 'ophalen') {
      const next = bikesMoved + 1;
      setBikesMoved(next);
      localStorage.setItem('bikesMoved', next);
    } else {
      const next = stationsHelped + 1;
      setStationsHelped(next);
      localStorage.setItem('stationsHelped', next);
    }
  };

  const level     = Math.floor(xpTotal / 100) + 1;
  const xpInLevel = xpTotal % 100;
  const xpToNext  = 100 - xpInLevel;

  return {
    xpTotal,        // niet in JSX renderen
    level,          // wél in JSX renderen
    xp: xpInLevel,  // wél in JSX renderen
    xpToNext,       // wél in JSX renderen
    bikesMoved,     // wél in JSX renderen
    stationsHelped, // wél in JSX renderen
    addXp,          // NIET in JSX renderen
    recordAction,   // NIET in JSX renderen
  };
}
