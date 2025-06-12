import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import PlayButton from "./components/playButton";
import BeatDisplay from "./components/beatDisplay";
import Clock from "./components/clock";
import useExecuteOnSpacePressed from "./hooks/useExecuteOnSpacePressed";
import useMetronome from "./hooks/useMetronome";
import VolumeInput from "./components/volumeInput";
import Timer from "./components/timer";
import BPMProgrammer from "./components/bpmProgrammer";

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
                <BPMProgrammer
                    handleClick={console.log}
                />
                <PlayButton
                    isPlaying={isPlaying}
                    handleClick={handleToggleMetronome}
                />
                <Timer
                    initialIsActive={timerIsActive}
                    initialSecondsToStop={timerSecondsToStop}
                    handleSetTimer={handleSetTimer}
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