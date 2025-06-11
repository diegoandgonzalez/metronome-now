import { useEffect, useRef, useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
    DEFAULT_BEATS_PER_MEASURE,
    DEFAULT_SUBDIVISION,
    LOOK_AHEAD,
    STOPPED_METRONOME_BEAT_INDEX,
    BEAT_TYPES_AMOUNT,
    DEFAULT_VOLUME,
    DEFAULT_SECONDS_TO_STOP,
} from "../../../utils/constants";
import type { ClickAudioRef, TimeSignature } from "../types";
import useStopwatch from "./useStopwatch";
import { getValueFromLocalStorage, LOCAL_STORAGE_KEYS, setValueInLocalStorage } from "../../../utils/localStorage";
import { createDefaultBeatTypesArray, getUpdatedBeatTypesArray } from "../../../utils/beatTypes";
import useCounter from "./useCounter";

const initialBPM = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.bpm) || DEFAULT_BPM;
const initialBeatsPerMeasure = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.beatsPerMeasure) || DEFAULT_BEATS_PER_MEASURE;
const initialSubdivision = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.subdivision) || DEFAULT_SUBDIVISION;
const initialBeatTypes = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.beatTypes) || createDefaultBeatTypesArray(initialBeatsPerMeasure);
const initialVolume = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.volume) || DEFAULT_VOLUME;

const useMetronome = () => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(initialBPM);
    const [timeSignature, setTimeSignature] = useState<TimeSignature>({
        beatsPerMeasure: initialBeatsPerMeasure,
        subdivision: initialSubdivision,
    });
    const [beatTypes, setBeatTypes] = useState(initialBeatTypes);
    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(-1);
    const [volume, setVolume] = useState(initialVolume);

    const audioContextRef = useRef<AudioContext>(null);
    const clickAudioRef = useRef<ClickAudioRef>({ clickAccent: undefined, clickNormal: undefined, clickMuted: undefined });

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    // these refs are used inside a timeout, state wouldn't get the updated value
    const bpmRef = useRef(initialBPM);
    const beatsPerMeasureRef = useRef(initialBeatsPerMeasure);
    const beatNumberRef = useRef(STOPPED_METRONOME_BEAT_INDEX);
    const beatTypesRef = useRef(initialBeatTypes);
    const volumeRef = useRef(initialVolume);

    const {
        playedTime,
        startStopwatch,
        stopStopwatch,
    } = useStopwatch();

    const {
        isActive: timerIsActive,
        amount: secondsToStop,
        handleSetCounter: handleSetTimer,
    } = useCounter(DEFAULT_SECONDS_TO_STOP);

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
        startStopwatch();
    };

    const stopMetronome = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsPlaying(false);
        setCurrentBeatInMeasure(STOPPED_METRONOME_BEAT_INDEX);
        beatNumberRef.current = STOPPED_METRONOME_BEAT_INDEX;
        stopStopwatch();
    };

    const handleToggleMetronome = () => {
        if (isPlaying) {
            stopMetronome();
            return;
        }

        startMetronome();
    };

    const handleSetVolume = (newVolume: number) => {
        volumeRef.current = newVolume;
        setVolume(newVolume);
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.volume, newVolume);
    }

    const handleSetBPM = (value: number) => {
        if (value < MIN_BPM || value > MAX_BPM) return;
        bpmRef.current = value;
        setBpm(value);
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.bpm, value);
    }

    const updateBeatTypes = (newBeatTypesArray: number[]) => {
        setBeatTypes(newBeatTypesArray);
        beatTypesRef.current = newBeatTypesArray;
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.beatTypes, newBeatTypesArray);
    }

    const handleSetTimeSignature = (timeSignatureString: string) => {
        const [newBeatsPerMeasure, newSubdivision] = timeSignatureString.split("/").map(Number);

        beatsPerMeasureRef.current = newBeatsPerMeasure;

        setTimeSignature({
            beatsPerMeasure: newBeatsPerMeasure,
            subdivision: newSubdivision,
        });
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.beatsPerMeasure, newBeatsPerMeasure);
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.subdivision, newSubdivision);

        // update beatTypesArray with new length
        const updatedBeatTypesArray = getUpdatedBeatTypesArray(beatTypes, newBeatsPerMeasure);
        updateBeatTypes(updatedBeatTypesArray);
    }

    const handleToggleBeatType = (beatToAccent: number) => {
        let newAccentedBeats = [...beatTypes];
        newAccentedBeats[beatToAccent] = (newAccentedBeats[beatToAccent] + 1) % BEAT_TYPES_AMOUNT;

        updateBeatTypes(newAccentedBeats);
    }

    useEffect(() => {
        if (secondsToStop && timerIsActive && isPlaying && playedTime) {
            if (playedTime >= (secondsToStop * 1000)) stopMetronome();
        }
    }, [isPlaying, playedTime, timerIsActive, secondsToStop, stopMetronome])

    return {
        timerIsActive,
        secondsToStop,
        playedTime,
        isPlaying,
        bpm,
        timeSignature,
        beatTypes,
        currentBeatInMeasure,
        volume,
        handleSetBPM,
        handleSetTimeSignature,
        handleToggleBeatType,
        handleToggleMetronome,
        handleSetVolume,
        handleSetTimer,
    };
}

export default useMetronome;