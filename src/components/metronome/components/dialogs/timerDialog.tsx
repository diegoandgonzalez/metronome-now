import { useState } from "react";
import Dialog from "../../../dialog/dialog";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";
import { MAX_MINUTES_TO_STOP, MAX_SECONDS_TO_STOP } from "../../../../utils/constants";

type Props = {
    open: boolean,
    initialIsActive: boolean
    initialSecondsToStop: number,
    handleSetTimer: (amount: number, isActive: boolean) => void,
    handleClose: () => void,
}

const TimerDialog = (props: Props) => {

    const {
        open,
        initialIsActive,
        initialSecondsToStop,
        handleSetTimer,
        handleClose,
    } = props;

    const { t } = useTranslation();

    const [isActive, setIsActive] = useState(initialIsActive);
    const [seconds, setSeconds] = useState<number | string>(initialSecondsToStop % 60);
    const [minutes, setMinutes] = useState<number | string>(Math.floor(initialSecondsToStop / 60));

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const handleSubmit = () => {
        const formattedSeconds = Math.round(Number(seconds));
        const formattedMinutes = Math.round(Number(minutes));
        const totalSeconds = formattedMinutes * 60 + formattedSeconds;

        if (!formattedSeconds && !formattedMinutes) {
            handleOpenSnackbar(t("timeCannotBeEmpty"));
            return;
        }

        if (formattedSeconds < 0 || formattedMinutes < 0) {
            handleOpenSnackbar(t("timeMustBePositiveValue"));
            return;
        }

        handleSetTimer(totalSeconds, isActive);
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
                htmlFor="timerIsActive"
                title={t(isActive ? "clickToTurnOffTimer" : "clickToTurnOnTimer")}
            >
                <input
                    type="checkbox"
                    id="timerIsActive"
                    checked={isActive}
                    onChange={() => setIsActive((prev) => !prev)}
                />
                {t("timerIsActive")}
            </label>
            <label htmlFor="timerInput">
                {t("stopIn")}
                <input
                    id="timerInput"
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
                    id="timerInput"
                    className="dialogInput"
                    type="number"
                    min={0}
                    max={MAX_SECONDS_TO_STOP}
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value.substring(0, 2))}
                    autoComplete="off"
                />
                {t("seconds")}
            </label>
        </Dialog>
    );
}

export default TimerDialog;