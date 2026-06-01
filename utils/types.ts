import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

export type MetronomeSettings = {
    bpm: number,
    beatsPerMeasure: number,
    noteValue: number,
    beatTypes: number[],
}

export type TimerSettings = {
    isTimeActive: boolean,
    secondsToStop: number,
    isMeasuresActive: boolean,
    measuresToStop: number,
}

export type TempoProgrammingSettings = {
    isActive: boolean,
    isLoop: boolean,
    bpmToChange: number,
    measuresToChangeBPM: number,
    fromBPM: number,
    toBPM: number,
}

export type Settings = {
    countdownLength: number,
    metronomeSettings: MetronomeSettings,
    timerSettings: TimerSettings,
    tempoProgrammingSettings: TempoProgrammingSettings,
}

export type Template = {
    name: string,
    settings: Settings,
}

export type TemplateFormAction = 'CREATE' | 'RENAME' | 'UPDATE' | 'DELETE' | 'DUPLICATE';
export type TemplateFormData = | { action: 'CREATE'; templateName: '' } | { action: Exclude<TemplateFormAction, 'CREATE'>; templateName: string };

export type LocalStorageValue = string | number | number[] | boolean | object;
export type LocalStorageKey = typeof LOCAL_STORAGE_KEYS[keyof typeof LOCAL_STORAGE_KEYS];