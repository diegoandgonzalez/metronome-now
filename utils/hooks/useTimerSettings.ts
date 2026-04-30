'use client'
import { DEFAULT_SETTINGS } from '@/utils/constants';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import type { TimerSettings } from '@/utils/types';
import useStateRefLocalStorageSync from '@/utils/hooks/useStateRefLocalStorageSync';

const useTimerSettings = () => {

    const {
        value: isTimeActive,
        handleSyncValue: handleSyncSecondsIsActive,
    } = useStateRefLocalStorageSync<boolean>(DEFAULT_SETTINGS.timerSettings.isTimeActive, LOCAL_STORAGE_KEYS.timerIsTimeActive);

    const {
        value: isMeasuresActive,
        handleSyncValue: handleSyncMeasuresIsActive,
    } = useStateRefLocalStorageSync<boolean>(DEFAULT_SETTINGS.timerSettings.isMeasuresActive, LOCAL_STORAGE_KEYS.timerIsMeasuresActive);

    const {
        value: secondsToStop,
        handleSyncValue: handleSyncSecondsToStop,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.timerSettings.secondsToStop, LOCAL_STORAGE_KEYS.timerSecondsToStop);

    const {
        value: measuresToStop,
        handleSyncValue: handleSyncMeasuresToStop,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.timerSettings.measuresToStop, LOCAL_STORAGE_KEYS.timerMeasuresToStop);

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