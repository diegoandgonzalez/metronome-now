import { DEFAULT_SETTINGS } from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";
import type { TimerSettings } from "../../../utils/types";

const initialTimerIsTimeActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerIsTimeActive, DEFAULT_SETTINGS.timerSettings.isTimeActive);
const initialTimerIsMeasuresActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerIsMeasuresActive, DEFAULT_SETTINGS.timerSettings.isMeasuresActive);
const initialTimerSecondsToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerSecondsToStop, DEFAULT_SETTINGS.timerSettings.secondsToStop);
const initialTimerMeasuresToStop = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.timerMeasuresToStop, DEFAULT_SETTINGS.timerSettings.measuresToStop);

const useTimerSettings = () => {

    const {
        value: isTimeActive,
        handleSyncValue: handleSyncSecondsIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerIsTimeActive, LOCAL_STORAGE_KEYS.timerIsTimeActive);

    const {
        value: isMeasuresActive,
        handleSyncValue: handleSyncMeasuresIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerIsMeasuresActive, LOCAL_STORAGE_KEYS.timerIsMeasuresActive);

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
        handleSyncSecondsIsActive(newSettings.isTimeActive);
        handleSyncMeasuresToStop(newSettings.measuresToStop);
        handleSyncMeasuresIsActive(newSettings.isMeasuresActive);
    }

    const settings: TimerSettings = {
        isTimeActive,
        secondsToStop,
        isMeasuresActive,
        measuresToStop,
    };

    return {
        settings,
        handleSetTimerSettings,
    };
}

export default useTimerSettings;