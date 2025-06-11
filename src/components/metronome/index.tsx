import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import PlayButton from "./components/playButton";
import BeatDisplay from "./components/beatDisplay";
import Timer from "./components/timer";
import MuteButton from "./components/muteButton";
import useExecuteOnSpacePressed from "./hooks/useExecuteOnSpacePressed";
import useMetronome from "./hooks/useMetronome";

const Metronome = () => {

    const {
        playedTime,
        isPlaying,
        bpm,
        timeSignature,
        beatTypes,
        currentBeatInMeasure,
        mute,
        handleSetBPM,
        handleSetTimeSignature,
        handleToggleBeatType,
        handleToggleMetronome,
        handleToggleMute,
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
            <div className="playMuteContainer">
                <PlayButton
                    isPlaying={isPlaying}
                    handleClick={handleToggleMetronome}
                />
                <Timer
                    value={playedTime}
                />
                <MuteButton
                    mute={mute}
                    handleClick={handleToggleMute}
                />
            </div>
        </div>
    );
}

export default Metronome;