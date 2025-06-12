import { useState } from "react";
import Dialog from "../../dialog/dialog";

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
            title={"Timer settings"}
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
                    {"Timer is active"}
                </label>
            </div>
            <label>
                {"Stop in"}
                <input
                    className="timerInput"
                    type="number"
                    min={0}
                    max={9999}
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value.substring(0, 4))}
                />
                {"seconds"}
            </label>
        </Dialog>
    );
}

export default TimerDialog;