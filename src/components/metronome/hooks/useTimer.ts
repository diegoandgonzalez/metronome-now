import { DEFAULT_SETTINGS } from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";
import type { TimerSettings } from "../types";

const initialTimerSecondsIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsIsActive, DEFAULT_SETTINGS.timerSettings.secondsIsActive);
const initialTimerMeasuresIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerMeasuresIsActive, DEFAULT_SETTINGS.timerSettings.measuresIsActive);
const initialTimerSecondsToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsToStop, DEFAULT_SETTINGS.timerSettings.secondsToStop);
const initialTimerMeasuresToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerMeasuresToStop, DEFAULT_SETTINGS.timerSettings.measuresToStop);

const useTimer = () => {

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

    const handleSetTimerSettings = (newSettings: TimerSettings = DEFAULT_SETTINGS.timerSettings) => {
        handleSyncSecondsToStop(newSettings.secondsToStop);
        handleSyncSecondsIsActive(newSettings.secondsIsActive);
        handleSyncMeasuresToStop(newSettings.measuresToStop);
        handleSyncMeasuresIsActive(newSettings.measuresIsActive);
    }

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