import { useState, useEffect } from "react";

const useStopwatch = () => {

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setPlayedTime((Date.now() - startTime));
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const startStopwatch = () => {
    setStartTime(Date.now());
    setPlayedTime(0);
    setIsRunning(true);
  };

  const stopStopwatch = () => {
    setIsRunning(false);
  };

  return {
    playedTime,
    startStopwatch,
    stopStopwatch,
  };
}

export default useStopwatch;