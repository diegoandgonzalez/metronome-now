import { useRef, useState } from "react";
import {
    METRONOME_CONSTANTS,
    DEFAULT_SETTINGS,
} from "../../../utils/constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { getUpdatedBeatTypesArray } from "../../../utils/beatTypes";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";
import useTimeMeasure from "./useTimeMeasure";
import { type GetProgrammedBPMType } from "./useTempoProgramming";
import useAudio from "./useAudio";
import type { MetronomeSettings, TimerSettings } from "../types";

const initialCountdownAmount = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.countdownAmount, DEFAULT_SETTINGS.metronomeSettings.countdownAmount);
const initialBPM = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.bpm, DEFAULT_SETTINGS.metronomeSettings.bpm);
const initialBeatsPerMeasure = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.beatsPerMeasure, DEFAULT_SETTINGS.metronomeSettings.beatsPerMeasure);
const initialNoteValue = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.noteValue, DEFAULT_SETTINGS.metronomeSettings.noteValue);
const initialBeatTypes = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.beatTypes, DEFAULT_SETTINGS.metronomeSettings.beatTypes);

const useMetronome = (getProgrammedBPM?: GetProgrammedBPMType, timerSettings?: TimerSettings) => {

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

    const {
        value: measureNumber,
        valueRef: measureNumberRef,
        handleSyncValue: handleSyncMeasureNumber,
    } = useStateRefLocalStorageSync<number>(METRONOME_CONSTANTS.stoppedBeatIndex); // counter of measures from 0 to infinity

    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(METRONOME_CONSTANTS.stoppedBeatIndex); // circular number inside measure size
    const beatNumberRef = useRef(METRONOME_CONSTANTS.stoppedBeatIndex); // counter of beats from 0 to infinity

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    const {
        currentTime,
        currentTimeRef,
        startTimeMeasure,
        stopTimeMeasure,
        togglePauseTimeMeasure,
    } = useTimeMeasure();

    const {
        audioContextRef,
        clickAudioRef,
        playAudio,
    } = useAudio();

    const scheduleNote = (beatInMeasureToPlay: number) => {
        const beatType = beatTypesRef.current[beatInMeasureToPlay];
        const audioToPlay = [clickAudioRef.current.clickAccent, clickAudioRef.current.clickNormal, clickAudioRef.current.clickMuted][beatType];
        playAudio(audioToPlay, nextNoteTimeRef.current);
    }

    const checkAndStopCountdown = (isFirstBeatInMeasure: boolean) => {
        // if has countdown and didn't finish
        // and first beat after playing every countdown measure
        // reset and start time measure
        if (Boolean(countdownAmountRef.current) && !countdownHasFinished.current && isFirstBeatInMeasure && measureNumberRef.current === countdownAmountRef.current) {
            countdownHasFinished.current = true;
            beatNumberRef.current = 0;
            handleSyncMeasureNumber(0);
            startTimeMeasure();
        }
    }

    const checkShouldStopByTimerSettings = (isLastBeatInMeasure: boolean): boolean => {
        if (timerSettings) {
            if (timerSettings.secondsIsActive) {
                if (currentTimeRef.current >= (timerSettings.secondsToStop * 1000)) return true;
                return false;
            }

            if (timerSettings.measuresIsActive) {
                // stop metronome on last beat of last programmed measure
                if (isLastBeatInMeasure && measureNumberRef.current === (timerSettings.measuresToStop - 1)) return true;
                return false;
            }
        }

        return false;
    }

    const scheduler = () => {
        if (!audioContextRef.current) return;

        const noteValueRatio = 4 / noteValueRef.current;
        const secondsPerBeat = 60.0 / (bpmRef.current / noteValueRatio);

        while (nextNoteTimeRef.current <= audioContextRef.current.currentTime) {
            const newCurrentBeatInMeasure = beatNumberRef.current % beatsPerMeasureRef.current;
            const isFirstBeatInMeasure = newCurrentBeatInMeasure === 0;
            const isLastBeatInMeasure = newCurrentBeatInMeasure === beatsPerMeasureRef.current - 1;
            const hasCountdown = Boolean(countdownAmountRef.current);

            scheduleNote(newCurrentBeatInMeasure);

            setCurrentBeatInMeasure(newCurrentBeatInMeasure);

            if (isFirstBeatInMeasure) {
                handleSyncMeasureNumber(measureNumberRef.current + 1);
            }

            checkAndStopCountdown(isFirstBeatInMeasure);

            if (!hasCountdown || (hasCountdown && countdownHasFinished.current)) {
                if (isFirstBeatInMeasure && measureNumberRef.current !== 0) { // if start of measure (and not the first measure playing)
                    if (getProgrammedBPM) {
                        handleSyncBPM(getProgrammedBPM(measureNumberRef.current, bpmRef.current));
                    }
                }

                if (checkShouldStopByTimerSettings(isLastBeatInMeasure)) {
                    handleStopMetronome();
                    return;
                }
            }

            beatNumberRef.current++;
            nextNoteTimeRef.current += secondsPerBeat;
        }

        timeoutRef.current = window.setTimeout(scheduler, METRONOME_CONSTANTS.lookAhead);
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
        setCurrentBeatInMeasure(METRONOME_CONSTANTS.stoppedBeatIndex);
        beatNumberRef.current = METRONOME_CONSTANTS.stoppedBeatIndex;
        handleSyncMeasureNumber(METRONOME_CONSTANTS.stoppedBeatIndex);
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
        if (value < METRONOME_CONSTANTS.minBPM || value > METRONOME_CONSTANTS.maxBPM) return;
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
        const newAccentedBeats = [...beatTypes];
        newAccentedBeats[beatToAccent] = (newAccentedBeats[beatToAccent] + 1) % METRONOME_CONSTANTS.beatTypesAmount;

        handleSetBeatTypes(newAccentedBeats);
    }

    const handleSetCountdownAmount = (newAmount: number) => {
        handleSyncCountdownAmount(newAmount);
    }

    const handleSetMetronomeSettings = (newMetronomeSettings: MetronomeSettings = DEFAULT_SETTINGS.metronomeSettings) => {
        handleSetBPM(newMetronomeSettings.bpm);
        handleSetBeatsPerMeasure(newMetronomeSettings.beatsPerMeasure);
        handleSetNoteValue(newMetronomeSettings.noteValue);
        handleSetBeatTypes(newMetronomeSettings.beatTypes);
        handleSetCountdownAmount(newMetronomeSettings.countdownAmount);
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
        currentMeasure: measureNumber,
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