export type MetronomeSettings = {
    bpm: number,
    beatsPerMeasure: number,
    noteValue: number,
    beatTypes: number[],
    countdownLength: number,
}

export type TimerSettings = {
    secondsIsActive: boolean,
    secondsToStop: number,
    measuresIsActive: boolean,
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
    id: string,
    name: string,
    settings: Settings,
}

export type TemplateFunction = (newTemplateName: string, newSettings: Settings) => void;

export type TemplateFormAction = "CREATE" | "RENAME" | "UPDATE" | "DELETE" | "DUPLICATE";
export type TemplateFormData = | { action: "CREATE"; templateId: "" } | { action: Exclude<TemplateFormAction, "CREATE">; templateId: string };

export type Theme = "dark" | "light";