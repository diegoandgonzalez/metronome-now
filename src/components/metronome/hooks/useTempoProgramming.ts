import {
    DEFAULT_BPM_PROGRAMMING_IS_ACTIVE,
    DEFAULT_GOAL_BPM,
    DEFAULT_BPM_TO_CHANGE,
    DEFAULT_MEASURES_TO_CHANGE_BPM,
    ADD_OPTION,
    SUBTRACT_OPTION,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "./useStateRefLocalStorageSync";

const initialTempoProgrammingIsActive = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingIsActive, DEFAULT_BPM_PROGRAMMING_IS_ACTIVE);
const initialTempoProgrammingBPMToChange = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingBPMToChange, DEFAULT_BPM_TO_CHANGE);
const initialTempoProgrammingGoalBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingGoalBPM, DEFAULT_GOAL_BPM);
const initialTempoProgrammingMeasuresToChangeBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingMeasuresToChangeBPM, DEFAULT_MEASURES_TO_CHANGE_BPM);
const initialTempoProgrammingAddSubtractOption = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.tempoProgrammingAddSubtractOption, ADD_OPTION);

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

    const handleSetTempoProgramming = (newBPMToChange: number, newGoalBPM: number, newMeasuresToChangeBPM: number, newAddSubtractOption: string, newIsActive: boolean) => {
        handleSyncBPMToChange(newBPMToChange);
        handleSyncGoalBPM(newGoalBPM);
        handleSyncMeasuresToChangeBPM(newMeasuresToChangeBPM);
        handleSyncBPMProgrammingIsActive(newIsActive);
        handleSyncAddSubtractOption(newAddSubtractOption);
    }

    const getProgrammedBPM: GetProgrammedBPMType = (currentMeasure, currentBPM) => {
        let nextBPMValue = currentBPM;

        if (!isActiveRef.current) return nextBPMValue;

        if (currentMeasure % measuresToChangeBPMRef.current === 0) { // if it's correct measure to change bpm
            if (
                (addSubtractOptionRef.current === ADD_OPTION && currentBPM < goalBPMRef.current) ||
                (addSubtractOptionRef.current === SUBTRACT_OPTION && currentBPM > goalBPMRef.current)
            ) {
                // if new value is (greater/less) than goal, set goalbpm as new bpm
                nextBPMValue = currentBPM + (bpmToChangeRef.current * (addSubtractOptionRef.current === ADD_OPTION ? 1 : -1));

                if (
                    (addSubtractOptionRef.current === ADD_OPTION && nextBPMValue > goalBPMRef.current) ||
                    (addSubtractOptionRef.current === SUBTRACT_OPTION && nextBPMValue < goalBPMRef.current)
                ) {
                    nextBPMValue = goalBPMRef.current;
                }
            }
        }

        return nextBPMValue;
    }

    return {
        isActive,
        addSubtractOption,
        bpmToChange,
        measuresToChangeBPM,
        goalBPM,
        handleSetTempoProgramming,
        getProgrammedBPM,
    };
}

export default useTempoProgramming;