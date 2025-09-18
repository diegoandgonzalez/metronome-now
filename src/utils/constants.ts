import type { Settings } from "../components/metronome/types";
import { createDefaultBeatTypesArray } from "./beatTypes";

export const METRONOME_CONSTANTS = {
    lookAhead: 25, // ms
    beatTypesAmount: 3, // number of different types of beat types
    stoppedBeatIndex: -1,
    minBPM: 30,
    maxBPM: 360,
    noteValueOptions: [2, 4, 8, 16],
    beatsPerMeasureOptions: Array.from({ length: 16 }, (_, i) => i + 1),
    countdownOptions: [0, 1, 2, 3, 4],
}

export const TIMER_CONSTANTS = {
    maxMeasuresToStop: 999,
    maxSecondsToStop: 59,
    maxMinutesToStop: 60,
}

export const TEMPO_PROGRAMMING_CONSTANTS = {
    minMeasuresToChangeBPM: 0,
    maxMeasuresToChangeBPM: 999,
    actions: {
        add: "add",
        subtract: "subtract",
    }
}

export const ICON_SIZE = 40;
export const MAIN_ICON_SIZE = 55;

export const LANGUAGE_OPTIONS = ["en", "es", "it", "fr", "de", "pt"];
export const DEFAULT_LANGUAGE = "en";

export const THEMES = {
    dark: "dark",
    light: "light",
};
export const DEFAULT_THEME = THEMES.dark;

const DEFAULT_BEATS_PER_MEASURE = 4;

export const DEFAULT_SETTINGS: Settings = {
    metronomeSettings: {
        bpm: 120,
        beatsPerMeasure: DEFAULT_BEATS_PER_MEASURE,
        noteValue: 4,
        beatTypes: createDefaultBeatTypesArray(DEFAULT_BEATS_PER_MEASURE),
        countdownAmount: 0,
    },
    timerSettings: {
        secondsIsActive: false,
        secondsToStop: 600,
        measuresIsActive: false,
        measuresToStop: 8,
    },
    tempoProgrammingSettings: {
        isActive: false,
        bpmToChange: 10,
        goalBPM: 100,
        measuresToChangeBPM: 4,
        addSubtractOption: TEMPO_PROGRAMMING_CONSTANTS.actions.add,
    }
}