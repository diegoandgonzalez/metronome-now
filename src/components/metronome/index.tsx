import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import BeatDisplay from "./components/beatDisplay";
import Clock from "./components/clock";
import useExecuteOnSpacePressed from "./hooks/useExecuteOnSpacePressed";
import useMetronome from "./hooks/useMetronome";
import VolumeInput from "./components/volumeInput";
import IconButton from "./components/iconButton";
import StopIcon from "../../assets/icons/stopIcon";
import PlayIcon from "../../assets/icons/playIcon";
import AddSubtractIcon from "../../assets/icons/addSubtractIcon";
import StopperIcon from "../../assets/icons/stopperIcon";
import useDialog from "../dialog/useDialog";
import TimerDialog from "./components/timerDialog";

const Metronome = () => {

    const {
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
    } = useMetronome();

    useExecuteOnSpacePressed(handleToggleMetronome);

    const {
        dialogRef: timerDialogRef,
        handleOpenDialog: handleOpenTimerDialog,
        handleCloseDialog: handleCloseTimerDialog,
    } = useDialog();

    return (
        <div className="metronomeContainer">
            <Title />
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
            <div className="buttonsContainer">
                <IconButton
                    isActive={false}
                    handleClick={console.log}
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
            </div>
            <Clock
                value={measuredTime}
            />
            <VolumeInput
                value={volume}
                handleChange={handleSetVolume}
            />
        </div>
    );
}

export default Metronome;