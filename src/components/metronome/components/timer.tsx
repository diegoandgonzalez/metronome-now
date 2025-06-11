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

    const formattedSeconds = Number(seconds);

    const handleSubmit = () => {
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
                title={"Timer settings"}
                ref={dialogRef}
                handleClose={handleCloseDialog}
            >
                <div>
                    <div>
                        <label htmlFor="active">{"Timer is active"}</label>
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
                            onMouseEnter={(e) => e.currentTarget.focus()}
                            onMouseLeave={(e) => e.currentTarget.blur()}
                        />
                        {"seconds"}
                    </label>
                </div>
                <button
                    disabled={!formattedSeconds || formattedSeconds < 1}
                    onClick={handleSubmit}
                >
                    {"Accept"}
                </button>
            </Dialog>
        </>
    );
}

export default Timer;