import { useEffect } from "react";
import {
    DEFAULT_TIMER_IS_ACTIVE,
    DEFAULT_SECONDS_TO_STOP,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "./useStateRefLocalStorageSync";

const initialTimerIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerIsActive, DEFAULT_TIMER_IS_ACTIVE);
const initialTimerSecondsToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsToStop, DEFAULT_SECONDS_TO_STOP);

const useTimer = (measuredTime: number, callback: () => void) => {

    const {
        value: timerIsActive,
        handleSyncValue: handleSyncTimerIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerIsActive, LOCAL_STORAGE_KEYS.timerIsActive);

    const {
        value: timerSecondsToStop,
        handleSyncValue: handleSyncTimerSecondsToStop,
    } = useStateRefLocalStorageSync<number>(initialTimerSecondsToStop, LOCAL_STORAGE_KEYS.timerSecondsToStop);


    const handleSetTimer = (newAmount: number, newIsActive: boolean) => {
        handleSyncTimerSecondsToStop(newAmount);
        handleSyncTimerIsActive(newIsActive);
    }

    useEffect(() => {
        if (timerIsActive && measuredTime) {
            if (measuredTime >= (timerSecondsToStop * 1000)) callback();
        }
    }, [measuredTime, timerIsActive, timerSecondsToStop, callback])

    return {
        timerIsActive,
        timerSecondsToStop,
        handleSetTimer,
    };
}

export default useTimer;