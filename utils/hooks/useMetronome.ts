'use client'
import { useRef, useState } from 'react';
import {
    LOCAL_STORAGE_KEYS,
    METRONOME_CONSTANTS,
    DEFAULT_SETTINGS,
} from '../constants';
import { getUpdatedBeatTypesArray } from '@/utils/helpers';
import type { MetronomeSettings, Settings, TempoProgrammingSettings, TimerSettings } from '@/utils/types';
import useStateRefLocalStorageSync from '@/utils/hooks/useStateRefLocalStorageSync';
import useStateRefSync from '@/utils/hooks/useStateRefSync';
import useTimeMeasure from '@/utils/hooks/useTimeMeasure';
import useAudio from '@/utils/hooks/useAudio';

const useMetronome = () => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const {
        value: countdownLength,
        valueRef: countdownLengthRef,
        handleSyncValue: handleSyncCountdownLength,
    } = useStateRefLocalStorageSync<number>(DEFAULT_SETTINGS.countdownLength, LOCAL_STORAGE_KEYS.countdownLength);

    const {
        value: metronomeSettings,
        valueRef: metronomeSettingsRef,
        handleSyncValue: handleSyncMetronomeSettings,
    } = useStateRefLocalStorageSync<MetronomeSettings>(DEFAULT_SETTINGS.metronomeSettings, LOCAL_STORAGE_KEYS.metronomeSettings);

    const {
        value: tempoProgrammingSettings,
        valueRef: tempoProgrammingSettingsRef,
        handleSyncValue: handleSyncTempoProgrammingSettings,
    } = useStateRefLocalStorageSync<TempoProgrammingSettings>(DEFAULT_SETTINGS.tempoProgrammingSettings, LOCAL_STORAGE_KEYS.tempoProgrammingSettings);

    const {
        value: timerSettings,
        handleSyncValue: handleSetTimerSettings,
    } = useStateRefLocalStorageSync<TimerSettings>(DEFAULT_SETTINGS.timerSettings, LOCAL_STORAGE_KEYS.timerSettings);

    const {
        value: isInCountdown,
        valueRef: isInCountdownRef,
        handleSyncValue: handleSyncIsInCountdown,
    } = useStateRefSync<boolean>(false);

    const {
        value: measureNumber,
        valueRef: measureNumberRef,
        handleSyncValue: handleSyncMeasureNumber,
    } = useStateRefSync<number>(METRONOME_CONSTANTS.stoppedBeatIndex);

    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(METRONOME_CONSTANTS.stoppedBeatIndex);
    const beatNumberRef = useRef(METRONOME_CONSTANTS.stoppedBeatIndex);
    const timeToNextNoteRef = useRef(0);

    const isLoopDirectionAdding = useRef(true);

    const {
        currentTime,
        currentTimeRef,
        startTimeMeasure,
        stopTimeMeasure,
        togglePauseTimeMeasure,
    } = useTimeMeasure();

    const onTickRef = useRef<() => void>(() => { });

    const {
        audioContextRef,
        initAudio,
        startWorklet,
        stopWorklet,
        playAudio,
    } = useAudio(onTickRef);

    const resetLoopDirection = () => {
        isLoopDirectionAdding.current = tempoProgrammingSettings.fromBPM < tempoProgrammingSettings.toBPM;
    }

    const handleSetTempoProgrammingSettings = (newSettings: TempoProgrammingSettings) => {
        handleSyncTempoProgrammingSettings(newSettings);
        isLoopDirectionAdding.current = newSettings.fromBPM < newSettings.toBPM; // initial direction depends on limit bpms
    }

    const calulateProgrammedBPM = (currentMeasure: number, currentBPM: number) => {
        const {
            isActive,
            isLoop,
            bpmToChange,
            measuresToChangeBPM,
            fromBPM,
            toBPM,
        } = tempoProgrammingSettingsRef.current;

        let nextBPMValue = currentBPM;
        if (!isActive) return nextBPMValue;

        if (currentMeasure % measuresToChangeBPM === 0) { // if it's correct measure to change bpm
            const maxValue = fromBPM < toBPM ? toBPM : fromBPM;
            const minValue = fromBPM < toBPM ? fromBPM : toBPM;
            let reachedLimit = false;

            nextBPMValue = currentBPM + (bpmToChange * (isLoopDirectionAdding.current ? 1 : -1));

            if (isLoopDirectionAdding.current && nextBPMValue >= maxValue) {
                nextBPMValue = maxValue;
                reachedLimit = true;
            }

            if (!isLoopDirectionAdding.current && nextBPMValue <= minValue) {
                nextBPMValue = minValue;
                reachedLimit = true;
            }

            if (isLoop && reachedLimit) {
                isLoopDirectionAdding.current = !isLoopDirectionAdding.current; // if bpm reaches limit, change direction
            }
        }

        return nextBPMValue;
    }

    const handleSyncMetronomeSettingsFieldValue = <K extends keyof MetronomeSettings>(fieldName: K, fieldValue: MetronomeSettings[K]) => {
        const updatedMetronomeSettings = { ...metronomeSettings, [fieldName]: fieldValue };
        handleSyncMetronomeSettings(updatedMetronomeSettings);
    }

    const handleSetBPM = (value: number) => {
        if (value < METRONOME_CONSTANTS.minBPM || value > METRONOME_CONSTANTS.maxBPM) return;
        handleSyncMetronomeSettingsFieldValue('bpm', value);
    }

    const resetBPM = (tempoProgrammingSettings: TempoProgrammingSettings) => {
        if (tempoProgrammingSettings.isActive) {
            handleSetBPM(tempoProgrammingSettings.fromBPM);
        }
    }

    const handleSetBeatTypes = (newBeatTypes: number[]) => {
        handleSyncMetronomeSettingsFieldValue('beatTypes', newBeatTypes);
    }

    const handleSetBeatsPerMeasure = (newBeatsPerMeasure: number) => {
        // update beatTypesArray with new length
        const updatedBeatTypesArray = getUpdatedBeatTypesArray(metronomeSettings.beatTypes, newBeatsPerMeasure);

        handleSyncMetronomeSettings({
            ...metronomeSettings,
            beatsPerMeasure: newBeatsPerMeasure,
            beatTypes: updatedBeatTypesArray,
        });
    }

    const handleSetNoteValue = (newNoteValue: number) => {
        handleSyncMetronomeSettingsFieldValue('noteValue', newNoteValue);
    }

    const handleToggleBeatType = (beatToAccent: number) => {
        const newAccentedBeats = [...metronomeSettings.beatTypes];
        newAccentedBeats[beatToAccent] = (newAccentedBeats[beatToAccent] + 1) % METRONOME_CONSTANTS.beatTypesAmount;
        handleSetBeatTypes(newAccentedBeats);
    }

    const handleSetMetronomeSettings = (newMetronomeSettings: MetronomeSettings = DEFAULT_SETTINGS.metronomeSettings) => {
        handleSyncMetronomeSettings(newMetronomeSettings);
    }

    const handleSetSettings = (settings: Settings = DEFAULT_SETTINGS) => {
        handleSyncCountdownLength(settings.countdownLength);
        handleSetMetronomeSettings(settings.metronomeSettings);
        handleSetTimerSettings(settings.timerSettings);
        handleSetTempoProgrammingSettings(settings.tempoProgrammingSettings);
    }

    const handleSetTempoProgrammingAndTimerSettings = (newCountdownLength: number, newTempoProgrammingSettings: TempoProgrammingSettings, newTimerSettings: TimerSettings) => {
        handleSyncCountdownLength(newCountdownLength);
        handleSetTimerSettings(newTimerSettings);
        handleSetTempoProgrammingSettings(newTempoProgrammingSettings);
        resetBPM(newTempoProgrammingSettings)
    }

    const handleStartMetronome = async () => {
        try {
            await initAudio();
        } catch (err) {
            console.error('Failed to initialize audio:', err);
            return false;
        }

        if (!audioContextRef.current) return false;

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        resetBPM(tempoProgrammingSettings);

        timeToNextNoteRef.current = audioContextRef.current.currentTime;
        beatNumberRef.current = 0;
        handleSyncIsInCountdown(Boolean(countdownLengthRef.current));

        resetLoopDirection();
        setCurrentBeatInMeasure(0);

        startWorklet();
        setIsPlaying(true);

        if (!isInCountdown) { // if countdown is active, startTimeMeasure is executed after countdown
            startTimeMeasure();
        }

        return true;
    }

    const handleTogglePauseMetronome = async () => { // it works similar to handleToggleMetronome except it doesn't reset clock, beat and measure positions
        if (!isPaused) {
            stopWorklet();
            togglePauseTimeMeasure();
        } else {
            if (!audioContextRef.current) return;

            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

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

        const {
            bpm,
            beatsPerMeasure,
            noteValue,
            beatTypes,
        } = metronomeSettingsRef.current;

        const noteValueRatio = 4 / noteValue;
        const secondsPerBeat = 60.0 / (bpm / noteValueRatio);

        while (timeToNextNoteRef.current <= audioContextRef.current.currentTime) {
            const newCurrentBeatInMeasure = beatNumberRef.current % beatsPerMeasure;
            const newBeatType = beatTypes[newCurrentBeatInMeasure];
            const isFirstBeatInMeasure = newCurrentBeatInMeasure === 0;
            const isLastBeatInMeasure = newCurrentBeatInMeasure === beatsPerMeasure - 1;

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
                    handleSetBPM(calulateProgrammedBPM(measureNumberRef.current, bpm));
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

    const settings: Settings = {
        countdownLength,
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