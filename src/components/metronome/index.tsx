import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import BeatDisplay from "./components/beatDisplay";
import Clock from "./components/clock";
import useExecuteOnSpacePressed from "./hooks/useExecuteOnSpacePressed";
import useMetronome from "./hooks/useMetronome";
import VolumeInput from "./components/volumeInput";
import IconButton from "./components/iconButton";
import TimerDialog from "./components/timerDialog";
import StopIcon from "../../assets/icons/stopIcon";
import PlayIcon from "../../assets/icons/playIcon";
import AddSubtractIcon from "../../assets/icons/addSubtractIcon";
import StopperIcon from "../../assets/icons/stopperIcon";
import useDialog from "../dialog/useDialog";
import BPMProgrammingDialog from "./components/bpmProgrammingDialog";
import { MAIN_ICON_SIZE } from "../../utils/constants";

const Metronome = () => {

    const {
        addSubtractOption,
        bpmProgrammingIsActive,
        bpmToChange,
        goalBPM,
        measuresToChangeBPM,
        timerIsActive,
        timerSecondsToStop,
        measuredTime,
        isPlaying,
        bpm,
        beatsPerMeasure,
        subdivision,
        beatTypes,
        currentBeatInMeasure,
        volume,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetSubdivision,
        handleToggleBeatType,
        handleToggleMetronome,
        handleSetVolume,
        handleSetTimer,
        handleSetBPMProgramming,
    } = useMetronome();

    useExecuteOnSpacePressed(handleToggleMetronome);

    const {
        dialogIsOpen: timerDialogIsOpen,
        handleOpenDialog: handleOpenTimerDialog,
        handleCloseDialog: handleCloseTimerDialog,
    } = useDialog();

    const {
        dialogIsOpen: bpmProgrammingDialogIsOpen,
        handleOpenDialog: handleOpenBPMProgrammingDialog,
        handleCloseDialog: handleCloseBPMProgrammingDialog,
    } = useDialog();

    return (
        <div className="metronomeContainer">
            <div>
                <BPMInput
                    value={bpm}
                    handleChange={handleSetBPM}
                />
                <TimeSignatureInput
                    subdivision={subdivision}
                    beatsPerMeasure={beatsPerMeasure}
                    handleSetBeatsPerMeasure={handleSetBeatsPerMeasure}
                    handleSetSubdivision={handleSetSubdivision}
                />
            </div>
            <BeatDisplay
                beatTypes={beatTypes}
                beatsPerMeasure={beatsPerMeasure}
                currentBeatInMeasure={currentBeatInMeasure}
                handleClick={handleToggleBeatType}
            />
            <footer>
                <div className="mainActionsContainer">
                    <IconButton
                        isActive={bpmProgrammingIsActive}
                        handleClick={handleOpenBPMProgrammingDialog}
                    >
                        {<AddSubtractIcon />}
                    </IconButton>
                    <IconButton
                        isActive
                        handleClick={handleToggleMetronome}
                    >
                        {isPlaying ? <StopIcon size={MAIN_ICON_SIZE} /> : <PlayIcon size={MAIN_ICON_SIZE} />}
                    </IconButton>
                    <IconButton
                        isActive={timerIsActive}
                        handleClick={handleOpenTimerDialog}
                    >
                        {<StopperIcon />}
                    </IconButton>
                    {
                        timerDialogIsOpen &&
                        <TimerDialog
                            open={timerDialogIsOpen}
                            initialIsActive={timerIsActive}
                            initialSecondsToStop={timerSecondsToStop}
                            handleSetTimer={handleSetTimer}
                            handleClose={handleCloseTimerDialog}
                        />
                    }
                    {
                        bpmProgrammingDialogIsOpen &&
                        <BPMProgrammingDialog
                            open={bpmProgrammingDialogIsOpen}
                            initialAddSubtractOption={addSubtractOption}
                            initialIsActive={bpmProgrammingIsActive}
                            initialBPMToChange={bpmToChange}
                            initialGoalBPM={goalBPM}
                            initialMeasuresToChangeBPM={measuresToChangeBPM}
                            currentBPM={bpm}
                            handleSetBPMProgramming={handleSetBPMProgramming}
                            handleClose={handleCloseBPMProgrammingDialog}
                        />
                    }
                </div>
                <Clock
                    value={measuredTime}
                    secondsToStop={timerIsActive ? timerSecondsToStop : 0}
                />
                <VolumeInput
                    value={volume}
                    handleChange={handleSetVolume}
                />
            </footer>
        </div>
    );
}

export default Metronome;