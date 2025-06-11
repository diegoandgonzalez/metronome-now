import { useState, useEffect } from "react";

const useTimer = () => {

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

  const startTimer = () => {
    setStartTime(Date.now());
    setPlayedTime(0);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  return {
    playedTime,
    startTimer,
    stopTimer,
  };
}

export default useTimer;