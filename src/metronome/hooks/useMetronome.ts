import { useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
} from "../constants";

const useMetronome = () => {
    const [bpm, setBpm] = useState(DEFAULT_BPM);

    const handleSetBPM = (value: number) => {
        if (value < MIN_BPM || value > MAX_BPM) return;
        setBpm(value);
    }

    return {
        bpm,
        handleSetBPM,
    };
}

export default useMetronome;