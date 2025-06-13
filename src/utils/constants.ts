export const LOOK_AHEAD = 25; // ms

export const MIN_BPM = 30;
export const MAX_BPM = 360;
export const DEFAULT_BPM = 120;

export const MIN_VOLUME = 0;
export const MAX_VOLUME = 200;
export const DEFAULT_VOLUME = 100;

export const STOPPED_METRONOME_BEAT_INDEX = -1;

export const DEFAULT_BEATS_PER_MEASURE = 4;
export const DEFAULT_SUBDIVISION = 4;

export const DEFAULT_TIMER_IS_ACTIVE = false;
export const DEFAULT_SECONDS_TO_STOP = 60;

export const DEFAULT_BPM_PROGRAMMING_IS_ACTIVE = false;
export const DEFAULT_BPM_TO_CHANGE = 10;
export const DEFAULT_GOAL_BPM = 100;

export const MIN_MEASURES_TO_CHANGE_BPM = 0;
export const MAX_MEASURES_TO_CHANGE_BPM = 100;
export const DEFAULT_MEASURES_TO_CHANGE_BPM = 4;

export const ICON_SIZE = 40;
export const MAIN_ICON_SIZE = 60;

/**
 * Number of different types of beat types
 */
export const BEAT_TYPES_AMOUNT = 3;

export const BEATS_PER_MEASURE = Array.from({ length: 16 }, (_, i) => i + 1);
export const SUBDIVISIONS = [2, 4, 8, 16];

export const ADD_OPTION = "add";
export const SUBTRACT_OPTION = "subtract";
export const ADD_SUBTRACT_ARRAY = [ADD_OPTION, SUBTRACT_OPTION];

export const DEFAULT_THEME = "dark";
export const DEFAULT_LANGUAGE = "en";