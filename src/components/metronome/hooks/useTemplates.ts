import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    DEFAULT_BEATS_PER_MEASURE,
    DEFAULT_BPM,
    DEFAULT_TEMPO_PROGRAMMING_IS_ACTIVE,
    DEFAULT_COUNTDOWN_AMOUNT,
    DEFAULT_SUBDIVISION,
    DEFAULT_TIMER_MEASURES_IS_ACTIVE,
    DEFAULT_TIMER_MEASURES_TO_STOP,
    DEFAULT_TIMER_SECONDS_IS_ACTIVE,
    DEFAULT_TIMER_SECONDS_TO_STOP,
    DEFAULT_TEMPO_PROGRAMMING_BPM_TO_CHANGE,
    DEFAULT_TEMPO_PROGRAMMING_GOAL_BPM,
    DEFAULT_TEMPO_PROGRAMMING_MEASURES_TO_CHANGE_BPM,
    DEFAULT_TEMPO_PROGRAMMING_ADD_SUBTRACT_OPTION,
} from "../../../utils/constants";
import useSnackbarContext from "../../snackbar/useSnackbarContext";
import type { Template, MetronomeTimerTempoProgrammingFunction, TemplateMetronomeTimerTempoProgrammingFunction } from "../types";
import { createDefaultBeatTypesArray } from "../../../utils/beatTypes";
import { useTranslation } from "react-i18next";

const DEFAULT_TEMPLATE: Template = {
    id: "",
    name: "Default",
    metronomeSettings: {
        bpm: DEFAULT_BPM,
        beatsPerMeasure: DEFAULT_BEATS_PER_MEASURE,
        subdivision: DEFAULT_SUBDIVISION,
        beatTypes: createDefaultBeatTypesArray(DEFAULT_BEATS_PER_MEASURE),
        countdownAmount: DEFAULT_COUNTDOWN_AMOUNT,
    },
    timerSettings: {
        timerSecondsIsActive: DEFAULT_TIMER_SECONDS_IS_ACTIVE,
        timerSecondsToStop: DEFAULT_TIMER_SECONDS_TO_STOP,
        timerMeasuresIsActive: DEFAULT_TIMER_MEASURES_IS_ACTIVE,
        timerMeasuresToStop: DEFAULT_TIMER_MEASURES_TO_STOP,
    },
    tempoProgrammigSettings: {
        tempoProgrammingIsActive: DEFAULT_TEMPO_PROGRAMMING_IS_ACTIVE,
        tempoProgrammingBPMToChange: DEFAULT_TEMPO_PROGRAMMING_BPM_TO_CHANGE,
        tempoProgrammingGoalBPM: DEFAULT_TEMPO_PROGRAMMING_GOAL_BPM,
        tempoProgrammingMeasuresToChangeBPM: DEFAULT_TEMPO_PROGRAMMING_MEASURES_TO_CHANGE_BPM,
        tempoProgrammingAddSubtractOption: DEFAULT_TEMPO_PROGRAMMING_ADD_SUBTRACT_OPTION,
    }
}

const initialTemplates: Template[] = [DEFAULT_TEMPLATE]

const useTemplates = (onTemplateSelectionCallback?: MetronomeTimerTempoProgrammingFunction) => {

    const [templates, setTemplates] = useState(initialTemplates);
    const [selectedTemplateID, setSelectedTemplateID] = useState("");

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const { t } = useTranslation();

    const handleSelectTemplate = (newTemplateID: string) => {
        setSelectedTemplateID(newTemplateID);

        const templateSelected = templates.find((item) => item.id === newTemplateID);
        if (!templateSelected) return;
        if (onTemplateSelectionCallback) {
            onTemplateSelectionCallback(templateSelected.metronomeSettings, templateSelected.timerSettings, templateSelected.tempoProgrammigSettings);
        }
    }

    const handleCreateTemplate: TemplateMetronomeTimerTempoProgrammingFunction = (newtemplateName, newMetronomeSettings, newTimerSettings, newTempoProgrammingSettings) => {
        const newTemplate: Template = {
            id: uuidv4(),
            name: newtemplateName,
            metronomeSettings: newMetronomeSettings,
            timerSettings: newTimerSettings,
            tempoProgrammigSettings: newTempoProgrammingSettings,
        }

        setTemplates((prev) => [...prev, newTemplate]);
        setSelectedTemplateID(newTemplate.id);
        handleOpenSnackbar(t("templateCreated"), 0, "success");
    }

    const handleUpdateTemplate: MetronomeTimerTempoProgrammingFunction = (newMetronomeSettings, newTimerSettings, newTempoProgrammingSettings) => {
        const selectedTemplateIndex = templates.findIndex((template) => template.id === selectedTemplateID);
        if (selectedTemplateIndex === -1) return;

        const auxTemplates = [...templates];
        const auxSelectedTemplate = auxTemplates[selectedTemplateIndex];

        auxSelectedTemplate.metronomeSettings = newMetronomeSettings;
        auxSelectedTemplate.timerSettings = newTimerSettings;
        auxSelectedTemplate.tempoProgrammigSettings = newTempoProgrammingSettings;

        setTemplates(auxTemplates);
        handleOpenSnackbar(t("templateUpdated"), 0, "success");
    }

    const handleDeleteTemplate = () => {
        const newTemplates = templates.filter((template) => template.id !== selectedTemplateID);
        setTemplates(newTemplates);
        setSelectedTemplateID("");
        handleOpenSnackbar(t("templateDeleted"), 0, "success");
    }

    return {
        templates,
        selectedTemplateID,
        handleSelectTemplate,
        handleCreateTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
    };
}

export default useTemplates;