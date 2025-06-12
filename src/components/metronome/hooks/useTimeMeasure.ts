import { useState, useEffect } from "react";

const useTimeMeasure = () => {

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [measuredTime, setMeasuredTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setMeasuredTime((Date.now() - startTime));
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const startTimeMeasure = () => {
    setStartTime(Date.now());
    setMeasuredTime(0);
    setIsRunning(true);
  };

  const stopTimeMeasure = () => {
    setIsRunning(false);
    setMeasuredTime(0);
  };

  return {
    measuredTime,
    startTimeMeasure,
    stopTimeMeasure,
  };
}

export default useTimeMeasure;