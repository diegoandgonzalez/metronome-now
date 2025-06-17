import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import BeatDisplay from "./components/beatDisplay";
import Clock from "./components/clock";
import useExecuteOnSpacePressed from "./hooks/useExecuteOnSpacePressed";
import useMetronome from "./hooks/useMetronome";
import IconButton from "./components/iconButton";
import StopIcon from "../../assets/icons/stopIcon";
import PlayIcon from "../../assets/icons/playIcon";
import AddSubtractIcon from "../../assets/icons/addSubtractIcon";
import StopperIcon from "../../assets/icons/stopperIcon";
import TempoProgrammingDialog from "./components/dialogs/tempoProgrammingDialog";
import TimerDialog from "./components/dialogs/timerDialog";
import useDialog from "../dialog/useDialog";
import { MAIN_ICON_SIZE } from "../../utils/constants";
import useTimer from "./hooks/useTimer";
import useTempoProgramming from "./hooks/useTempoProgramming";
import Title from "./components/title";
import LanguageChanger from "../languageChanger";
import ThemeChanger from "../themeChanger";

const Metronome = () => {

    const {
        isActive: isTempoProgrammingActive,
        addSubtractOption,
        bpmToChange,
        measuresToChangeBPM,
        goalBPM,
        handleSetTempoProgramming,
        getProgrammedBPM,
    } = useTempoProgramming();

    const {
        isPlaying,
        isPaused,
        measuredTime,
        bpm,
        beatsPerMeasure,
        subdivision,
        beatTypes,
        currentBeatInMeasure,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetSubdivision,
        handleToggleBeatType,
        handleStartMetronome,
        handleStopMetronome,
        handleTogglePauseMetronome,
    } = useMetronome(getProgrammedBPM);

    const {
        timerIsActive,
        timerSecondsToStop,
        handleSetTimer,
    } = useTimer(measuredTime, handleStopMetronome);

    const handleToggleMetronome = () => {
        if (isPlaying) {
            handleStopMetronome();
            return;
        }

        handleStartMetronome();
    }

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
        <>
            <header className="header">
                <Title />
                <div>
                    <LanguageChanger />
                    <ThemeChanger />
                </div>
            </header>
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
                <Clock
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    value={measuredTime}
                    secondsToStop={timerIsActive ? timerSecondsToStop : 0}
                    handleClick={handleTogglePauseMetronome}
                />
                <footer>
                    <div className="mainActionsContainer">
                        <IconButton
                            title={"bpmProgramming"}
                            isActive={isTempoProgrammingActive}
                            handleClick={handleOpenBPMProgrammingDialog}
                        >
                            {<AddSubtractIcon />}
                        </IconButton>
                        <IconButton
                            title={isPlaying ? "stop" : "play"}
                            isActive
                            handleClick={handleToggleMetronome}
                        >
                            {isPlaying ? <StopIcon size={MAIN_ICON_SIZE} /> : <PlayIcon size={MAIN_ICON_SIZE} />}
                        </IconButton>
                        <IconButton
                            title={"timer"}
                            isActive={timerIsActive}
                            handleClick={handleOpenTimerDialog}
                        >
                            {<StopperIcon />}
                        </IconButton>
                    </div>                    
                </footer>
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
                    <TempoProgrammingDialog
                        open={bpmProgrammingDialogIsOpen}
                        initialAddSubtractOption={addSubtractOption}
                        initialIsActive={isTempoProgrammingActive}
                        initialBPMToChange={bpmToChange}
                        initialGoalBPM={goalBPM}
                        initialMeasuresToChangeBPM={measuresToChangeBPM}
                        handleSetTempoProgramming={handleSetTempoProgramming}
                        handleClose={handleCloseBPMProgrammingDialog}
                    />
                }
            </div >
        </>
    );
}

export default Metronome;