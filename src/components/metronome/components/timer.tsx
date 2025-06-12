import { useState } from "react";
import StopperIcon from "../../../assets/icons/stopperIcon";
import Dialog from "../../dialog/dialog";
import useDialog from "../../dialog/useDialog";

type Props = {
    initialIsActive: boolean
    initialSecondsToStop: number,
    handleSetTimer: (amount: number, isActive: boolean) => void,
}

const Timer = (props: Props) => {

    const {
        initialIsActive,
        initialSecondsToStop,
        handleSetTimer,
    } = props;

    const {
        dialogRef,
        handleOpenDialog,
        handleCloseDialog,
    } = useDialog();

    const [isActive, setIsActive] = useState(initialIsActive);
    const [seconds, setSeconds] = useState<number | string>(initialSecondsToStop);

    const handleSubmit = () => {
        const formattedSeconds = Number(seconds);
        if (!formattedSeconds || formattedSeconds < 1) return;
        handleSetTimer(formattedSeconds, isActive);
        handleCloseDialog();
    }

    return (
        <>
            <button
                data-is-off={String(!initialIsActive)}
                className="iconButton"
                onClick={(e) => {
                    handleOpenDialog();
                    e.currentTarget.blur();
                }}
            >
                {<StopperIcon />}
            </button>
            <Dialog
                ref={dialogRef}
                title={"Timer settings"}
                handleClose={handleCloseDialog}
                handleSubmit={handleSubmit}
            >
                <div className="checkboxContainer">
                    <label htmlFor="active">
                        {"Timer is active"}
                    </label>
                    <input type="checkbox" id="active" checked={isActive} onChange={() => setIsActive((prev) => !prev)} />
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
        </>
    );
}

export default Timer;