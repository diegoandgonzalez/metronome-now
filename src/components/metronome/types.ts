export type MetronomeSettings = {
    bpm: number,
    beatsPerMeasure: number,
    subdivision: number,
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

export type Template = {
    id: string,
    name: string,
    metronomeSettings: MetronomeSettings,
    timerSettings: TimerSettings,
    tempoProgrammigSettings: TempoProgrammingSettings,
}

export type MetronomeTimerTempoProgrammingFunction = (
    newMetronomeSettings: MetronomeSettings,
    newTimerSettings: TimerSettings,
    newTempoProgrammingSettings: TempoProgrammingSettings
) => void;

export type TemplateMetronomeTimerTempoProgrammingFunction = (
    newTemplateName: string,
    newMetronomeSettings: MetronomeSettings,
    newTimerSettings: TimerSettings,
    newTempoProgrammingSettings: TempoProgrammingSettings
) => void;