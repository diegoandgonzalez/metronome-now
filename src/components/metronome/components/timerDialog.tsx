import { useState } from "react";
import Dialog from "../../dialog/dialog";
import { useTranslation } from "react-i18next";

type Props = {
    ref: React.RefObject<HTMLDialogElement | null>,
    initialIsActive: boolean
    initialSecondsToStop: number,
    handleSetTimer: (amount: number, isActive: boolean) => void,
    handleClose: () => void,
}

const TimerDialog = (props: Props) => {

    const {
        ref,
        initialIsActive,
        initialSecondsToStop,
        handleSetTimer,
        handleClose,
    } = props;

    const { t } = useTranslation();

    const [isActive, setIsActive] = useState(initialIsActive);
    const [seconds, setSeconds] = useState<number | string>(initialSecondsToStop);

    const handleCloseAndReset = () => {
        handleClose();
        setIsActive(initialIsActive);
        setSeconds(initialSecondsToStop);
    }

    const handleSubmit = () => {
        const formattedSeconds = Number(seconds);
        if (!formattedSeconds || formattedSeconds < 1) return;
        handleSetTimer(formattedSeconds, isActive);
        handleCloseAndReset();
    }

    return (
        <Dialog
            ref={ref}
            title={t("timerSettings")}
            handleClose={handleCloseAndReset}
            handleSubmit={handleSubmit}
        >
            <div className="checkboxContainer">
                <input
                    type="checkbox"
                    id="active"
                    checked={isActive}
                    onChange={() => setIsActive((prev) => !prev)}
                />
                <label htmlFor="active">
                    {t("timerIsActive")}
                </label>
            </div>
            <label>
                {t("stopIn")}
                <input
                    className="timerInput"
                    type="number"
                    min={0}
                    max={9999}
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value.substring(0, 4))}
                />
                {t("seconds")}
            </label>
        </Dialog>
    );
}

export default TimerDialog;