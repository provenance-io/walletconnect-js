import { useState, useEffect } from "react";
import styled from "styled-components";
import { formatSeconds } from "utils";
import { useInterval } from "hooks";

const Time = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  line-height: 1.3rem;
  margin-top: 2px;
  color: #aaaaaa;
`;

interface Props {
  expires: number;
  onEnd?: () => void;
  timeEvents?: {
    [key: number]: () => void;
  };
}

export const CountdownTimer: React.FC<Props> = ({
  expires,
  onEnd,
  timeEvents,
}) => {
  // Get current time in seconds and compare it to expiration
  const timeNow = Math.ceil(new Date().getTime() / 1000);
  const initialStartTime = expires - timeNow >= 0 ? expires - timeNow : 0; // Don't allow negative numbers, stop at 0
  const [currentTime, setCurrentTime] = useState(initialStartTime);
  const [countdownState, setCountdownState] = useState("init"); // init => start => running => end
  const [remainingTimeEvents, setRemainingTimeEvents] = useState(timeEvents);
  const [refreshRate, setRefreshRate] = useState(1000);

  // Detect change to start time (refreshed/new JWT)
  useEffect(() => {
    // We handle the first init in the next use effect, this is for a new change/refresh
    setCountdownState("start");
  }, [expires]);

  // Initial start to timer
  useEffect(() => {
    if (countdownState === "start") {
      setCountdownState("running");
      // reset/update currentTime
      setCurrentTime(initialStartTime);
      // Clean up the already expired timed events
      const cleanedTimeEvents = { ...timeEvents };
      Object.keys(cleanedTimeEvents).forEach((eventTime) => {
        const eventTimeNumber = Number(eventTime);
        if (initialStartTime <= eventTimeNumber)
          delete cleanedTimeEvents[eventTimeNumber];
      });
      setRemainingTimeEvents(cleanedTimeEvents);
    }
  }, [initialStartTime, currentTime, countdownState, timeEvents]);

  useInterval(
    () => {
      // ----------------------------------
      // Loop through special time events
      // ----------------------------------
      if (remainingTimeEvents) {
        // Keys are the special times (in seconds)
        const eventTimeValues = Object.keys(remainingTimeEvents);
        // Look through each special event time to see if we need to trigger it
        eventTimeValues.forEach((eventTime) => {
          const eventTimeNumber = Number(eventTime);
          // Trigger any special time events if they have occured
          if (currentTime - 1 <= eventTimeNumber) {
            // Run special event
            remainingTimeEvents[eventTimeNumber]();
            // Remove special event
            const cleanedTimeEvents = { ...remainingTimeEvents };
            delete cleanedTimeEvents[eventTimeNumber];
            setRemainingTimeEvents(cleanedTimeEvents);
          }
        });
      }
      // --------------------------------------------------
      // Update the current time, trigger end if needed
      // --------------------------------------------------
      if (currentTime > 0) setCurrentTime(currentTime - 1);
      if (currentTime <= 1) {
        // Time has reached zero/expired
        // Clear the current interval
        setRefreshRate(0);
        // Update countdown state to ended
        setCountdownState("end");
        // Run onEnd callback function
        if (onEnd) onEnd();
      }
    },
    refreshRate,
    countdownState === "end"
  );

  return <Time>{formatSeconds(currentTime)}</Time>;
};
