import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { formatSeconds } from 'utils';

const Time = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  line-height: 1.3rem;
  margin-top: 2px;
`;

export const CountdownTimer = ({ start, onEnd, timeEvents }) => {
  const [currentTime, setCurrentTime] = useState(start);
  const [timeoutInstance, setTimeoutInstance] = useState(null);
  const [countdownState, setCountdownState] = useState('init');
  const refreshRate = 1000;
  // Remove any special time events that may have already happened
  const cleanedTimeEvents = useMemo(() => ({ ...timeEvents }), [timeEvents]);
  Object.keys(timeEvents).forEach(eventTime => {
    if (start < eventTime) delete cleanedTimeEvents[eventTime];
  });

  // When component loads, start the timer if not already started
  useEffect(() => {
    // Loop to continuously count down
    const countdownLoop = (time, remainingTimeEvents) => {
      const cleanRemainingTimeEvents = remainingTimeEvents ? { ...remainingTimeEvents } : null;
      // If special time events exist
      if (cleanRemainingTimeEvents && Object.keys(cleanRemainingTimeEvents).length) {
        const timeEventTimes = Object.keys(cleanRemainingTimeEvents); // Keys are the special times (in seconds)
        // Look through each special event time to see if we need to trigger it
        timeEventTimes.forEach(eventTime => {
          // Trigger any special time events if they have occured
          if (time < eventTime) {
            // Run special event
            cleanRemainingTimeEvents[eventTime]();
            // Remove special event
            delete cleanRemainingTimeEvents[eventTime];
          }
        });
      }
      // Make sure not expired
      if (time > 0) {
        // Create new timeout
        const newTimeout = setTimeout(() => {
          // Take 1 second off of current time
          const newTime = time - 1;
          // Save new current time
          setCurrentTime(newTime);
          countdownLoop(newTime, cleanRemainingTimeEvents);
        }, refreshRate);
        // Save this timeout to the state
        setTimeoutInstance(newTimeout);
      } else {
        // Clear current timeout
        clearTimeout(timeoutInstance);
        // Countdown is now off
        setCountdownState('end');
        // If expired, run callback onEnd function
        onEnd();
      }
    };
    // Start the loop if it hasn't been started yet
    if (countdownState === 'init') {
      // Set as started
      setCountdownState('running');
      // Start loop with passed in initial start time
      countdownLoop(currentTime, cleanedTimeEvents);
    }
    // When unmounted, clear the timeout (no leaking) ** RETURN HERE - WORKS W/OUT, BUT IS MEMORY LEAK, WITH IT STOPS WITH MODAL CLOSE :(
    // return () => { if (timeoutInstance) {clearTimeout(timeoutInstance)}}
  }, [timeoutInstance, onEnd, currentTime, countdownState, cleanedTimeEvents]);

  return <Time>{formatSeconds(currentTime)}</Time>
};

CountdownTimer.propTypes = {
  start: PropTypes.number.isRequired,
  onEnd: PropTypes.func,
  timeEvents: PropTypes.object,
};

CountdownTimer.defaultProps = {
  onEnd: () => {},
  timeEvents: {},
};
