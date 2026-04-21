'use client'
import { useState, useEffect, useRef } from 'react';
import useStateRefLocalStorageSync from '@/utils/hooks/useStateRefLocalStorageSync';

const TIME_TO_ADD = 100;

const useTimeMeasure = () => {

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const {
    value: currentTime,
    valueRef: currentTimeRef,
    handleSyncValue: handleSyncCurrentTime,
  } = useStateRefLocalStorageSync<number>(0);

  const isPaused = useRef(false);

  useEffect(() => {
    let interval: number;

    if (isRunning && startTime) {
      interval = window.setInterval(() => {
        if (isPaused.current) return;
        handleSyncCurrentTime(currentTimeRef.current + TIME_TO_ADD);
      }, TIME_TO_ADD);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, currentTimeRef, handleSyncCurrentTime]);

  const togglePauseTimeMeasure = () => {
    isPaused.current = !isPaused.current;
  }

  const startTimeMeasure = () => {
    setStartTime(Date.now());
    handleSyncCurrentTime(0);
    setIsRunning(true);
  };

  const stopTimeMeasure = () => {
    setIsRunning(false);
    handleSyncCurrentTime(0);
    isPaused.current = false;
  };

  return {
    currentTime,
    currentTimeRef,
    startTimeMeasure,
    stopTimeMeasure,
    togglePauseTimeMeasure,
  };
}

export default useTimeMeasure;