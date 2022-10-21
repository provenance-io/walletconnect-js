import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { formatSeconds } from 'utils';
import { COLORS } from 'theme';

const Time = styled.div<{ remainingTime: number }>`
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  color: ${({ remainingTime }) => {
    if (remainingTime < 1) return COLORS.LIGHT_RED;
    if (remainingTime < 300) return COLORS.ORANGE;
    if (remainingTime < 600) return COLORS.YELLOW;
    return COLORS.GREEN;
  }};
`;

interface Props {
  expires: number;
  interval?: number;
  onEnd?: () => void;
}

/**
 *
 * @param expires Date of expiration in ms
 * @param onEnd Optional fx to call when expired
 * @param interval Optional time for each countdown display (ms) (default 1000ms)
 * @returns React countdown Component
 */
export const CountdownTimer: React.FC<Props> = ({
  expires,
  onEnd,
  interval = 1000,
}) => {
  // Control the remaining time
  const [remainingTime, setRemainingTime] = useState(expires - Date.now());
  const [timerEnded, setTimerEnded] = useState(false);

  // Save the countdown interval
  const intervalId = useRef(0);
  // Create/update timer
  useEffect(() => {
    if (!intervalId.current && !timerEnded) {
      // Create new interval, save to be able to clear it
      const newIntervalId = window.setInterval(() => {
        // Every [interval] update the remaining time
        setRemainingTime(
          (previousRemainingTime) => previousRemainingTime - interval
        );
      }, interval);
      // Save newIntervalId to state
      intervalId.current = newIntervalId;
    }
    // Remove timer on unmount
    return () => {
      if (intervalId.current) {
        window.clearInterval(intervalId.current);
        intervalId.current = 0;
      }
    };
  }, [interval, onEnd, intervalId, timerEnded]);

  // If we change the expiration date, update the timer
  useEffect(() => {
    const newRemainingTime = expires - Date.now();
    setTimerEnded(false);
    setRemainingTime(newRemainingTime);
  }, [expires]);

  // Track the value of remaining time, if it expires, kill timer and run onEnd
  useEffect(() => {
    if (remainingTime <= 0 && intervalId.current && !timerEnded) {
      setTimerEnded(true);
      // Timer has expired, kill it and run onEnd function
      window.clearInterval(intervalId.current);
      if (onEnd) onEnd();
    }
  }, [onEnd, remainingTime, timerEnded]);

  const finalTime = remainingTime > 0 ? Math.ceil(remainingTime / 1000) : 0; // Seconds

  return <Time remainingTime={finalTime}>{formatSeconds(finalTime)}</Time>;
};
