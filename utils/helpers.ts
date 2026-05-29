import { DEFAULT_SETTINGS } from "@/utils/constants";
import type { LocalStorageKey, LocalStorageValue, Settings, Template } from "@/utils/types";
import dayjs, { Dayjs } from "dayjs";
import { strToU8, deflateSync, strFromU8, inflateSync } from 'fflate';

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


export const handleIntegerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block decimals (.), minus signs if only positive integers are allowed (-), and scientific notation (e, E)
    if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === 'E' || e.key === '-') {
        e.preventDefault();
    }
};

export const handleIntegerPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    // If the pasted string contains anything other than digits, block it
    if (!/^\d+$/.test(pasteData)) {
        e.preventDefault();
    }
};

export const convertSecondsToMinutesSeconds = (totalSeconds: number): Dayjs => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return dayjs().startOf('day').minute(minutes).second(seconds);
};

export const convertMmSsToSeconds = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return 0;
    return (minutes * 60) + seconds;
};


export function encode(data: unknown): string {
    const json = JSON.stringify(data);
    const compressed = deflateSync(strToU8(json));
    const binary = String.fromCharCode(...compressed);
    return encodeURIComponent(btoa(binary));
}

export function decode(encoded: string): unknown {
    const binary = atob(decodeURIComponent(encoded));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const json = strFromU8(inflateSync(bytes));
    return JSON.parse(json);
}

export const generateTemplateUniqueName = (templates: Template[], newName: string): string => {
    let uniqueName = newName;
    let counter = 1;

    while (templates.some((template) => template.name === uniqueName)) {
        uniqueName = `${newName} (${counter})`;
        counter++;
    }

    return uniqueName;
}