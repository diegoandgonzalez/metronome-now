import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import useMetronome from "./hooks/useMetronome";
import TimeSignatureInput from "./components/timeSignatureInput";
import PlayButton from "./components/playButton";

const Metronome = () => {

    const {
        isPlaying,
        bpm,
        timeSignature,
        handleSetBPM,
        handleSetTimeSignature,
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
        </div>
    );
}

export default Metronome;