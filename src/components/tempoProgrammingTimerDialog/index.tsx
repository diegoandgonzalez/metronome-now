import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TempoProgrammingSettings, TimerSettings } from "../../utils/types";
import { METRONOME_CONSTANTS, TEMPO_PROGRAMMING_CONSTANTS, TIMER_CONSTANTS } from "../../utils/constants";
import useSnackbarContext from "../snackbar/useSnackbarContext";
import FormDialog from "../dialog/formDialog";
import styles from "./tempoProgrammingTimerDialog.module.css";

type Props = {
    open: boolean,
    initialTempoProgrammingSettings: TempoProgrammingSettings,
    initialTimerSettings: TimerSettings,
    handleSetTempoProgrammingSettings: (newSettings: TempoProgrammingSettings) => void,
    handleSetTimerSettings: (newSettings: TimerSettings) => void,
    handleClose: () => void,
}

const TempoProgrammingTimerDialog = (props: Props) => {

    const {
        open,
        initialTempoProgrammingSettings,
        initialTimerSettings,
        handleSetTempoProgrammingSettings,
        handleSetTimerSettings,
        handleClose,
    } = props;

    const { t } = useTranslation();

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const [isActive, setIsActive] = useState(initialTempoProgrammingSettings.isActive);
    const [action, setAction] = useState<string>(initialTempoProgrammingSettings.action);
    const [bpmToChange, setBPMToChange] = useState<number | string>(initialTempoProgrammingSettings.bpmToChange);
    const [measuresToChangeBPM, setMeasuresToChangeBPM] = useState<number | string>(initialTempoProgrammingSettings.measuresToChangeBPM);
    const [goalBPM, setGoalBPM] = useState<number | string>(initialTempoProgrammingSettings.goalBPM);

    const [isSecondsActive, setIsSecondsActive] = useState(initialTimerSettings.secondsIsActive);
    const [isMeasuresActive, setIsMeasuresActive] = useState(initialTimerSettings.measuresIsActive);
    const [seconds, setSeconds] = useState<number | string>(initialTimerSettings.secondsToStop % 60);
    const [minutes, setMinutes] = useState<number | string>(Math.floor(initialTimerSettings.secondsToStop / 60));
    const [measures, setMeasures] = useState<number | string>(initialTimerSettings.measuresToStop);

    const handleSubmit = () => {
        const formattedBPMToChange = Math.round(Number(bpmToChange));
        const formattedGoalBPM = Math.round(Number(goalBPM));
        const formattedMeasuresToChangeBPM = Math.round(Number(measuresToChangeBPM));

        const formattedSeconds = Math.round(Number(seconds));
        const formattedMinutes = Math.round(Number(minutes));
        const formattedMeasures = Math.round(Number(measures));
        const totalSeconds = formattedMinutes * 60 + formattedSeconds;

        if (formattedBPMToChange < 0 && action === TEMPO_PROGRAMMING_CONSTANTS.actions.add) {
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
            action: action,
            bpmToChange: formattedBPMToChange,
            measuresToChangeBPM: formattedMeasuresToChangeBPM,
            goalBPM: formattedGoalBPM,
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
            <div className={styles.tempoProgrammingTimerContainer}>
                <fieldset className={styles.inputContainer}>
                    <legend>{t("bpmProgramming")}</legend>
                    <label>
                        <input
                            id="tempoProgrammingIsActive"
                            type="checkbox"
                            checked={isActive}
                            onChange={() => setIsActive((prev) => !prev)}
                            title={t(isActive ? "clickToTurnOffProgramming" : "clickToTurnOnProgramming")}
                        />
                        {t("tempoProgrammingIsActive")}
                    </label>
                    <select
                        id="addSubtractOption"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        title={t("selectHowBPMchanges")}
                    >
                        {
                            [
                                TEMPO_PROGRAMMING_CONSTANTS.actions.add,
                                TEMPO_PROGRAMMING_CONSTANTS.actions.subtract,
                                TEMPO_PROGRAMMING_CONSTANTS.actions.loop,
                            ]
                                .map((option) => {
                                    return (
                                        <option key={option} value={option}>
                                            {t(option)}
                                        </option>
                                    )
                                })
                        }
                    </select>
                    <label>
                        <input
                            id="bpmToChange"
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
                            id="measuresToChangeBPM"
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
                            id="goalBPM" // TODO: if it's loop make two inputs
                            type="number"
                            min={METRONOME_CONSTANTS.minBPM}
                            max={METRONOME_CONSTANTS.maxBPM}
                            value={goalBPM}
                            onChange={(e) => setGoalBPM(e.target.value.substring(0, 3))}
                            autoComplete="off"
                        />
                        {t("bpm")}
                    </label>
                </fieldset>
                <fieldset className={styles.inputContainer}>
                    <legend>{t("timer")}</legend>
                    <label>
                        <input
                            id="isSecondsActive"
                            type="checkbox"
                            checked={isSecondsActive}
                            onChange={() => {
                                setIsSecondsActive((prev) => !prev);
                                setIsMeasuresActive(false);
                            }}
                        />
                        {t("stopIn")}
                        <input
                            id="minutes"
                            type="number"
                            min={0}
                            max={TIMER_CONSTANTS.maxMinutesToStop}
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value.substring(0, 2))}
                            autoComplete="off"
                        />
                        {t("minutes")}
                        <input
                            id="seconds"
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
                            id="isMeasuresActive"
                            type="checkbox"
                            checked={isMeasuresActive}
                            onChange={() => {
                                setIsMeasuresActive((prev) => !prev);
                                setIsSecondsActive(false);
                            }}
                        />
                        {t("stopIn")}
                        <input
                            id="measures"
                            type="number"
                            min={0}
                            max={TIMER_CONSTANTS.maxMeasuresToStop}
                            value={measures}
                            onChange={(e) => setMeasures(e.target.value.substring(0, 3))}
                            autoComplete="off"
                        />
                        {t("measures")}
                    </label>
                </fieldset>
            </div>
        </FormDialog>
    );
}

export default TempoProgrammingTimerDialog;