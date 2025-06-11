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
        secondsToStop,
        playedTime,
        isPlaying,
        bpm,
        timeSignature,
        beatTypes,
        currentBeatInMeasure,
        volume,
        handleSetBPM,
        handleSetTimeSignature,
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
                value={timeSignature}
                handleChange={handleSetTimeSignature}
            />
            <BeatDisplay
                beatTypes={beatTypes}
                beatsPerMeasure={timeSignature.beatsPerMeasure}
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
                    initialSecondsToStop={secondsToStop}
                    handleSetTimer={handleSetTimer}
                />
            </div>
            <Clock
                value={playedTime}
            />
            <VolumeInput
                value={volume}
                handleChange={handleSetVolume}
            />
        </div>
    );
}

export default Metronome;