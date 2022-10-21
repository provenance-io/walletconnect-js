import { useState } from 'react';
import styled from 'styled-components';
import { formatSeconds } from 'utils';
import { useInterval } from 'hooks';

const Time = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  color: #aaaaaa;
`;

interface Props {
  expires: number;
  onEnd?: () => void;
  timeEvents?: {
    [key: number | string]: () => void;
  };
  debug?: boolean;
}

/**
 *
 * @param expires Date of expiration in ms
 * @param onEnd Optional fx to call when expired
 * @param timeEvents Optional time object of events to trigger at various intervals (seconds)
 * @returns React countdown Component
 */
export const CountdownTimer: React.FC<Props> = ({
  expires,
  onEnd,
  timeEvents = {},
  debug,
}) => {
  const initTime = Date.now(); // Current time (ms) (when component was loaded/created)
  const timeStepAmount = 1000; // How often are we updating the timer (ms) (and how much does it change by)
  const [remainingTime, setRemainingTime] = useState(expires - initTime); // Time left on countdown in ms
  const [remainingTimeEvents, setRemainingTimeEvents] = useState({ ...timeEvents }); // Will be removing time events when triggered
  // if (debug) {
  //   console.log(
  //     'CountdownTimer | remainingTime: ',
  //     'ms: ',
  //     remainingTime,
  //     's: ',
  //     remainingTime / 1000,
  //     'h: ',
  //     remainingTime / 60000
  //   );
  // }
  // Start timer
  useInterval(
    () => {
      // ----------------------------------
      // Loop through special time events
      // ----------------------------------
      const newRemainingTimeEvents = { ...remainingTimeEvents };
      const timeEventKeys = Object.keys(newRemainingTimeEvents);
      // If we have remaining events
      if (timeEventKeys.length) {
        timeEventKeys.forEach((eventTime) => {
          const eventTimeNumber = Number(eventTime); // Number converted to string via Object.keys
          if (remainingTime <= eventTimeNumber * 1000)
            // Convert event (s) to (ms)
            newRemainingTimeEvents[eventTime](); // Run the callback function
          delete newRemainingTimeEvents[eventTimeNumber]; // Remove this event from the time events
          setRemainingTimeEvents(newRemainingTimeEvents); // Update state with new time events
        });
      }
      // --------------------------------------------------
      // Update the current time, trigger end if needed
      // --------------------------------------------------
      // Timer has expired
      if (!remainingTime) {
        setRemainingTime(0); // Time should never show below 0
        if (onEnd) onEnd(); // Run onEnd function if provided
      } else {
        // Timer is not expired
        const newRemainingTime = remainingTime - timeStepAmount;
        setRemainingTime(newRemainingTime);
      }
    },
    timeStepAmount,
    !remainingTime
  );

  return <Time>{formatSeconds(Math.round(remainingTime / 1000))}</Time>;
};
