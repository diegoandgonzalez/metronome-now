import { useRef, useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
    DEFAULT_BEATS_PER_MEASURE,
    LOOK_AHEAD,
    STOPPED_METRONOME_BEAT_INDEX,
    BEAT_TYPES_AMOUNT,
    DEFAULT_NOTE_VALUE,
    DEFAULT_COUNTDOWN_AMOUNT,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { createDefaultBeatTypesArray, getUpdatedBeatTypesArray } from "../../../utils/beatTypes";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";
import useTimeMeasure from "./useTimeMeasure";
import { type GetProgrammedBPMType } from "./useTempoProgramming";
import useAudio from "./useAudio";
import type { MetronomeSettings } from "../types";

const initialCountdownAmount = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.countdownAmount, DEFAULT_COUNTDOWN_AMOUNT);
const initialBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.bpm, DEFAULT_BPM);
const initialBeatsPerMeasure = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.beatsPerMeasure, DEFAULT_BEATS_PER_MEASURE);
const initialNoteValue = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.noteValue, DEFAULT_NOTE_VALUE);
const initialBeatTypes = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.beatTypes, createDefaultBeatTypesArray(initialBeatsPerMeasure));

const useMetronome = (getProgrammedBPM?: GetProgrammedBPMType) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const countdownHasFinished = useRef(false);

    const {
        value: countdownAmount,
        valueRef: countdownAmountRef,
        handleSyncValue: handleSyncCountdownAmount,
    } = useStateRefLocalStorageSync<number>(initialCountdownAmount, LOCAL_STORAGE_KEYS.countdownAmount);

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
        value: noteValue,
        valueRef: noteValueRef,
        handleSyncValue: handleSyncNoteValue,
    } = useStateRefLocalStorageSync<number>(initialNoteValue, LOCAL_STORAGE_KEYS.noteValue);

    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(STOPPED_METRONOME_BEAT_INDEX); // circular number inside measure size
    const beatNumberRef = useRef(STOPPED_METRONOME_BEAT_INDEX); // counter of beats from 0 to infinity
    const measureNumberRef = useRef(0); // counter of measures from 0 to infinity

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    const {
        currentTime,
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
        const lastBeatOfMeasure = beatsPerMeasureRef.current - 1;
        const beatType = beatTypesRef.current[newCurrentBeatInMeasure];
        const audioToPlay = [clickAudioRef.current.clickAccent, clickAudioRef.current.clickNormal, clickAudioRef.current.clickMuted][beatType];

        playAudio(audioToPlay, time);

        setCurrentBeatInMeasure(newCurrentBeatInMeasure);

        if (newCurrentBeatInMeasure === lastBeatOfMeasure) {
            measureNumberRef.current++;
        }

        const hasCountdown = Boolean(countdownAmountRef.current);

        // if has countdown, but it's not finished, and it's first beat of final countdown measure, set countdown as finished and reset beat and measure number
        if (hasCountdown && !countdownHasFinished.current && newCurrentBeatInMeasure === 0 && measureNumberRef.current === countdownAmountRef.current) {
            countdownHasFinished.current = true;
            beatNumberRef.current = 0;
            measureNumberRef.current = 0;
            startTimeMeasure();
        }

        if (!hasCountdown || (hasCountdown && countdownHasFinished.current)) {
            if (newCurrentBeatInMeasure === 0 && beatNumberRef.current !== 0) { // if start of measure (and not the first measure playing)
                if (getProgrammedBPM) {
                    handleSyncBPM(getProgrammedBPM(measureNumberRef.current, bpmRef.current));
                }
            }
        }

        beatNumberRef.current++;
    };

    const scheduler = () => {
        if (!audioContextRef.current) return;

        const noteValueRatio = 4 / noteValueRef.current;
        const secondsPerBeat = 60.0 / (bpmRef.current / noteValueRatio);

        while (nextNoteTimeRef.current <= audioContextRef.current.currentTime) {
            scheduleNote(nextNoteTimeRef.current);

            nextNoteTimeRef.current += secondsPerBeat;
        }

        timeoutRef.current = window.setTimeout(scheduler, LOOK_AHEAD);
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
        countdownHasFinished.current = false;
        setCurrentBeatInMeasure(0);

        scheduler();
        setIsPlaying(true);

        if (!countdownAmount) { // if countdown is active, startTimeMeasure is executed in scheduleNote after countdown
            startTimeMeasure();
        }
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

    const handleSetBeatTypes = (newBeatTypes: number[]) => {
        handleSyncBeatTypes(newBeatTypes);
    }

    const handleSetBeatsPerMeasure = (newBeatsPerMeasure: number) => {
        handleSyncBeatsPerMeasure(newBeatsPerMeasure);

        // update beatTypesArray with new length
        const updatedBeatTypesArray = getUpdatedBeatTypesArray(beatTypes, newBeatsPerMeasure);
        handleSetBeatTypes(updatedBeatTypesArray);
    }

    const handleSetNoteValue = (newNoteValue: number) => {
        handleSyncNoteValue(newNoteValue);
    }

    const handleToggleBeatType = (beatToAccent: number) => {
        let newAccentedBeats = [...beatTypes];
        newAccentedBeats[beatToAccent] = (newAccentedBeats[beatToAccent] + 1) % BEAT_TYPES_AMOUNT;

        handleSetBeatTypes(newAccentedBeats);
    }

    const handleSetCountdownAmount = (newAmount: number) => {
        handleSyncCountdownAmount(newAmount);
    }

    const handleSetMetronomeSettings = (newMetronomeSettings: MetronomeSettings) => {
        handleSetBPM(newMetronomeSettings.bpm ?? DEFAULT_BPM);
        handleSetBeatsPerMeasure(newMetronomeSettings.beatsPerMeasure ?? DEFAULT_BEATS_PER_MEASURE);
        handleSetNoteValue(newMetronomeSettings.noteValue ?? DEFAULT_NOTE_VALUE);
        handleSetBeatTypes(newMetronomeSettings.beatTypes ?? createDefaultBeatTypesArray(DEFAULT_BEATS_PER_MEASURE));
        handleSetCountdownAmount(newMetronomeSettings.countdownAmount ?? DEFAULT_COUNTDOWN_AMOUNT);
    }

    const settings = {
        bpm,
        beatsPerMeasure,
        noteValue,
        beatTypes,
        countdownAmount,
    };

    return {
        isPlayingCountdown: isPlaying && Boolean(countdownAmount) && !countdownHasFinished.current,
        isPlaying,
        isPaused,
        currentTime,
        currentBeatInMeasure,
        currentMeasure: measureNumberRef.current,
        settings,
        handleStartMetronome,
        handleStopMetronome,
        handleTogglePauseMetronome,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetNoteValue,
        handleToggleBeatType,
        handleSetCountdownAmount,
        handleSetMetronomeSettings,
    };
}

export default useMetronome;