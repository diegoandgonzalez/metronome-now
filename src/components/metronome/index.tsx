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

const Metronome = () => {

    const {
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
        dialogRef: timerDialogRef,
        handleOpenDialog: handleOpenTimerDialog,
        handleCloseDialog: handleCloseTimerDialog,
    } = useDialog();

    const {
        dialogRef: bpmProgrammingRef,
        handleOpenDialog: handleOpenBPMProgrammingDialog,
        handleCloseDialog: handleCloseBPMProgrammingDialog,
    } = useDialog();

    return (
        <div className="metronomeContainer">
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
            <BeatDisplay
                beatTypes={beatTypes}
                beatsPerMeasure={beatsPerMeasure}
                currentBeatInMeasure={currentBeatInMeasure}
                handleClick={handleToggleBeatType}
            />
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
                    {isPlaying ? <StopIcon /> : <PlayIcon />}
                </IconButton>
                <IconButton
                    isActive={timerIsActive}
                    handleClick={handleOpenTimerDialog}
                >
                    {<StopperIcon />}
                </IconButton>
                <TimerDialog
                    ref={timerDialogRef}
                    initialIsActive={timerIsActive}
                    initialSecondsToStop={timerSecondsToStop}
                    handleSetTimer={handleSetTimer}
                    handleClose={handleCloseTimerDialog}
                />
                <BPMProgrammingDialog
                    ref={bpmProgrammingRef}
                    initialIsActive={bpmProgrammingIsActive}
                    initialBPMToChange={bpmToChange}
                    initialGoalBPM={goalBPM}
                    initialMeasuresToChangeBPM={measuresToChangeBPM}
                    currentBPM={bpm}
                    handleSetBPMProgramming={handleSetBPMProgramming}
                    handleClose={handleCloseBPMProgrammingDialog}
                />
            </div>
            <Clock
                value={measuredTime}
                secondsToStop={timerIsActive ? timerSecondsToStop : 0}
            />
            <VolumeInput
                value={volume}
                handleChange={handleSetVolume}
            />
        </div>
    );
}

export default Metronome;