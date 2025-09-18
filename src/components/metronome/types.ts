export type MetronomeSettings = {
    bpm: number,
    beatsPerMeasure: number,
    noteValue: number,
    beatTypes: number[],
    countdownAmount: number,
}

export type TimerSettings = {
    secondsIsActive: boolean,
    secondsToStop: number,
    measuresIsActive: boolean,
    measuresToStop: number,
}

export type TempoProgrammingSettings = {
    isActive: boolean,
    bpmToChange: number,
    goalBPM: number,
    measuresToChangeBPM: number,
    addSubtractOption: string,
}

export type Settings = {
    metronomeSettings: MetronomeSettings,
    timerSettings: TimerSettings,
    tempoProgrammingSettings: TempoProgrammingSettings,
}

export type Template = {
    id: string,
    name: string,
    settings: Settings,
}

export type SettingsFunction = (newSettings?: Settings) => void;
export type TemplateFunction = (newTemplateName: string, newSettings: Settings) => void;