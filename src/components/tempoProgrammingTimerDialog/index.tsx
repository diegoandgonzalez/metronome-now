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

    const [isTempoProgrammingActive, setIsTempoProgrammingActive] = useState<boolean>(initialTempoProgrammingSettings.isActive);
    const [isLoop, setIsLoop] = useState<boolean>(initialTempoProgrammingSettings.isLoop);
    const [bpmToChange, setBPMToChange] = useState<number | string>(initialTempoProgrammingSettings.bpmToChange);
    const [measuresToChangeBPM, setMeasuresToChangeBPM] = useState<number | string>(initialTempoProgrammingSettings.measuresToChangeBPM);
    const [fromBPM, setFromBPM] = useState<number | string>(initialTempoProgrammingSettings.fromBPM);
    const [toBPM, setToBPM] = useState<number | string>(initialTempoProgrammingSettings.toBPM);

    const [isSecondsActive, setIsSecondsActive] = useState(initialTimerSettings.secondsIsActive);
    const [isMeasuresActive, setIsMeasuresActive] = useState(initialTimerSettings.measuresIsActive);
    const [seconds, setSeconds] = useState<number | string>(initialTimerSettings.secondsToStop % 60);
    const [minutes, setMinutes] = useState<number | string>(Math.floor(initialTimerSettings.secondsToStop / 60));
    const [measures, setMeasures] = useState<number | string>(initialTimerSettings.measuresToStop);

    const handleSubmit = () => {
        const formattedBPMToChange = Math.round(Number(bpmToChange));
        const formattedFromBPM = Math.round(Number(fromBPM));
        const formattedToBPM = Math.round(Number(toBPM));
        const formattedMeasuresToChangeBPM = Math.round(Number(measuresToChangeBPM));

        const formattedSeconds = Math.round(Number(seconds));
        const formattedMinutes = Math.round(Number(minutes));
        const formattedMeasures = Math.round(Number(measures));
        const totalSeconds = formattedMinutes * 60 + formattedSeconds;

        // TODO: validar que el from y el to no sean igual

        if (formattedBPMToChange < 0) {
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

        if (!formattedFromBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeEmpty")); // TODO
            return;
        }

        if (!formattedToBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeEmpty")); // TODO
            return;
        }

        if (formattedFromBPM < METRONOME_CONSTANTS.minBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeLessThan", { value: METRONOME_CONSTANTS.minBPM })); // TODO
            return;
        }

        if (formattedFromBPM > METRONOME_CONSTANTS.maxBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeGreaterThan", { value: METRONOME_CONSTANTS.maxBPM })); // TODO
            return;
        }

        if (formattedToBPM < METRONOME_CONSTANTS.minBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeLessThan", { value: METRONOME_CONSTANTS.minBPM })); // TODO
            return;
        }

        if (formattedToBPM > METRONOME_CONSTANTS.maxBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeGreaterThan", { value: METRONOME_CONSTANTS.maxBPM })); // TODO
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
            isActive: isTempoProgrammingActive,
            bpmToChange: formattedBPMToChange,
            measuresToChangeBPM: formattedMeasuresToChangeBPM,
            fromBPM: formattedFromBPM,
            toBPM: formattedToBPM,
            isLoop: isLoop,
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
                            id="isTempoProgrammingActive"
                            type="checkbox"
                            checked={isTempoProgrammingActive}
                            onChange={() => setIsTempoProgrammingActive((prev) => !prev)}
                        />
                        {t("isActive")}
                    </label>
                    <label>
                        <input
                            id="fromBPM"
                            type="number"
                            min={METRONOME_CONSTANTS.minBPM}
                            max={METRONOME_CONSTANTS.maxBPM}
                            value={fromBPM}
                            onChange={(e) => setFromBPM(e.target.value.substring(0, 3))}
                            autoComplete="off"
                        />
                        {t("bpmTo")}
                        <label>
                            <input
                                id="toBPM"
                                type="number"
                                min={METRONOME_CONSTANTS.minBPM}
                                max={METRONOME_CONSTANTS.maxBPM}
                                value={toBPM}
                                onChange={(e) => setToBPM(e.target.value.substring(0, 3))}
                                autoComplete="off"
                            />
                            {t("bpm")}
                        </label>
                    </label>
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
                        {t("measuresFrom")}
                    </label>
                    <label>
                        <input
                            id="isLoop"
                            type="checkbox"
                            checked={isLoop}
                            onChange={() => setIsLoop((prev) => !prev)}
                        />
                        {t("isLoop")}
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