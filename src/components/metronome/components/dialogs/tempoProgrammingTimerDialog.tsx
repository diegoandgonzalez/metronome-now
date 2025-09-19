import { useState } from "react";
import { useTranslation } from "react-i18next";
import { METRONOME_CONSTANTS, TEMPO_PROGRAMMING_CONSTANTS, TIMER_CONSTANTS } from "../../../../utils/constants";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import FormDialog from "../../../dialog/formDialog";
import type { TempoProgrammingSettings, TimerSettings } from "../../types";

type Props = {
    open: boolean,
    handleClose: () => void,

    initialAddSubtractOption: string,
    initialIsActive: boolean
    initialBPMToChange: number,
    initialGoalBPM: number,
    initialMeasuresToChangeBPM: number,
    handleSetTempoProgrammingSettings: (newSettings: TempoProgrammingSettings) => void,

    initialSecondsIsActive: boolean
    initialMeasuresIsActive: boolean
    initialSecondsToStop: number,
    initialMeasuresToStop: number,
    handleSetTimerSettings: (newSettings: TimerSettings) => void,
}

const TempoProgrammingTimerDialog = (props: Props) => {

    const {
        open,
        handleClose,
        initialIsActive,
        initialAddSubtractOption,
        initialBPMToChange,
        initialGoalBPM,
        initialMeasuresToChangeBPM,
        handleSetTempoProgrammingSettings,
        initialSecondsIsActive,
        initialMeasuresIsActive,
        initialSecondsToStop,
        initialMeasuresToStop,
        handleSetTimerSettings,
    } = props;

    const { t } = useTranslation();

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const [isActive, setIsActive] = useState(initialIsActive);
    const [bpmToChange, setBPMToChange] = useState<number | string>(initialBPMToChange);
    const [goalBPM, setGoalBPM] = useState<number | string>(initialGoalBPM);
    const [measuresToChangeBPM, setMeasuresToChangeBPM] = useState<number | string>(initialMeasuresToChangeBPM);
    const [addSubtractOption, setAddSubtractOption] = useState<string>(initialAddSubtractOption);

    const [isSecondsActive, setIsSecondsActive] = useState(initialSecondsIsActive);
    const [isMeasuresActive, setIsMeasuresActive] = useState(initialMeasuresIsActive);
    const [seconds, setSeconds] = useState<number | string>(initialSecondsToStop % 60);
    const [minutes, setMinutes] = useState<number | string>(Math.floor(initialSecondsToStop / 60));
    const [measures, setMeasures] = useState<number | string>(initialMeasuresToStop);


    const handleSubmit = () => {
        const formattedBPMToChange = Math.round(Number(bpmToChange));
        const formattedGoalBPM = Math.round(Number(goalBPM));
        const formattedMeasuresToChangeBPM = Math.round(Number(measuresToChangeBPM));

        const formattedSeconds = Math.round(Number(seconds));
        const formattedMinutes = Math.round(Number(minutes));
        const formattedMeasures = Math.round(Number(measures));
        const totalSeconds = formattedMinutes * 60 + formattedSeconds;

        if (formattedBPMToChange < 0 && addSubtractOption === TEMPO_PROGRAMMING_CONSTANTS.actions.add) {
            handleOpenSnackbar(t("bpmToChangeCannotBeNegative"));
            return;
        }

        if (formattedBPMToChange < (METRONOME_CONSTANTS.maxBPM * -1)) {
            handleOpenSnackbar(t("bpmToChangeCannotBeLessThan", { value: METRONOME_CONSTANTS.maxBPM * -1 }));
            return;
        }

        if (formattedBPMToChange > METRONOME_CONSTANTS.maxBPM) {
            handleOpenSnackbar(t("bpmToChangeCannotBeGreaterThan", { value: METRONOME_CONSTANTS.maxBPM }));
            return;
        }

        if (formattedMeasuresToChangeBPM < 0) {
            handleOpenSnackbar(t("measuresToChangeBPMCannotBeNegative"));
            return;
        }

        if (formattedMeasuresToChangeBPM > TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM) {
            handleOpenSnackbar(t("measuresToChangeBPMHasToBeLessThan", { value: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM }));
            return;
        }

        if (!formattedGoalBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeEmpty"));
            return;
        }

        if (formattedGoalBPM < METRONOME_CONSTANTS.minBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeLessThan", { value: METRONOME_CONSTANTS.minBPM }));
            return;
        }

        if (formattedGoalBPM > METRONOME_CONSTANTS.maxBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeGreaterThan", { value: METRONOME_CONSTANTS.maxBPM }));
            return;
        }

        if (!formattedSeconds && !formattedMinutes) {
            handleOpenSnackbar(t("timeCannotBeEmpty"));
            return;
        }

        if (formattedSeconds < 0 || formattedMinutes < 0) {
            handleOpenSnackbar(t("timeMustBePositiveValue"));
            return;
        }

        if (!formattedMeasures || formattedMeasures < 0) {
            handleOpenSnackbar(t("measuresMustBePositiveValue"));
            return;
        }

        const newTempoProgrammingSettings = {
            isActive: isActive,
            bpmToChange: formattedBPMToChange,
            goalBPM: formattedGoalBPM,
            measuresToChangeBPM: formattedMeasuresToChangeBPM,
            addSubtractOption: addSubtractOption,
        }

        const newTimerSettings = {
            secondsIsActive: isSecondsActive,
            secondsToStop: totalSeconds,
            measuresIsActive: isMeasuresActive,
            measuresToStop: formattedMeasures,
        }

        handleSetTimerSettings(newTimerSettings);
        handleSetTempoProgrammingSettings(newTempoProgrammingSettings);
        handleClose();
    }

    return (
        <FormDialog
            open={open}
            title={t("settings")}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <h4>{t("bpmProgramming")}</h4>
            <label>
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => {
                        e.currentTarget.blur();
                        setIsActive((prev) => !prev);
                    }}
                    title={t(isActive ? "clickToTurnOffProgramming" : "clickToTurnOnProgramming")}
                />
                {t("tempoProgrammingIsActive")}
            </label>
            <select
                value={addSubtractOption}
                onChange={(e) => {
                    e.currentTarget.blur();
                    setAddSubtractOption(e.target.value);
                }}
                title={t("selectHowBPMchanges")}
            >
                {
                    [TEMPO_PROGRAMMING_CONSTANTS.actions.add, TEMPO_PROGRAMMING_CONSTANTS.actions.subtract]
                        .map((item) => {
                            return (
                                <option key={item} value={item}>{t(item)}</option>
                            )
                        })
                }
            </select>
            <label>
                <input
                    className="dialogInput"
                    type="number"
                    min={0}
                    max={METRONOME_CONSTANTS.maxBPM}
                    value={bpmToChange}
                    onChange={(e) => setBPMToChange(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("bpmEvery")}
            </label>
            <label>
                <input
                    className="dialogInput"
                    type="number"
                    min={TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM}
                    max={TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM}
                    value={measuresToChangeBPM}
                    onChange={(e) => setMeasuresToChangeBPM(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("measuresUntil")}
            </label>
            <label>
                <input
                    className="dialogInput"
                    type="number"
                    min={METRONOME_CONSTANTS.minBPM}
                    max={METRONOME_CONSTANTS.maxBPM}
                    value={goalBPM}
                    onChange={(e) => setGoalBPM(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("bpm")}
            </label>
            <h4>{t("timer")}</h4>
            <label>
                <input
                    type="checkbox"
                    checked={isSecondsActive}
                    onChange={(e) => {
                        e.currentTarget.blur();
                        setIsSecondsActive((prev) => !prev);
                        setIsMeasuresActive(false);
                    }}
                />
                {t("stopIn")}
                <input
                    className="dialogInput"
                    type="number"
                    min={0}
                    max={TIMER_CONSTANTS.maxMinutesToStop}
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value.substring(0, 2))}
                    autoComplete="off"
                />
                {t("minutes")}
                <input
                    className="dialogInput"
                    type="number"
                    min={0}
                    max={TIMER_CONSTANTS.maxSecondsToStop}
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value.substring(0, 2))}
                    autoComplete="off"
                />
                {t("seconds")}
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={isMeasuresActive}
                    onChange={(e) => {
                        e.currentTarget.blur();
                        setIsMeasuresActive((prev) => !prev);
                        setIsSecondsActive(false);
                    }}
                />
                {t("stopIn")}
                <input
                    className="dialogInput"
                    type="number"
                    min={0}
                    max={TIMER_CONSTANTS.maxMeasuresToStop}
                    value={measures}
                    onChange={(e) => setMeasures(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("measures")}
            </label>
        </FormDialog >
    );
}

export default TempoProgrammingTimerDialog;