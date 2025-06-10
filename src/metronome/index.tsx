import Title from "./components/title";
import BPMInput from "./components/bpmInput";
import useMetronome from "./hooks/useMetronome";
import TimeSignatureInput from "./components/timeSignatureInput";
import PlayButton from "./components/playButton";
import BeatDisplay from "./components/beatDisplay";
import Timer from "./components/timer";
import useExecuteOnSpacePressed from "./hooks/useExecuteOnSpacePressed";
import MuteButton from "./components/muteButton";
import { getValueFromLocalStorage, LOCAL_STORAGE_KEYS } from "../utils/localStorage";

const Metronome = () => {

    const localStorageBPM = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.bpm);
    const localStorageBeatsPerMeasure = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.beatsPerMeasure);
    const localStorageSubdivision = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.subdivision);
    const localStorageAccentedBeats = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.accentedBeats);

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
    } = useMetronome(localStorageBPM, localStorageBeatsPerMeasure, localStorageSubdivision, localStorageAccentedBeats);

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
                accentedBeats={accentedBeats}
                beatsPerMeasure={timeSignature.beatsPerMeasure}
                currentBeatInMeasure={currentBeatInMeasure}
                handleSetAccentedBeat={handleSetAccentedBeat}
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