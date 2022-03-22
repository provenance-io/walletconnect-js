import { useEffect, useRef } from 'react';

export function useInterval(callback, delay, clearSelf) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    const id = setInterval(tick, delay);

    if (clearSelf) clearInterval(id);

    return () => clearInterval(id);
  }, [delay, clearSelf]);
}
