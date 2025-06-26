export const LOOK_AHEAD = 25; // ms

export const DEFAULT_COUNTDOWN_AMOUNT = 0;
export const COUNTDOWN_OPTIONS = [0, 1, 2, 3, 4];

export const ADD_OPTION = "add";
export const SUBTRACT_OPTION = "subtract";
export const ADD_SUBTRACT_OPTIONS = [ADD_OPTION, SUBTRACT_OPTION];

/**
 * Number of different types of beat types
 */
export const BEAT_TYPES_AMOUNT = 3;

export const BEATS_PER_MEASURE_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 1);
export const NOTE_VALUE_OPTIONS = [2, 4, 8, 16];

export const DEFAULT_BPM = 120;
export const MIN_BPM = 30;
export const MAX_BPM = 360;

export const STOPPED_METRONOME_BEAT_INDEX = -1;

export const DEFAULT_BEATS_PER_MEASURE = 4;
export const DEFAULT_NOTE_VALUE = 4;

export const DEFAULT_TIMER_SECONDS_IS_ACTIVE = false;
export const DEFAULT_TIMER_MEASURES_IS_ACTIVE = false;
export const DEFAULT_TIMER_MEASURES_TO_STOP = 8;
export const DEFAULT_TIMER_SECONDS_TO_STOP = 600;
export const MAX_MEASURES_TO_STOP = 999;
export const MAX_SECONDS_TO_STOP = 59;
export const MAX_MINUTES_TO_STOP = 60;

export const DEFAULT_TEMPO_PROGRAMMING_IS_ACTIVE = false;
export const DEFAULT_TEMPO_PROGRAMMING_BPM_TO_CHANGE = 10;
export const DEFAULT_TEMPO_PROGRAMMING_GOAL_BPM = 100;
export const DEFAULT_TEMPO_PROGRAMMING_ADD_SUBTRACT_OPTION = ADD_OPTION;
export const DEFAULT_TEMPO_PROGRAMMING_MEASURES_TO_CHANGE_BPM = 4;
export const MIN_TEMPO_PROGRAMMING_MEASURES_TO_CHANGE_BPM = 0;
export const MAX_TEMPO_PROGRAMMING_MEASURES_TO_CHANGE_BPM = 999;

export const ICON_SIZE = 40;
export const MAIN_ICON_SIZE = 55;

export const THEMES = {
    dark: "dark",
    light: "light",
};
export const DEFAULT_THEME = THEMES.dark;
export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_OPTIONS = ["en", "es", "it", "fr", "de", "pt"];