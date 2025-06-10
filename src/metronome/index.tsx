import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import useMetronome from "./hooks/useMetronome";
import TimeSignatureInput from "./components/timeSignatureInput";

const Metronome = () => {

    const {
        bpm,
        timeSignature,
        handleSetBPM,
        handleSetTimeSignature,
    } = useMetronome();

    return (
        <div>
            <Title />

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