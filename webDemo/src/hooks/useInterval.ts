import { useEffect, useRef } from "react";

export function useInterval(
  callback: () => void,
  delay: number,
  clearSelf: boolean
) {
  const savedCallback = useRef<null | (() => void)>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }

    const id = setInterval(tick, delay);

    if (clearSelf) clearInterval(id);

    return () => clearInterval(id);
  }, [delay, clearSelf]);
}
