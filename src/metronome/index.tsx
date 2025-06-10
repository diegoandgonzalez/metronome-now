import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import useMetronome from "./hooks/useMetronome";
import TimeSignatureInput from "./components/timeSignatureInput";
import PlayButton from "./components/playButton";
import BeatDisplay from "./components/beatDisplay";
import Timer from "./components/timer";
import useExecuteOnSpacePressed from "./hooks/useExecuteOnSpacePressed";
import MuteButton from "./components/muteButton";

const Metronome = () => {

    const {
        playedTime,
        isPlaying,
        bpm,
        timeSignature,
        accentedBeats,
        currentBeatInMeasure,
        mute,
        handleSetBPM,
        handleSetTimeSignature,
        handleSetAccentedBeat,
        handleToggleMetronome,
        handleToggleMute,
    } = useMetronome();

    useExecuteOnSpacePressed(handleToggleMetronome);

    return (
        <div>
            <Title />

            <PlayButton
                isPlaying={isPlaying}
                handleClick={handleToggleMetronome}
            />
            <BPMInput
                value={bpm}
                handleChange={handleSetBPM}
            />
            <TimeSignatureInput
                value={timeSignature}
                handleChange={handleSetTimeSignature}
            />
            <BeatDisplay
                accentedBeats={accentedBeats}
                beatsPerMeasure={timeSignature.beatsPerMeasure}
                currentBeatInMeasure={currentBeatInMeasure}
                handleSetAccentedBeat={handleSetAccentedBeat}
            />
            <Timer
                value={playedTime}
            />
            <MuteButton
                mute={mute}
                handleClick={handleToggleMute}
            />
        </div>
    );
}

export default Metronome;