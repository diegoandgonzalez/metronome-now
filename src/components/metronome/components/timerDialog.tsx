import { useState } from "react";
import Dialog from "../../dialog/dialog";
import useSnackbarContext from "../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";

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
    const [seconds, setSeconds] = useState<number | string>(initialSecondsToStop);

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const handleCloseAndReset = () => {
        handleClose();
        setIsActive(initialIsActive);
        setSeconds(initialSecondsToStop);
    }

    const handleSubmit = () => {
        const formattedSeconds = Math.round(Number(seconds));

        if (!formattedSeconds || formattedSeconds < 1) {
            handleOpenSnackbar(t("secondsMustBePositiveValue"))
            return;
        }

        handleSetTimer(formattedSeconds, isActive);
        handleCloseAndReset();
    }

    return (
        <Dialog
            open={open}
            title={t("timer")}
            handleClose={handleCloseAndReset}
            handleSubmit={handleSubmit}
        >
            <form className="formContainer">
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
                        max={9999}
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value.substring(0, 4))}
                        autoComplete="off"
                    />
                    {t("seconds")}
                </label>
            </form>
        </Dialog>
    );
}

export default TimerDialog;