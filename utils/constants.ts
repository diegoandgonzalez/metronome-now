import type { Settings } from '@/utils/types';
import { createDefaultBeatTypesArray } from '@/utils/helpers';

export const URLS = {
    google: {
        account: 'https://myaccount.google.com',
        apis: {
            drive: {
                root: 'https://www.googleapis.com/drive/v3',
                upload: 'https://www.googleapis.com/upload/drive/v3',
            },
            token: 'https://oauth2.googleapis.com/token',
            scopes: [
                "openid",
                "email",
                "profile",
                "https://www.googleapis.com/auth/drive.appdata",
            ].join(" "),
        }
    }
}

export const METRONOME_CONSTANTS = {
    beatTypesAmount: 3, // number of different types of beat types
    stoppedBeatIndex: -1,
    minBPM: 30,
    maxBPM: 360,
    noteValueOptions: [2, 4, 8, 16],
    beatsPerMeasureOptions: Array.from({ length: 16 }, (_, i) => i + 1),
    countdownOptions: [0, 1, 2, 3, 4],
}

export const TIMER_CONSTANTS = {
    maxMeasuresToStop: 99,
    maxSecondsToStop: 59,
    maxMinutesToStop: 99,
}

export const TEMPO_PROGRAMMING_CONSTANTS = {
    minBPMToChange: 1,
    maxBPMToChange: METRONOME_CONSTANTS.maxBPM,
    minMeasuresToChangeBPM: 1,
    maxMeasuresToChangeBPM: 999,
}

export const TEMPLATE_NAME_MAX_LENGTH = 40;

export const LOCALES = ['en', 'es'];

const DEFAULT_BEATS_PER_MEASURE = 4;

export const DEFAULT_SETTINGS: Settings = {
    metronomeSettings: {
        bpm: 120,
        beatsPerMeasure: DEFAULT_BEATS_PER_MEASURE,
        noteValue: 4,
        beatTypes: createDefaultBeatTypesArray(DEFAULT_BEATS_PER_MEASURE),
        countdownLength: 0,
    },
    timerSettings: {
        isTimeActive: false,
        secondsToStop: 600,
        isMeasuresActive: false,
        measuresToStop: 8,
    },
    tempoProgrammingSettings: {
        isActive: false,
        isLoop: false,
        bpmToChange: 10,
        measuresToChangeBPM: 4,
        fromBPM: 100,
        toBPM: 150,
    }
}

export const LOCAL_STORAGE_KEYS = {
    bpm: 'mn_bpm',
    template: 'mn_template',
    countdownLength: 'mn_countdown_length',
    beatsPerMeasure: 'mn_beats_per_measure',
    noteValue: 'mn_note_value',
    beatTypes: 'mn_beat_types',
    timerIsTimeActive: 'mn_timer_is_time_active',
    timerIsMeasuresActive: 'mn_timer_is_measures_active',
    timerSecondsToStop: 'mn_timer_seconds_to_stop',
    timerMeasuresToStop: 'mn_timer_measures_to_stop',
    tempoProgrammingIsActive: 'mn_tp_is_active',
    tempoProgrammingIsLoop: 'mn_tp_is_loop',
    tempoProgrammingBPMToChange: 'mn_tp_bpm_to_change',
    tempoProgrammingMeasuresToChangeBPM: 'mn_tp_measures_to_change_bpm',
    tempoProgrammingFromBPM: 'mn_tp_from_bpm',
    tempoProgrammingToBPM: 'mn_tp_to_bpm',
};
