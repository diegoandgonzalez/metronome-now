import { useEffect } from "react";
import {
    DEFAULT_SECONDS_TO_STOP,
    DEFAULT_TIMER_SECONDS_IS_ACTIVE,
    DEFAULT_TIMER_MEASURES_IS_ACTIVE,
    DEFAULT_MEASURES_TO_STOP,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";

const initialTimerSecondsIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsIsActive, DEFAULT_TIMER_SECONDS_IS_ACTIVE);
const initialTimerMeasuresIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerMeasuresIsActive, DEFAULT_TIMER_MEASURES_IS_ACTIVE);
const initialTimerSecondsToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsToStop, DEFAULT_SECONDS_TO_STOP);
const initialTimerMeasuresToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerMeasuresToStop, DEFAULT_MEASURES_TO_STOP);

const useTimer = (currentTime: number, currentMeasure: number, callback: () => void) => {

    const {
        value: timerSecondsIsActive,
        handleSyncValue: handleSyncTimerSecondsIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerSecondsIsActive, LOCAL_STORAGE_KEYS.timerSecondsIsActive);

    const {
        value: timerMeasuresIsActive,
        handleSyncValue: handleSyncTimerMeasuresIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerMeasuresIsActive, LOCAL_STORAGE_KEYS.timerMeasuresIsActive);

    const {
        value: timerSecondsToStop,
        handleSyncValue: handleSyncTimerSecondsToStop,
    } = useStateRefLocalStorageSync<number>(initialTimerSecondsToStop, LOCAL_STORAGE_KEYS.timerSecondsToStop);

    const {
        value: timerMeasuresToStop,
        handleSyncValue: handleSyncTimerMeasuresToStop,
    } = useStateRefLocalStorageSync<number>(initialTimerMeasuresToStop, LOCAL_STORAGE_KEYS.timerMeasuresToStop);

    const handleSetTimer = (newSecondsAmount: number, newSecondsIsActive: boolean, newMeasuresAmount: number, newMeasuresIsActive: boolean) => {
        handleSyncTimerSecondsToStop(newSecondsAmount);
        handleSyncTimerSecondsIsActive(newSecondsIsActive);
        handleSyncTimerMeasuresToStop(newMeasuresAmount);
        handleSyncTimerMeasuresIsActive(newMeasuresIsActive);
    }

    useEffect(() => {
        if (timerSecondsIsActive && currentTime) {
            if (currentTime >= (timerSecondsToStop * 1000)) callback();
        }

        if (timerMeasuresIsActive && currentMeasure) {
            if (currentMeasure >= timerMeasuresToStop) callback();
        }
    }, [currentTime, timerSecondsIsActive, timerSecondsToStop, callback])

    return {
        timerSecondsIsActive,
        timerMeasuresIsActive,
        timerSecondsToStop,
        timerMeasuresToStop,
        handleSetTimer,
    };
}

export default useTimer;