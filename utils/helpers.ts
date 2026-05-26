import type { LocalStorageKey, LocalStorageValue } from "@/utils/types";

const isLocalStorageAvailable = () => typeof localStorage !== 'undefined';

const isKeyPresentInLocalStorage = (localStorageKey: LocalStorageKey) => isLocalStorageAvailable() && Boolean(localStorage.getItem(localStorageKey));

const getValueFromLocalStorage = (localStorageKey: LocalStorageKey) => {
    if (!isLocalStorageAvailable()) return;
    try {
        const value = localStorage.getItem(localStorageKey);
        if (value) return JSON.parse(value);
        return;
    } catch { }
};

export const getValueFromLocalStorageOrDefault = (localStorageKey: LocalStorageKey, defaultValue?: LocalStorageValue) => {
    if (!isKeyPresentInLocalStorage(localStorageKey)) return defaultValue;
    return getValueFromLocalStorage(localStorageKey) ?? defaultValue;
};

export const setValueInLocalStorage = (localStorageKey: LocalStorageKey, value: LocalStorageValue) => {
    if (!isLocalStorageAvailable()) return;
    localStorage.setItem(localStorageKey, JSON.stringify(value));
};

export const formatMsToHHMMSS = (value: number) => {
    const padTwoDigits = (n: number) => ('00' + n).slice(-2);

    let auxValue = value;
    const ms = auxValue % 1000;
    auxValue = (auxValue - ms) / 1000;
    const secs = auxValue % 60;
    auxValue = (auxValue - secs) / 60;
    const mins = auxValue % 60;
    const hrs = (auxValue - mins) / 60;

    return padTwoDigits(hrs) + ':' + padTwoDigits(mins) + ':' + padTwoDigits(secs);
}

/**
 * Creates array with accent on the 1 and length passed by parameter
 * @param {number} beatsPerMeasure beats in the time signature
 */
export const createDefaultBeatTypesArray = (beatsPerMeasure: number) => {
    const auxArray = new Array(beatsPerMeasure).fill(1);
    auxArray[0] = 0;
    return auxArray;
}

/**
 * Receives beatTypesArray and adds new positions in case the new time signature is longer.
 * If it's not longer, it returns the same array passed as argument.
 * @param currentBeatTypes array of beat types
 * @param newBeatsPerMeasure beats in the new time signature
 * @returns 
 */
export const getUpdatedBeatTypesArray = (currentBeatTypes: number[], newBeatsPerMeasure: number): number[] => {
    // keey types for those beats that are not in the nre time signature
    if (currentBeatTypes.length >= newBeatsPerMeasure) return [...currentBeatTypes];

    const newBeatTypesSection = new Array(newBeatsPerMeasure - currentBeatTypes.length).fill(1);
    return [...currentBeatTypes, ...newBeatTypesSection];
}
