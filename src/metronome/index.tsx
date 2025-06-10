import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import useMetronome from "./hooks/useMetronome";
import TimeSignatureInput from "./components/timeSignatureInput";
import PlayButton from "./components/playButton";
import BeatDisplay from "./components/beatDisplay";

const Metronome = () => {

    const {
        isPlaying,
        bpm,
        timeSignature,
        accentedBeats,
        currentBeatInMeasure,
        handleSetBPM,
        handleSetTimeSignature,
        handleSetAccentedBeat,
        handleToggleMetronome,
    } = useMetronome();

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
        </div>
    );
}

export default Metronome;