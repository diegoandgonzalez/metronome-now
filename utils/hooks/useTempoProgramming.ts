'use client'
import { useRef } from 'react';
import { DEFAULT_SETTINGS } from '@/utils/constants';
import { LOCAL_STORAGE_KEYS } from '@/utils/localStorage';
import useStateRefLocalStorageSync from '@/utils/hooks/useStateRefLocalStorageSync';
import type { TempoProgrammingSettings } from '@/utils/types';

const useTempoProgramming = () => {

    const {
        value: isActive,
        valueRef: isActiveRef,
        handleSyncValue: handleSyncIsActive,
    } = useStateRefLocalStorageSync<boolean>(DEFAULT_SETTINGS.tempoProgrammingSettings.isActive, LOCAL_STORAGE_KEYS.tempoProgrammingIsActive);

    const {
        value: isLoop,
        valueRef: isLoopRef,
        handleSyncValue: handleSyncIsLoop,
    } = useStateRefLocalStorageSync<boolean>(DEFAULT_SETTINGS.tempoProgrammingSettings.isLoop, LOCAL_STORAGE_KEYS.tempoProgrammingIsLoop);

    const {
        value: fromBPM,
        valueRef: fromBPMRef,
        handleSyncValue: handleSyncFromBPM,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.tempoProgrammingSettings.fromBPM, LOCAL_STORAGE_KEYS.tempoProgrammingFromBPM);

    const {
        value: toBPM,
        valueRef: toBPMRef,
        handleSyncValue: handleSyncToBPM,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.tempoProgrammingSettings.toBPM, LOCAL_STORAGE_KEYS.tempoProgrammingToBPM);

    const {
        value: measuresToChangeBPM,
        valueRef: measuresToChangeBPMRef,
        handleSyncValue: handleSyncMeasuresToChangeBPM,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.tempoProgrammingSettings.measuresToChangeBPM, LOCAL_STORAGE_KEYS.tempoProgrammingMeasuresToChangeBPM);

    const {
        value: bpmToChange,
        valueRef: bpmToChangeRef,
        handleSyncValue: handleSyncBPMToChange,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.tempoProgrammingSettings.bpmToChange, LOCAL_STORAGE_KEYS.tempoProgrammingBPMToChange);

    const isDirectionAdding = useRef(true);

    const resetLoopDirection = () => {
        isDirectionAdding.current = fromBPM < toBPM;
    }

    const handleSetTempoProgrammingSettings = (newSettings: TempoProgrammingSettings = DEFAULT_SETTINGS.tempoProgrammingSettings) => {
        handleSyncBPMToChange(newSettings.bpmToChange);
        handleSyncIsActive(newSettings.isActive);
        handleSyncIsLoop(newSettings.isLoop);
        handleSyncMeasuresToChangeBPM(newSettings.measuresToChangeBPM);
        handleSyncFromBPM(newSettings.fromBPM);
        handleSyncToBPM(newSettings.toBPM);
        isDirectionAdding.current = newSettings.fromBPM < newSettings.toBPM; // initial direction depends on limit bpms
    }

    const getProgrammedBPM = (currentMeasure: number, currentBPM: number) => {
        let nextBPMValue = currentBPM;
        if (!isActiveRef.current) return nextBPMValue;

        if (currentMeasure % measuresToChangeBPMRef.current === 0) { // if it's correct measure to change bpm
            const maxValue = fromBPMRef.current < toBPMRef.current ? toBPMRef.current : fromBPMRef.current;
            const minValue = fromBPMRef.current < toBPMRef.current ? fromBPMRef.current : toBPMRef.current;
            let reachedLimit = false;

            nextBPMValue = currentBPM + (bpmToChangeRef.current * (isDirectionAdding.current ? 1 : -1));

            if (isDirectionAdding.current && nextBPMValue >= maxValue) {
                nextBPMValue = maxValue;
                reachedLimit = true;
            }

            if (!isDirectionAdding.current && nextBPMValue <= minValue) {
                nextBPMValue = minValue;
                reachedLimit = true;
            }

            if (isLoopRef.current && reachedLimit) {
                isDirectionAdding.current = !isDirectionAdding.current; // if bpm reaches limit, change direction
            }
        }

        return nextBPMValue;
    }

    const settings: TempoProgrammingSettings = {
        isActive,
        isLoop,
        bpmToChange,
        measuresToChangeBPM,
        fromBPM,
        toBPM,
    };

    return {
        settings,
        handleSetTempoProgrammingSettings,
        getProgrammedBPM,
        resetLoopDirection,
    };
}

export default useTempoProgramming;