import {
    TEMPO_PROGRAMMING_CONSTANTS,
    DEFAULT_SETTINGS,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";
import type { TempoProgrammingSettings } from "../types";

const initialTempoProgrammingIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingIsActive, DEFAULT_SETTINGS.tempoProgrammingSettings.isActive);
const initialTempoProgrammingBPMToChange = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingBPMToChange, DEFAULT_SETTINGS.tempoProgrammingSettings.bpmToChange);
const initialTempoProgrammingGoalBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingGoalBPM, DEFAULT_SETTINGS.tempoProgrammingSettings.goalBPM);
const initialTempoProgrammingMeasuresToChangeBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingMeasuresToChangeBPM, DEFAULT_SETTINGS.tempoProgrammingSettings.measuresToChangeBPM);
const initialTempoProgrammingAddSubtractOption = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingAddSubtractOption, DEFAULT_SETTINGS.tempoProgrammingSettings.addSubtractOption);

export type GetProgrammedBPMType = (currentMeasure: number, currentBPM: number) => number;

const useTempoProgramming = () => {

    const {
        value: isActive,
        valueRef: isActiveRef,
        handleSyncValue: handleSyncBPMProgrammingIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTempoProgrammingIsActive, LOCAL_STORAGE_KEYS.tempoProgrammingIsActive);

    const {
        value: addSubtractOption,
        valueRef: addSubtractOptionRef,
        handleSyncValue: handleSyncAddSubtractOption,
    } = useStateRefLocalStorageSync<string>(initialTempoProgrammingAddSubtractOption, LOCAL_STORAGE_KEYS.tempoProgrammingAddSubtractOption);

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

    const handleSetTempoProgrammingSettings = (newSettings: TempoProgrammingSettings = DEFAULT_SETTINGS.tempoProgrammingSettings) => {
        handleSyncBPMProgrammingIsActive(newSettings.isActive);
        handleSyncBPMToChange(newSettings.bpmToChange);
        handleSyncGoalBPM(newSettings.goalBPM);
        handleSyncMeasuresToChangeBPM(newSettings.measuresToChangeBPM);
        handleSyncAddSubtractOption(newSettings.addSubtractOption);
    }

    const getProgrammedBPM: GetProgrammedBPMType = (currentMeasure, currentBPM) => {
        let nextBPMValue = currentBPM;

        if (!isActiveRef.current) return nextBPMValue;

        if (currentMeasure % measuresToChangeBPMRef.current === 0) { // if it's correct measure to change bpm
            if (
                (addSubtractOptionRef.current === TEMPO_PROGRAMMING_CONSTANTS.actions.add && currentBPM < goalBPMRef.current) ||
                (addSubtractOptionRef.current === TEMPO_PROGRAMMING_CONSTANTS.actions.subtract && currentBPM > goalBPMRef.current)
            ) {
                // if new value is (greater/less) than goal, set goalbpm as new bpm
                nextBPMValue = currentBPM + (bpmToChangeRef.current * (addSubtractOptionRef.current === TEMPO_PROGRAMMING_CONSTANTS.actions.add ? 1 : -1));

                if (
                    (addSubtractOptionRef.current === TEMPO_PROGRAMMING_CONSTANTS.actions.add && nextBPMValue > goalBPMRef.current) ||
                    (addSubtractOptionRef.current === TEMPO_PROGRAMMING_CONSTANTS.actions.subtract && nextBPMValue < goalBPMRef.current)
                ) {
                    nextBPMValue = goalBPMRef.current;
                }
            }
        }

        return nextBPMValue;
    }

    const settings = {
        isActive,
        bpmToChange,
        goalBPM,
        measuresToChangeBPM,
        addSubtractOption,
    };

    return {
        settings,
        handleSetTempoProgrammingSettings,
        getProgrammedBPM,
    };
}

export default useTempoProgramming;