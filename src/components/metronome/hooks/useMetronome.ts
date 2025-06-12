import { useEffect, useRef, useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
    DEFAULT_BEATS_PER_MEASURE,
    LOOK_AHEAD,
    STOPPED_METRONOME_BEAT_INDEX,
    BEAT_TYPES_AMOUNT,
    DEFAULT_VOLUME,
    DEFAULT_TIMER_IS_ACTIVE,
    DEFAULT_SECONDS_TO_STOP,
    DEFAULT_SUBDIVISION,
} from "../../../utils/constants";
import { getValueFromLocalStorage, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { createDefaultBeatTypesArray, getUpdatedBeatTypesArray } from "../../../utils/beatTypes";
import useStateRefLocalStorageSync from "./useStateRefSync";
import useTimeMeasure from "./useTimeMeasure";

const initialBPM = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.bpm) || DEFAULT_BPM;
const initialBeatsPerMeasure = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.beatsPerMeasure) || DEFAULT_BEATS_PER_MEASURE;
const initialSubdivision = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.subdivision) || DEFAULT_SUBDIVISION;
const initialBeatTypes = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.beatTypes) || createDefaultBeatTypesArray(initialBeatsPerMeasure);
const initialVolume = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.volume) || DEFAULT_VOLUME;
const initialTimerIsActive = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.timerIsActive) || DEFAULT_TIMER_IS_ACTIVE;
const initialTimerSecondsToStop = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.timerSecondsToStop) || DEFAULT_SECONDS_TO_STOP;

type AudioToPlay = AudioBuffer | undefined;

type ClickAudioRef = {
    clickAccent: AudioToPlay,
    clickNormal: AudioToPlay,
    clickMuted: AudioToPlay,
}

const useMetronome = () => {

    const [isPlaying, setIsPlaying] = useState(false);

    const {
        value: bpm,
        valueRef: bpmRef,
        handleSyncValue: handleSyncBPM,
    } = useStateRefLocalStorageSync<number>(initialBPM, LOCAL_STORAGE_KEYS.bpm);

    const {
        value: volume,
        valueRef: volumeRef,
        handleSyncValue: handleSyncVolume,
    } = useStateRefLocalStorageSync<number>(initialVolume, LOCAL_STORAGE_KEYS.volume);

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

    const {
        value: timerIsActive,
        handleSyncValue: handleSyncTimerIsActive,
    } = useStateRefLocalStorageSync<boolean>(initialTimerIsActive, LOCAL_STORAGE_KEYS.timerIsActive);

    const {
        value: timerSecondsToStop,
        handleSyncValue: handleSyncTimerSecondsToStop,
    } = useStateRefLocalStorageSync<number>(initialTimerSecondsToStop, LOCAL_STORAGE_KEYS.timerSecondsToStop);

    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(STOPPED_METRONOME_BEAT_INDEX); // circular number inside measure size
    const beatNumberRef = useRef(STOPPED_METRONOME_BEAT_INDEX); // counter of beats from 0 to infinity

    const audioContextRef = useRef<AudioContext>(null);
    const clickAudioRef = useRef<ClickAudioRef>({ clickAccent: undefined, clickNormal: undefined, clickMuted: undefined });

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    const {
        measuredTime,
        startTimeMeasure,
        stopTimeMeasure,
    } = useTimeMeasure();

    useEffect(() => {
        audioContextRef.current = new window.AudioContext();

        const getAudioBuffer = async (url: string) => {
            if (!audioContextRef.current) return;

            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContextRef.current.decodeAudioData(arrayBuffer);
        };

        const loadAudio = async () => {
            const clickAccent = await getAudioBuffer("src/assets/audio/clickAccent.wav");
            const clickNormal = await getAudioBuffer("src/assets/audio/clickNormal.wav");
            const clickMuted = await getAudioBuffer("src/assets/audio/clickMuted.wav");
            clickAudioRef.current = { clickAccent, clickNormal, clickMuted };
        };

        loadAudio();
    }, []);

    const playAudio = (audioToPlay: AudioBuffer | undefined, time: number) => {
        if (!audioContextRef.current || !audioToPlay) return;

        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = volumeRef.current / 100;
        gainNode.connect(audioContextRef.current.destination);
        source.buffer = audioToPlay;
        source.connect(gainNode);
        source.start(time);
    }

    const scheduleNote = (time: number) => {
        const calculatedBeat = beatNumberRef.current % beatsPerMeasureRef.current;
        const beatType = beatTypesRef.current[calculatedBeat];
        const audioToPlay = [clickAudioRef.current.clickAccent, clickAudioRef.current.clickNormal, clickAudioRef.current.clickMuted][beatType];

        playAudio(audioToPlay, time);

        setCurrentBeatInMeasure(calculatedBeat);

        // test add at the beggining of each measure
        // if (calculatedBeat === 0 && beatNumberRef.current !== 0) {
        //     bpmRef.current++;
        //     setBpm(bpmRef.current); // use ref value because state is not up to date inside of setTimeout
        // }

        beatNumberRef.current++; // this should always go at the end of the function
    };

    const scheduler = () => {
        if (!audioContextRef.current) return;

        while (nextNoteTimeRef.current < audioContextRef.current.currentTime + 0.1) {
            scheduleNote(nextNoteTimeRef.current);

            const secondsPerBeat = 60.0 / bpmRef.current;
            nextNoteTimeRef.current += secondsPerBeat;
        }

        timeoutRef.current = setTimeout(scheduler, LOOK_AHEAD);
    };

    const startMetronome = () => {
        if (!audioContextRef.current) return;

        nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05;
        beatNumberRef.current = 0;
        setCurrentBeatInMeasure(0);

        scheduler();
        setIsPlaying(true);
        startTimeMeasure();
    };

    const stopMetronome = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsPlaying(false);
        setCurrentBeatInMeasure(STOPPED_METRONOME_BEAT_INDEX);
        beatNumberRef.current = STOPPED_METRONOME_BEAT_INDEX;
        stopTimeMeasure();
    };

    const handleToggleMetronome = () => {
        if (isPlaying) {
            stopMetronome();
            return;
        }

        startMetronome();
    };

    const handleSetVolume = (newVolume: number) => {
        handleSyncVolume(newVolume);
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
        // TODO: logic to add sounds between beats
    }

    const handleToggleBeatType = (beatToAccent: number) => {
        let newAccentedBeats = [...beatTypes];
        newAccentedBeats[beatToAccent] = (newAccentedBeats[beatToAccent] + 1) % BEAT_TYPES_AMOUNT;

        updateBeatTypes(newAccentedBeats);
    }

    const handleSetTimer = (newAmount: number, newIsActive: boolean) => {
        handleSyncTimerSecondsToStop(newAmount);
        handleSyncTimerIsActive(newIsActive);
    }

    useEffect(() => {
        if (timerIsActive && measuredTime) {
            if (measuredTime >= (timerSecondsToStop * 1000)) stopMetronome();
        }
    }, [measuredTime, timerIsActive, timerSecondsToStop, stopMetronome])

    return {
        timerIsActive,
        timerSecondsToStop,
        measuredTime,
        isPlaying,
        bpm,
        beatsPerMeasure,
        subdivision,
        beatTypes,
        currentBeatInMeasure,
        volume,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetSubdivision,
        handleToggleBeatType,
        handleToggleMetronome,
        handleSetVolume,
        handleSetTimer,
    };
}

export default useMetronome;