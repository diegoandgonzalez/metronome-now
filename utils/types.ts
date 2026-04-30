import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

export type MetronomeSettings = {
    bpm: number,
    beatsPerMeasure: number,
    noteValue: number,
    beatTypes: number[],
    countdownLength: number,
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
    metronomeSettings: MetronomeSettings,
    timerSettings: TimerSettings,
    tempoProgrammingSettings: TempoProgrammingSettings,
}

export type Template = {
    name: string,
    settings: Settings,
}

export type TemplateFunction = (newTemplateName: string, newSettings: Settings) => void;

export type TemplateFormAction = 'CREATE' | 'RENAME' | 'UPDATE' | 'DELETE' | 'DUPLICATE';
export type TemplateFormData = | { action: 'CREATE'; templateName: '' } | { action: Exclude<TemplateFormAction, 'CREATE'>; templateName: string };

export type GoogleDriveFileList = { id: string; name: string, modifiedTime: string }[];
export type FileToCreate = { name: string, content: object | string };

export type LocalStorageValue = string | number | number[] | boolean | object;
export type LocalStorageKey = typeof LOCAL_STORAGE_KEYS[keyof typeof LOCAL_STORAGE_KEYS];