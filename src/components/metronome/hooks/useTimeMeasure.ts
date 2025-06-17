import { useState, useEffect, useRef } from "react";

const TIME_TO_ADD = 100;

const useTimeMeasure = () => {

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [measuredTime, setMeasuredTime] = useState(0);

  const isPaused = useRef(false);

  useEffect(() => {
    let interval: number;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        if (isPaused.current) return;
        setMeasuredTime((prev) => prev + TIME_TO_ADD);
      }, TIME_TO_ADD);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const togglePauseTimeMeasure = () => {
    isPaused.current = !isPaused.current;
  }

  const startTimeMeasure = () => {
    setStartTime(Date.now());
    setMeasuredTime(0);
    setIsRunning(true);
  };

  const stopTimeMeasure = () => {
    setIsRunning(false);
    setMeasuredTime(0);
    isPaused.current = false;
  };

  return {
    measuredTime,
    startTimeMeasure,
    stopTimeMeasure,
    togglePauseTimeMeasure,
  };
}

export default useTimeMeasure;