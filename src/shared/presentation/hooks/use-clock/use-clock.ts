import { useEffect, useState } from 'react';

const TICK_INTERVAL_MS = 15_000;

export function useClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), TICK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return now;
}
