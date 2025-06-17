import { useRef, useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
    DEFAULT_BEATS_PER_MEASURE,
    LOOK_AHEAD,
    STOPPED_METRONOME_BEAT_INDEX,
    BEAT_TYPES_AMOUNT,
    DEFAULT_SUBDIVISION,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { createDefaultBeatTypesArray, getUpdatedBeatTypesArray } from "../../../utils/beatTypes";
import useStateRefLocalStorageSync from "./useStateRefLocalStorageSync";
import useTimeMeasure from "./useTimeMeasure";
import { type GetProgrammedBPMType } from "./useTempoProgramming";
import useAudio from "./useAudio";

const initialBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.bpm, DEFAULT_BPM);
const initialBeatsPerMeasure = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.beatsPerMeasure, DEFAULT_BEATS_PER_MEASURE);
const initialSubdivision = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.subdivision, DEFAULT_SUBDIVISION);
const initialBeatTypes = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.beatTypes, createDefaultBeatTypesArray(initialBeatsPerMeasure));

const useMetronome = (getProgrammedBPM?: GetProgrammedBPMType) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const {
        value: bpm,
        valueRef: bpmRef,
        handleSyncValue: handleSyncBPM,
    } = useStateRefLocalStorageSync<number>(initialBPM, LOCAL_STORAGE_KEYS.bpm);

    const {
        value: beatTypes,
        valueRef: beatTypesRef,
        handleSyncValue: handleSyncBeatTypes,
    } = useStateRefLocalStorageSync<number[]>(initialBeatTypes, LOCAL_STORAGE_KEYS.beatTypes);

    const {
        value: beatsPerMeasure,
        valueRef: beatsPerMeasureRef,
        handleSyncValue: handleSyncBeatsPerMeasure,
    } = useStateRefLocalStorageSync<number>(initialBeatsPerMeasure, LOCAL_STORAGE_KEYS.beatsPerMeasure);

    const {
        value: subdivision,
        valueRef: subdivisionRef,
        handleSyncValue: handleSyncSubdivision,
    } = useStateRefLocalStorageSync<number>(initialSubdivision, LOCAL_STORAGE_KEYS.subdivision);

    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(STOPPED_METRONOME_BEAT_INDEX); // circular number inside measure size
    const beatNumberRef = useRef(STOPPED_METRONOME_BEAT_INDEX); // counter of beats from 0 to infinity
    const measureNumberRef = useRef(0); // counter of measures from 0 to infinity

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    const {
        measuredTime,
        startTimeMeasure,
        stopTimeMeasure,
        togglePauseTimeMeasure,
    } = useTimeMeasure();

    const {
        audioContextRef,
        clickAudioRef,
        playAudio,
    } = useAudio();

    const scheduleNote = (time: number) => {
        const newCurrentBeatInMeasure = beatNumberRef.current % beatsPerMeasureRef.current;
        const beatType = beatTypesRef.current[newCurrentBeatInMeasure];
        const audioToPlay = [clickAudioRef.current.clickAccent, clickAudioRef.current.clickNormal, clickAudioRef.current.clickMuted][beatType];

        playAudio(audioToPlay, time);

        setCurrentBeatInMeasure(newCurrentBeatInMeasure);

        if (newCurrentBeatInMeasure === 0 && beatNumberRef.current !== 0) { // if start of measure (and not the first measure playing)
            measureNumberRef.current++;

            if (getProgrammedBPM) {
                handleSyncBPM(getProgrammedBPM(measureNumberRef.current, bpmRef.current));
            }
        }

        beatNumberRef.current++;
    };

    const scheduler = () => {
        if (!audioContextRef.current) return;

        const subdivisionRatio = 4 / subdivisionRef.current;

        while (nextNoteTimeRef.current <= audioContextRef.current.currentTime) {
            scheduleNote(nextNoteTimeRef.current);

            const secondsPerBeat = 60.0 / (bpmRef.current / subdivisionRatio);
            nextNoteTimeRef.current += secondsPerBeat;
        }

        timeoutRef.current = setTimeout(scheduler, LOOK_AHEAD);
    };

    const setNextNoteTimeToStartOrResume = () => {
        if (!audioContextRef.current) return;
        nextNoteTimeRef.current = audioContextRef.current.currentTime;
    }

    const clearTimeoutRefToStopOrPause = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }

    const handleStartMetronome = () => {
        setNextNoteTimeToStartOrResume();
        beatNumberRef.current = 0;
        setCurrentBeatInMeasure(0);

        scheduler();
        setIsPlaying(true);
        startTimeMeasure();
    };

    const handleStopMetronome = () => {
        clearTimeoutRefToStopOrPause();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentBeatInMeasure(STOPPED_METRONOME_BEAT_INDEX);
        beatNumberRef.current = STOPPED_METRONOME_BEAT_INDEX;
        measureNumberRef.current = 0;
        stopTimeMeasure();
    };

    const handleTogglePauseMetronome = () => {
        // it works similar to handleToggleMetronome except it doesn't reset clock, beat and measure positions
        if (!isPaused) {
            clearTimeoutRefToStopOrPause();
            togglePauseTimeMeasure();
        } else {
            setNextNoteTimeToStartOrResume();
            togglePauseTimeMeasure();
            scheduler();
        }

        setIsPaused((prev) => !prev);
    }

    const handleSetBPM = (value: number) => {
        if (value < MIN_BPM || value > MAX_BPM) return;
        handleSyncBPM(value);
    }

    const updateBeatTypes = (newBeatTypesArray: number[]) => {
        handleSyncBeatTypes(newBeatTypesArray);
    }

    const handleSetBeatsPerMeasure = (newBeatsPerMeasure: number) => {
        handleSyncBeatsPerMeasure(newBeatsPerMeasure);

        // update beatTypesArray with new length
        const updatedBeatTypesArray = getUpdatedBeatTypesArray(beatTypes, newBeatsPerMeasure);
        updateBeatTypes(updatedBeatTypesArray);
    }

    const handleSetSubdivision = (newSubdivision: number) => {
        handleSyncSubdivision(newSubdivision);
    }

    const handleToggleBeatType = (beatToAccent: number) => {
        let newAccentedBeats = [...beatTypes];
        newAccentedBeats[beatToAccent] = (newAccentedBeats[beatToAccent] + 1) % BEAT_TYPES_AMOUNT;

        updateBeatTypes(newAccentedBeats);
    }

    return {
        isPlaying,
        isPaused,
        measuredTime,
        bpm,
        beatsPerMeasure,
        subdivision,
        beatTypes,
        currentBeatInMeasure,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetSubdivision,
        handleToggleBeatType,
        handleStartMetronome,
        handleStopMetronome,
        handleTogglePauseMetronome,
    };
}

export default useMetronome;