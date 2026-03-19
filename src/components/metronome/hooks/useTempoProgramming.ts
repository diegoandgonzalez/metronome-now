import { useRef } from "react";
import {
    TEMPO_PROGRAMMING_CONSTANTS,
    DEFAULT_SETTINGS,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";
import type { TempoProgrammingSettings } from "../../../utils/types";

const initialTempoProgrammingIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingIsActive, DEFAULT_SETTINGS.tempoProgrammingSettings.isActive);
const initialTempoProgrammingBPMToChange = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingBPMToChange, DEFAULT_SETTINGS.tempoProgrammingSettings.bpmToChange);
const initialTempoProgrammingGoalBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingGoalBPM, DEFAULT_SETTINGS.tempoProgrammingSettings.goalBPM);
const initialTempoProgrammingMeasuresToChangeBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingMeasuresToChangeBPM, DEFAULT_SETTINGS.tempoProgrammingSettings.measuresToChangeBPM);
const initialTempoProgrammingAddSubtractOption = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingAction, DEFAULT_SETTINGS.tempoProgrammingSettings.action);

const MAX = 120;
const MIN = 90;

const useTempoProgramming = () => {

    const {
        value: isActive,
        valueRef: isActiveRef,
        handleSyncValue: handleSyncBPMProgrammingIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTempoProgrammingIsActive, LOCAL_STORAGE_KEYS.tempoProgrammingIsActive);

    const {
        value: action,
        valueRef: actionRef,
        handleSyncValue: handleSyncAddSubtractOption,
    } = useStateRefLocalStorageSync<string>(initialTempoProgrammingAddSubtractOption, LOCAL_STORAGE_KEYS.tempoProgrammingAction);

    const {
        value: goalBPM,
        valueRef: goalBPMRef,
        handleSyncValue: handleSyncGoalBPM,
    } = useStateRefLocalStorageSync<number>(initialTempoProgrammingGoalBPM, LOCAL_STORAGE_KEYS.tempoProgrammingGoalBPM);

    const {
        value: measuresToChangeBPM,
        valueRef: measuresToChangeBPMRef,
        handleSyncValue: handleSyncMeasuresToChangeBPM,
    } = useStateRefLocalStorageSync<number>(initialTempoProgrammingMeasuresToChangeBPM, LOCAL_STORAGE_KEYS.tempoProgrammingMeasuresToChangeBPM);

    const {
        value: bpmToChange,
        valueRef: bpmToChangeRef,
        handleSyncValue: handleSyncBPMToChange,
    } = useStateRefLocalStorageSync<number>(initialTempoProgrammingBPMToChange, LOCAL_STORAGE_KEYS.tempoProgrammingBPMToChange);

    const actionIsIncreasing = useRef(true);

    const resetLoopDirection = () => {
        actionIsIncreasing.current = actionRef.current !== TEMPO_PROGRAMMING_CONSTANTS.actions.subtract;
    }

    const handleSetTempoProgrammingSettings = (newSettings: TempoProgrammingSettings = DEFAULT_SETTINGS.tempoProgrammingSettings) => {
        handleSyncBPMProgrammingIsActive(newSettings.isActive);
        handleSyncBPMToChange(newSettings.bpmToChange);
        handleSyncGoalBPM(newSettings.goalBPM);
        handleSyncMeasuresToChangeBPM(newSettings.measuresToChangeBPM);
        handleSyncAddSubtractOption(newSettings.action);
        actionIsIncreasing.current = newSettings.action !== TEMPO_PROGRAMMING_CONSTANTS.actions.subtract;
    }

    const getProgrammedBPM = (currentMeasure: number, currentBPM: number) => {
        let nextBPMValue = currentBPM;

        if (!isActiveRef.current) return nextBPMValue;

        if (currentMeasure % measuresToChangeBPMRef.current === 0) { // if it's correct measure to change bpm

            if (actionRef.current === TEMPO_PROGRAMMING_CONSTANTS.actions.loop) { // edge cases for loop
                if (currentBPM >= MAX) actionIsIncreasing.current = false;
                if (currentBPM <= MIN) actionIsIncreasing.current = true;
            }

            nextBPMValue = currentBPM + (bpmToChangeRef.current * (actionIsIncreasing.current ? 1 : -1));

            if (
                (actionIsIncreasing.current && nextBPMValue > (typeof goalBPMRef.current === "number" ? goalBPMRef.current : MAX)) || // TODO: replace MAX and MIN with user values
                (!actionIsIncreasing.current && nextBPMValue < (typeof goalBPMRef.current === "number" ? goalBPMRef.current : MIN))
            ) {
                nextBPMValue = actionIsIncreasing.current ? (typeof goalBPMRef.current === "number" ? goalBPMRef.current : MAX) : (typeof goalBPMRef.current === "number" ? goalBPMRef.current : MIN);
            }
        }

        return nextBPMValue;
    }

    const settings: TempoProgrammingSettings = {
        isActive,
        bpmToChange,
        goalBPM,
        measuresToChangeBPM,
        action,
    };

    return {
        settings,
        handleSetTempoProgrammingSettings,
        getProgrammedBPM,
        resetLoopDirection,
    };
}

export default useTempoProgramming;