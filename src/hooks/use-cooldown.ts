import { useEffect, useState } from 'react';

// Cuenta regresiva en segundos (para "Reenviar código").
export function useCooldown(initial = 0) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return { seconds, start: (s = 30) => setSeconds(s), active: seconds > 0 };
}