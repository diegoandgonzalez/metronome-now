'use client'
import { useRef } from 'react';

/**
 * @param timeArray of n elements representing time
 * @returns array with n-1 elements representing time between each consecutive number in timeArray
 */
const calculateIntervalBetweenTaps = (timeArray: number[]) => {
  return timeArray.slice(1).map((tapTime, index) => tapTime - timeArray[index]);
}

const useTapTempo = () => {
  const tapsTimeRef = useRef<number[]>([]);

  const tap = () => {
    tapsTimeRef.current.push(performance.now());
    if (tapsTimeRef.current.length < 2) return 0;

    const timeBetweenLastTwoTaps = calculateIntervalBetweenTaps(tapsTimeRef.current.slice(-2))[0];

    if (timeBetweenLastTwoTaps > 3000) {
      tapsTimeRef.current = [];
      return 0;
    }

    const intervalsBetweenTaps = calculateIntervalBetweenTaps(tapsTimeRef.current);
    const avgInterval = intervalsBetweenTaps.reduce((accum, current) => accum + current, 0) / intervalsBetweenTaps.length;
    const calculatedBPM = Math.round(60000 / avgInterval);

    return calculatedBPM;
  };

  return {
    tap,
  };
}

export default useTapTempo;