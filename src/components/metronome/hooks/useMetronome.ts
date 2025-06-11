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
} from "../../../utils/constants";
import type { ClickAudioRef, TimeSignature } from "../types";
import useTimer from "./useTimer";
import { getValueFromLocalStorage, LOCAL_STORAGE_KEYS, setValueInLocalStorage } from "../../../utils/localStorage";
import { createDefaultBeatTypesArray, getUpdatedBeatTypesArray } from "../../../utils/beatTypes";

/*
    TODO:
    - i18n
    - stop after X time
    - stop after X measures
    - tap to get BPM
    - allow add or subtract bpm per measure (with countdown?)
    - pwa
    - templates?
    - volume?
*/

const initialBPM = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.bpm) || DEFAULT_BPM;
const initialBeatsPerMeasure = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.beatsPerMeasure) || DEFAULT_BEATS_PER_MEASURE;
const initialSubdivision = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.subdivision) || DEFAULT_SUBDIVISION;
const initialBeatTypes = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.beatTypes) || createDefaultBeatTypesArray(initialBeatsPerMeasure);

const useMetronome = () => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(initialBPM);
    const [timeSignature, setTimeSignature] = useState<TimeSignature>({
        beatsPerMeasure: initialBeatsPerMeasure,
        subdivision: initialSubdivision,
    });
    const [beatTypes, setBeatTypes] = useState(initialBeatTypes);
    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(-1);
    const [isMuted, setIsMuted] = useState(false);

    const audioContextRef = useRef<AudioContext>(null);
    const clickAudioRef = useRef<ClickAudioRef>({ click1: undefined, click2: undefined });

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    // these refs are used inside a timeout, state wouldn't get the updated value
    const bpmRef = useRef(initialBPM);
    const beatsPerMeasureRef = useRef(initialBeatsPerMeasure);
    const beatNumberRef = useRef(STOPPED_METRONOME_BEAT_INDEX);
    const beatTypesRef = useRef(initialBeatTypes);

    const isMutedRef = useRef(false);

    const {
        playedTime,
        startTimer,
        stopTimer,
    } = useTimer();

    useEffect(() => {
        audioContextRef.current = new window.AudioContext();

        const getAudioBuffer = async (url: string) => {
            if (!audioContextRef.current) return;

            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContextRef.current.decodeAudioData(arrayBuffer);
        };

        const loadAudio = async () => {
            const click1 = await getAudioBuffer("src/assets/audio/click1.wav");
            const click2 = await getAudioBuffer("src/assets/audio/click2.wav");
            clickAudioRef.current = { click1, click2 };
        };

        loadAudio();
    }, []);

    const playAudio = (audioToPlay: AudioBuffer | undefined, time: number) => {
        if (!audioContextRef.current || !audioToPlay) return;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioToPlay;
        source.connect(audioContextRef.current.destination);
        source.start(time);
    }

    const scheduleNote = (time: number) => {
        const calculatedBeat = beatNumberRef.current % beatsPerMeasureRef.current;
        const beatType = beatTypesRef.current[calculatedBeat];
        const audioToPlay = [clickAudioRef.current.click1, clickAudioRef.current.click2][beatType];

        if (!isMutedRef.current) {
            playAudio(audioToPlay, time);
        }

        setCurrentBeatInMeasure(calculatedBeat);
        beatNumberRef.current++;
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
        startTimer();
    };

    const stopMetronome = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsPlaying(false);
        setCurrentBeatInMeasure(STOPPED_METRONOME_BEAT_INDEX);
        beatNumberRef.current = STOPPED_METRONOME_BEAT_INDEX;
        stopTimer();
    };

    const handleToggleMetronome = () => {
        if (isPlaying) {
            stopMetronome();
            return;
        }

        startMetronome();
    };

    const handleToggleMute = () => {
        isMutedRef.current = !isMutedRef.current;
        setIsMuted((prev) => !prev);
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

    return {
        playedTime,
        isPlaying,
        bpm,
        timeSignature,
        beatTypes,
        currentBeatInMeasure,
        mute: isMuted,
        handleSetBPM,
        handleSetTimeSignature,
        handleToggleBeatType,
        handleToggleMetronome,
        handleToggleMute,
    };
}

export default useMetronome;