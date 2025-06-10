import { useEffect, useRef, useState } from "react";
import {
    DEFAULT_BPM,
    MAX_BPM,
    MIN_BPM,
    DEFAULT_BEATS_PER_MEASURE,
    DEFAULT_SUBDIVISION,
    LOOK_AHEAD,
    STOPPED_METRONOME_BEAT_INDEX,
} from "../constants";
import type { ClickAudioRef, TimeSignature } from "../types";
import useTimer from "./useTimer";

const useMetronome = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(DEFAULT_BPM);
    const [timeSignature, setTimeSignature] = useState<TimeSignature>({
        beatsPerMeasure: DEFAULT_BEATS_PER_MEASURE,
        subdivision: DEFAULT_SUBDIVISION,
    });
    const [accentedBeats, setAccentedBeats] = useState([0]);
    const [currentBeatInMeasure, setCurrentBeatInMeasure] = useState(-1);

    const audioContextRef = useRef<AudioContext>(null);
    const clickAudioRef = useRef<ClickAudioRef>({ click1: undefined, click2: undefined });

    const timeoutRef = useRef<number>(null);
    const nextNoteTimeRef = useRef(0);

    // these refs are used inside a timeout, state wouldn't get the updated value
    const bpmRef = useRef(DEFAULT_BPM);
    const beatsPerMeasureRef = useRef(DEFAULT_BEATS_PER_MEASURE);
    const beatNumberRef = useRef(STOPPED_METRONOME_BEAT_INDEX);
    const accentedBeatsRef = useRef([0]);

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

        playAudio(audioToPlay, time);
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

    const handleSetBPM = (value: number) => {
        if (value < MIN_BPM || value > MAX_BPM) return;
        bpmRef.current = value;
        setBpm(value);
    }

    const handleSetTimeSignature = (timeSignatureString: string) => {
        const [newBeatsPerMeasure, newSubdivision] = timeSignatureString.split("/").map(Number);

        beatsPerMeasureRef.current = newBeatsPerMeasure;

        setTimeSignature({
            beatsPerMeasure: newBeatsPerMeasure,
            subdivision: newSubdivision,
        });
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
    }

    return {
        playedTime,
        isPlaying,
        bpm,
        timeSignature,
        accentedBeats,
        currentBeatInMeasure,
        handleSetBPM,
        handleSetTimeSignature,
        handleSetAccentedBeat,
        handleToggleMetronome,
    };
}

export default useMetronome;