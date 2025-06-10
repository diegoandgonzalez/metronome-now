import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import useMetronome from "./hooks/useMetronome";

const Metronome = () => {

    const {
        bpm,
        handleSetBPM,
    } = useMetronome();

    return (
        <div>
            <Title />

            <BPMInput
                value={bpm}
                handleChange={handleSetBPM}
            />
        </div>
    );
}

export default Metronome;