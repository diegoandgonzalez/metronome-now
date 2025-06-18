import { useState } from "react";
import Dialog from "../../../dialog/dialog";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";
import { MAX_MEASURES_TO_STOP, MAX_MINUTES_TO_STOP, MAX_SECONDS_TO_STOP } from "../../../../utils/constants";

type Props = {
    open: boolean,
    initialSecondsIsActive: boolean
    initialMeasuresIsActive: boolean
    initialSecondsToStop: number,
    initialMeasuresToStop: number,
    handleSetTimer: (seconds: number, secondsIsActive: boolean, measures: number, measuresIsActive: boolean) => void,
    handleClose: () => void,
}

const getMeasuresProgrammingValidation = (formattedMeasures: number) => {
    if (!formattedMeasures || formattedMeasures < 0) {
        return {
            isValid: false,
            error: "measuresMustBePositiveValue",
        };
    }

    return { isValid: true, error: "" };
}

const getSecondsProgrammingValidation = (formattedMinutes: number, formattedSeconds: number) => {
    if (!formattedSeconds && !formattedMinutes) {
        return {
            isValid: false,
            error: "timeCannotBeEmpty",
        };
    }

    if (formattedSeconds < 0 || formattedMinutes < 0) {
        return {
            isValid: false,
            error: "timeMustBePositiveValue",
        };
    }

    return { isValid: true, error: "" };
}

const TimerDialog = (props: Props) => {

    const {
        open,
        initialSecondsIsActive,
        initialMeasuresIsActive,
        initialSecondsToStop,
        initialMeasuresToStop,
        handleSetTimer,
        handleClose,
    } = props;

    const { t } = useTranslation();

    const [isSecondsActive, setIsSecondsActive] = useState(initialSecondsIsActive);
    const [isMeasuresActive, setIsMeasuresActive] = useState(initialMeasuresIsActive);
    const [seconds, setSeconds] = useState<number | string>(initialSecondsToStop % 60);
    const [minutes, setMinutes] = useState<number | string>(Math.floor(initialSecondsToStop / 60));
    const [measures, setMeasures] = useState<number | string>(initialMeasuresToStop);

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const handleSubmit = () => {
        const formattedSeconds = Math.round(Number(seconds));
        const formattedMinutes = Math.round(Number(minutes));
        const formattedMeasures = Math.round(Number(measures));
        const totalSeconds = formattedMinutes * 60 + formattedSeconds;

        const {
            isValid: secondsProgrammingIsValid,
            error: secondsProgrammingError,
        } = getSecondsProgrammingValidation(formattedMinutes, formattedSeconds);

        if (!secondsProgrammingIsValid) {
            handleOpenSnackbar(t(secondsProgrammingError));
            return;
        }

        const {
            isValid: measuresProgrammingIsValid,
            error: measuresProgrammingError,
        } = getMeasuresProgrammingValidation(formattedMeasures);

        if (!measuresProgrammingIsValid) {
            handleOpenSnackbar(t(measuresProgrammingError));
            return;
        }

        handleSetTimer(totalSeconds, isSecondsActive, formattedMeasures, isMeasuresActive);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            title={t("timer")}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <label
                className="checkboxContainer"
                htmlFor="timerIsSecondsActive"
            >
                <input
                    type="checkbox"
                    id="timerIsSecondsActive"
                    checked={isSecondsActive}
                    onChange={() => {
                        setIsSecondsActive((prev) => !prev);
                        setIsMeasuresActive(false);
                    }}
                />
                <span>
                    {t("stopIn")}
                    <input
                        className="dialogInput"
                        type="number"
                        min={0}
                        max={MAX_MINUTES_TO_STOP}
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value.substring(0, 2))}
                        autoComplete="off"
                    />
                    {t("minutes")}
                    <input
                        className="dialogInput"
                        type="number"
                        min={0}
                        max={MAX_SECONDS_TO_STOP}
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value.substring(0, 2))}
                        autoComplete="off"
                    />
                    {t("seconds")}
                </span>
            </label>
            <label
                className="checkboxContainer"
                htmlFor="timerIsMeasuresActive"
            >
                <input
                    type="checkbox"
                    id="timerIsMeasuresActive"
                    checked={isMeasuresActive}
                    onChange={() => {
                        setIsMeasuresActive((prev) => !prev);
                        setIsSecondsActive(false);
                    }}
                />
                <span>
                    {t("stopIn")}
                    <input
                        className="dialogInput"
                        type="number"
                        min={0}
                        max={MAX_MEASURES_TO_STOP}
                        value={measures}
                        onChange={(e) => setMeasures(e.target.value.substring(0, 3))}
                        autoComplete="off"
                    />
                    {t("measures")}
                </span>
            </label>
        </Dialog>
    );
}

export default TimerDialog;