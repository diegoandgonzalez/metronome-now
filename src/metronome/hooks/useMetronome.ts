import { useEffect, useRef, useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
    DEFAULT_BEATS_PER_MEASURE,
    DEFAULT_SUBDIVISION,
    LOOK_AHEAD,
    STOPPED_METRONOME_BEAT_INDEX,
    DEFAULT_ACCENTED_BEATS,
} from "../../utils/constants";
import type { ClickAudioRef, TimeSignature } from "../types";
import useTimer from "./useTimer";
import { LOCAL_STORAGE_KEYS, setValueInLocalStorage } from "../../utils/localStorage";

/*
    TODO:
    - vibration on mobile (with toggle)
    - i18n
    - dark/light theme
    - stop after X time
    - stop after X measures
    - tap to get BPM
    - allow add or subtract bpm per measure (with countdown?)
    - pwa
*/

const useMetronome = (
    initialBPM = DEFAULT_BPM, 
    initialBeatsPerMeasure = DEFAULT_BEATS_PER_MEASURE, 
    initialSubdivision = DEFAULT_SUBDIVISION, 
    initialAccentedBeats = DEFAULT_ACCENTED_BEATS,
) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(initialBPM);
    const [timeSignature, setTimeSignature] = useState<TimeSignature>({
        beatsPerMeasure: initialBeatsPerMeasure,
        subdivision: initialSubdivision,
    });
    const [accentedBeats, setAccentedBeats] = useState(initialAccentedBeats);
    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(-1);
    const [mute, setMute] = useState(false);

    const audioContextRef = useRef<AudioContext>(null);
    const clickAudioRef = useRef<ClickAudioRef>({ click1: undefined, click2: undefined });

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    // these refs are used inside a timeout, state wouldn't get the updated value
    const bpmRef = useRef(initialBPM);
    const beatsPerMeasureRef = useRef(initialBeatsPerMeasure);
    const beatNumberRef = useRef(STOPPED_METRONOME_BEAT_INDEX);
    const accentedBeatsRef = useRef(initialAccentedBeats);

    const muteRef = useRef(false);

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
        const isAccentedBeat = accentedBeatsRef.current.includes(calculatedBeat);
        const audioToPlay = isAccentedBeat ? clickAudioRef.current.click1 : clickAudioRef.current.click2;

        if (!muteRef.current) {
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
        muteRef.current = !muteRef.current;
        setMute((prev) => !prev);
    }

    const handleSetBPM = (value: number) => {
        if (value < MIN_BPM || value > MAX_BPM) return;
        bpmRef.current = value;
        setBpm(value);
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.bpm, value);
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
    }

    const handleSetAccentedBeat = (beatToAccent: number) => {
        let newAccentedBeats = [...accentedBeats];
        if (newAccentedBeats.includes(beatToAccent)) {
            newAccentedBeats = newAccentedBeats.filter((item) => item !== beatToAccent);
        } else {
            newAccentedBeats = [...newAccentedBeats, beatToAccent];
        }

        setAccentedBeats(newAccentedBeats);
        accentedBeatsRef.current = newAccentedBeats;
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.accentedBeats, newAccentedBeats);
    }

    return {
        playedTime,
        isPlaying,
        bpm,
        timeSignature,
        accentedBeats,
        currentBeatInMeasure,
        mute,
        handleSetBPM,
        handleSetTimeSignature,
        handleSetAccentedBeat,
        handleToggleMetronome,
        handleToggleMute,
    };
}

export default useMetronome;