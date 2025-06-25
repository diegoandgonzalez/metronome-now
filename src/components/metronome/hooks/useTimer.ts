import { useEffect } from "react";
import {
    DEFAULT_TIMER_SECONDS_TO_STOP,
    DEFAULT_TIMER_SECONDS_IS_ACTIVE,
    DEFAULT_TIMER_MEASURES_IS_ACTIVE,
    DEFAULT_TIMER_MEASURES_TO_STOP,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";
import type { TimerSettings } from "../types";

const initialTimerSecondsIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsIsActive, DEFAULT_TIMER_SECONDS_IS_ACTIVE);
const initialTimerMeasuresIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerMeasuresIsActive, DEFAULT_TIMER_MEASURES_IS_ACTIVE);
const initialTimerSecondsToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsToStop, DEFAULT_TIMER_SECONDS_TO_STOP);
const initialTimerMeasuresToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerMeasuresToStop, DEFAULT_TIMER_MEASURES_TO_STOP);

const useTimer = (currentTime: number, currentMeasure: number, callback: () => void) => {

    const {
        value: secondsIsActive,
        handleSyncValue: handleSyncSecondsIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerSecondsIsActive, LOCAL_STORAGE_KEYS.timerSecondsIsActive);

    const {
        value: measuresIsActive,
        handleSyncValue: handleSyncMeasuresIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerMeasuresIsActive, LOCAL_STORAGE_KEYS.timerMeasuresIsActive);

    const {
        value: secondsToStop,
        handleSyncValue: handleSyncSecondsToStop,
    } = useStateRefLocalStorageSync<number>(initialTimerSecondsToStop, LOCAL_STORAGE_KEYS.timerSecondsToStop);

    const {
        value: measuresToStop,
        handleSyncValue: handleSyncMeasuresToStop,
    } = useStateRefLocalStorageSync<number>(initialTimerMeasuresToStop, LOCAL_STORAGE_KEYS.timerMeasuresToStop);

    const handleSetTimerSettings = (newSettings: TimerSettings) => {
        handleSyncSecondsToStop(newSettings.secondsToStop ?? DEFAULT_TIMER_SECONDS_TO_STOP);
        handleSyncSecondsIsActive(newSettings.secondsIsActive ?? DEFAULT_TIMER_SECONDS_IS_ACTIVE);
        handleSyncMeasuresToStop(newSettings.measuresToStop ?? DEFAULT_TIMER_MEASURES_TO_STOP);
        handleSyncMeasuresIsActive(newSettings.measuresIsActive ?? DEFAULT_TIMER_MEASURES_IS_ACTIVE);
    }

    useEffect(() => {
        if (secondsIsActive && currentTime) {
            if (currentTime >= (secondsToStop * 1000)) callback();
        }

        if (measuresIsActive && currentMeasure) {
            if (currentMeasure >= measuresToStop) callback();
        }
    }, [currentTime, secondsIsActive, secondsToStop, callback])

    const settings = {
        secondsIsActive,
        secondsToStop,
        measuresIsActive,
        measuresToStop,
    };

    return {
        settings,
        handleSetTimerSettings,
    };
}

export default useTimer;