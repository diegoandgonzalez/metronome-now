import { useState } from "react";
import { MAX_BPM } from "../../../utils/constants";

const useTapToBPM = () => {

  const [startTime, setStartTime] = useState(0);

  const tap = () => {
    if (startTime === 0) {
      startTimeMeasure();
      return 0;
    }

    const tapTime = Date.now();
    const secondsBetweenTaps = (tapTime - startTime) / 1000;

    if (secondsBetweenTaps > 60) {
      stopTimeMeasure();
      return 0;
    }

    setStartTime(tapTime);

    const calculatedBPM = Math.round(60 / secondsBetweenTaps);
    if (calculatedBPM > MAX_BPM) return MAX_BPM;
    return calculatedBPM;
  }

  const startTimeMeasure = () => {
    setStartTime(Date.now());
  };

  const stopTimeMeasure = () => {
    setStartTime(0);
  };

  return {
    tap,
  };
}

export default useTapToBPM;