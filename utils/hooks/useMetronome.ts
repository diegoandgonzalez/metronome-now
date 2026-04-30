'use client'
import { useRef, useState } from 'react';
import {
    LOCAL_STORAGE_KEYS,
    METRONOME_CONSTANTS,
    DEFAULT_SETTINGS,
} from '../constants';
import { getUpdatedBeatTypesArray } from '@/utils/helpers';
import useStateRefLocalStorageSync from '@/utils/hooks/useStateRefLocalStorageSync';
import type { MetronomeSettings, Settings, TempoProgrammingSettings, TimerSettings } from '@/utils/types';
import useTimeMeasure from '@/utils/hooks/useTimeMeasure';
import useTempoProgramming from '@/utils/hooks/useTempoProgramming';
import useTimerSettings from '@/utils/hooks/useTimerSettings';
import useAudio from '@/utils/hooks/useAudio';

const useMetronome = () => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const {
        value: isInCountdown,
        valueRef: isInCountdownRef,
        handleSyncValue: handleSyncIsInCountdown,
    } = useStateRefLocalStorageSync<boolean>(false);

    const {
        value: countdownLength,
        valueRef: countdownLengthRef,
        handleSyncValue: handleSyncCountdownLength,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.metronomeSettings.countdownLength, LOCAL_STORAGE_KEYS.countdownLength);

    const {
        value: bpm,
        valueRef: bpmRef,
        handleSyncValue: handleSyncBPM,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.metronomeSettings.bpm, LOCAL_STORAGE_KEYS.bpm);

    const {
        value: beatTypes,
        valueRef: beatTypesRef,
        handleSyncValue: handleSyncBeatTypes,
    } = useStateRefLocalStorageSync<number[]>(DEFAULT_SETTINGS.metronomeSettings.beatTypes, LOCAL_STORAGE_KEYS.beatTypes);

    const {
        value: beatsPerMeasure,
        valueRef: beatsPerMeasureRef,
        handleSyncValue: handleSyncBeatsPerMeasure,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.metronomeSettings.beatsPerMeasure, LOCAL_STORAGE_KEYS.beatsPerMeasure);

    const {
        value: noteValue,
        valueRef: noteValueRef,
        handleSyncValue: handleSyncNoteValue,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.metronomeSettings.noteValue, LOCAL_STORAGE_KEYS.noteValue);

    const {
        value: measureNumber,
        valueRef: measureNumberRef,
        handleSyncValue: handleSyncMeasureNumber,
    } = useStateRefLocalStorageSync<number>(METRONOME_CONSTANTS.stoppedBeatIndex);

    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(METRONOME_CONSTANTS.stoppedBeatIndex);
    const beatNumberRef = useRef(METRONOME_CONSTANTS.stoppedBeatIndex);
    const timeToNextNoteRef = useRef(0);

    const {
        currentTime,
        currentTimeRef,
        startTimeMeasure,
        stopTimeMeasure,
        togglePauseTimeMeasure,
    } = useTimeMeasure();

    const {
        settings: tempoProgrammingSettings,
        handleSetTempoProgrammingSettings,
        getProgrammedBPM,
        resetLoopDirection: resetTempoProgrammingLoopDirection,
    } = useTempoProgramming();

    const {
        settings: timerSettings,
        handleSetTimerSettings,
    } = useTimerSettings();

    const onTickRef = useRef<() => void>(() => { });

    const {
        audioContextRef,
        initAudio,
        startWorklet,
        stopWorklet,
        playAudio,
    } = useAudio(onTickRef);

    const handleSetBPM = (value: number) => {
        if (value < METRONOME_CONSTANTS.minBPM || value > METRONOME_CONSTANTS.maxBPM) return;
        handleSyncBPM(value);
    }

    const resetBPM = (tempoProgrammingSettings: TempoProgrammingSettings) => {
        if (tempoProgrammingSettings.isActive) {
            handleSetBPM(tempoProgrammingSettings.fromBPM);
        }
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

    const handleSetCountdownLength = (newLength: number) => {
        handleSyncCountdownLength(newLength);
    }

    const handleSetMetronomeSettings = (newMetronomeSettings: MetronomeSettings = DEFAULT_SETTINGS.metronomeSettings) => {
        handleSetBPM(newMetronomeSettings.bpm);
        handleSetBeatsPerMeasure(newMetronomeSettings.beatsPerMeasure);
        handleSetNoteValue(newMetronomeSettings.noteValue);
        handleSetBeatTypes(newMetronomeSettings.beatTypes);
        handleSetCountdownLength(newMetronomeSettings.countdownLength);
    }

    const handleSetSettings = (settings?: Settings) => {
        handleSetMetronomeSettings(settings?.metronomeSettings);
        handleSetTimerSettings(settings?.timerSettings);
        handleSetTempoProgrammingSettings(settings?.tempoProgrammingSettings);
    }

    const handleSetTempoProgrammingAndTimerSettings = (newCountdownLength: number, newTempoProgrammingSettings: TempoProgrammingSettings, newTimerSettings: TimerSettings) => {
        handleSetCountdownLength(newCountdownLength);
        handleSetTimerSettings(newTimerSettings);
        handleSetTempoProgrammingSettings(newTempoProgrammingSettings);
        resetBPM(newTempoProgrammingSettings)
    }


    const handleStartMetronome = async () => {
        await initAudio();

        if (!audioContextRef.current) return;

        resetBPM(tempoProgrammingSettings);

        timeToNextNoteRef.current = audioContextRef.current.currentTime;
        beatNumberRef.current = 0;
        handleSyncIsInCountdown(Boolean(countdownLengthRef.current));

        resetTempoProgrammingLoopDirection();
        setCurrentBeatInMeasure(0);

        startWorklet();
        setIsPlaying(true);

        if (!isInCountdown) { // if countdown is active, startTimeMeasure is executed after countdown
            startTimeMeasure();
        }
    }

    const handleTogglePauseMetronome = () => { // it works similar to handleToggleMetronome except it doesn't reset clock, beat and measure positions
        if (!isPaused) {
            stopWorklet();
            togglePauseTimeMeasure();
        } else {
            if (!audioContextRef.current) return;
            timeToNextNoteRef.current = audioContextRef.current.currentTime;
            togglePauseTimeMeasure();
            startWorklet();
        }

        setIsPaused((prev) => !prev);
    }

    const handleStopMetronome = () => {
        stopWorklet();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentBeatInMeasure(METRONOME_CONSTANTS.stoppedBeatIndex);
        beatNumberRef.current = METRONOME_CONSTANTS.stoppedBeatIndex;
        handleSyncMeasureNumber(METRONOME_CONSTANTS.stoppedBeatIndex);
        stopTimeMeasure();
        resetBPM(tempoProgrammingSettings);
    }

    const finishCountdown = () => {
        handleSyncIsInCountdown(false);
        beatNumberRef.current = 0;
        handleSyncMeasureNumber(0);
        startTimeMeasure();
    }

    const schedulePendingBeats = () => {
        if (!audioContextRef.current) return;

        const noteValueRatio = 4 / noteValueRef.current;
        const secondsPerBeat = 60.0 / (bpmRef.current / noteValueRatio);

        while (timeToNextNoteRef.current <= audioContextRef.current.currentTime) {
            const newCurrentBeatInMeasure = beatNumberRef.current % beatsPerMeasureRef.current;
            const newBeatType = beatTypesRef.current[newCurrentBeatInMeasure];
            const isFirstBeatInMeasure = newCurrentBeatInMeasure === 0;
            const isLastBeatInMeasure = newCurrentBeatInMeasure === beatsPerMeasureRef.current - 1;

            playAudio(newBeatType, timeToNextNoteRef.current);
            setCurrentBeatInMeasure(newCurrentBeatInMeasure);

            if (isFirstBeatInMeasure) {
                handleSyncMeasureNumber(measureNumberRef.current + 1);
            }

            const shouldFinishCountdown = isInCountdownRef.current && measureNumberRef.current === countdownLengthRef.current && isFirstBeatInMeasure;
            if (shouldFinishCountdown) {
                finishCountdown();
            }

            if (!isInCountdownRef.current) {
                if (measureNumberRef.current !== 0 && isFirstBeatInMeasure) {
                    handleSyncBPM(getProgrammedBPM(measureNumberRef.current, bpmRef.current));
                }

                const shouldStopMetronomeBySeconds = timerSettings.isTimeActive && currentTimeRef.current >= (timerSettings.secondsToStop * 1000);
                const shouldStopMetronomeByMeasures = timerSettings.isMeasuresActive && measureNumberRef.current === (timerSettings.measuresToStop - 1) && isLastBeatInMeasure;  // stop metronome on last beat of last programmed measure
                if (shouldStopMetronomeBySeconds || shouldStopMetronomeByMeasures) {
                    handleStopMetronome();
                }
            }

            beatNumberRef.current++;
            timeToNextNoteRef.current += secondsPerBeat;
        }
    }

    onTickRef.current = schedulePendingBeats; // keep onTick updated for useAudio

    const metronomeSettings: MetronomeSettings = {
        bpm,
        beatsPerMeasure,
        noteValue,
        beatTypes,
        countdownLength,
    }

    const settings: Settings = {
        metronomeSettings,
        tempoProgrammingSettings,
        timerSettings,
    }

    return {
        isInCountdown: isPlaying && isInCountdown,
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
        handleSetSettings,
        handleSetTempoProgrammingAndTimerSettings,
    };
};

export default useMetronome;