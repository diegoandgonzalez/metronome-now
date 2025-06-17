import { useEffect, useRef } from "react";

type AudioToPlay = AudioBuffer | undefined;

type ClickAudioRef = {
    clickAccent: AudioToPlay,
    clickNormal: AudioToPlay,
    clickMuted: AudioToPlay,
}

const useAudio = () => {

    const audioContextRef = useRef<AudioContext>(null);
    const clickAudioRef = useRef<ClickAudioRef>({ clickAccent: undefined, clickNormal: undefined, clickMuted: undefined });

    useEffect(() => {
        audioContextRef.current = new window.AudioContext();

        const getAudioBuffer = async (url: string) => {
            if (!audioContextRef.current) return;

            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContextRef.current.decodeAudioData(arrayBuffer);
        };

        const loadAudio = async () => {
            const clickAccent = await getAudioBuffer("audio/clickAccent.wav");
            const clickNormal = await getAudioBuffer("audio/clickNormal.wav");
            const clickMuted = await getAudioBuffer("audio/clickMuted.wav");
            clickAudioRef.current = { clickAccent, clickNormal, clickMuted };
        };

        loadAudio();
    }, []);

    const playAudio = (audioToPlay: AudioBuffer | undefined, time: number) => {
        if (!audioContextRef.current || !audioToPlay) return;

        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = 100;
        gainNode.connect(audioContextRef.current.destination);
        source.buffer = audioToPlay;
        source.connect(gainNode);
        source.start(time);
    }

    return {
        audioContextRef,
        clickAudioRef,
        playAudio,
    };
}

export default useAudio;