import { useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
    DEFAULT_BEATS_PER_MEASURE,
    DEFAULT_SUBDIVISION,
} from "../constants";
import type { TimeSignature } from "../types";

const useMetronome = () => {
    const [bpm, setBpm] = useState(DEFAULT_BPM);
    const [timeSignature, setTimeSignature] = useState<TimeSignature>({
        beatsPerMeasure: DEFAULT_BEATS_PER_MEASURE,
        subdivision: DEFAULT_SUBDIVISION,
    });

    const handleSetBPM = (value: number) => {
        if (value < MIN_BPM || value > MAX_BPM) return;
        setBpm(value);
    }

    const handleSetTimeSignature = (timeSignatureString: string) => {
        const [newBeatsPerMeasure, newSubdivision] = timeSignatureString.split("/");

        setTimeSignature({
            beatsPerMeasure: Number(newBeatsPerMeasure),
            subdivision: Number(newSubdivision)
        })
    }

    return {
        bpm,
        timeSignature,
        handleSetBPM,
        handleSetTimeSignature,
    };
}

export default useMetronome;