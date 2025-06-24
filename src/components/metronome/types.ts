export type MetronomeSettings = {
    bpm: number,
    beatsPerMeasure: number,
    subdivision: number,
    beatTypes: number[],
    countdownAmount: number,
}

export type TimerSettings = {
    timerSecondsIsActive: boolean,
    timerSecondsToStop: number,
    timerMeasuresIsActive: boolean,
    timerMeasuresToStop: number,
}

export type TempoProgrammingSettings = {
    tempoProgrammingIsActive: boolean,
    tempoProgrammingBPMToChange: number,
    tempoProgrammingGoalBPM: number,
    tempoProgrammingMeasuresToChangeBPM: number,
    tempoProgrammingAddSubtractOption: string,
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