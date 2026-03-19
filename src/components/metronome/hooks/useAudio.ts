import { useEffect, useRef } from "react";

type AudioToPlay = AudioBuffer | undefined;

type ClickAudioRef = {
    clickAccent: AudioToPlay,
    clickNormal: AudioToPlay,
    clickMuted: AudioToPlay,
}

const useAudio = (onTick: React.RefObject<() => void>) => {

    const audioContextRef = useRef<AudioContext>(null);
    const clickAudioRef = useRef<ClickAudioRef>({ clickAccent: undefined, clickNormal: undefined, clickMuted: undefined });
    const workletNodeRef = useRef<AudioWorkletNode>(null);

    useEffect(() => {
        return () => {
            workletNodeRef.current?.disconnect();
            workletNodeRef.current = null;
        };
    }, []);

    const getAudioBuffer = async (url: string, context: AudioContext) => { // TODO: mover a utils?
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await context.decodeAudioData(arrayBuffer);
    };

    const loadClickAudio = async (context: AudioContext) => {
        const clickAccent = await getAudioBuffer("audio/clickAccent.wav", context);
        const clickNormal = await getAudioBuffer("audio/clickNormal.wav", context);
        const clickMuted = await getAudioBuffer("audio/clickMuted.wav", context);
        clickAudioRef.current = { clickAccent, clickNormal, clickMuted };
    };

    const setupWorklet = async (context: AudioContext) => {
        try {
            await context.audioWorklet.addModule("/metronome-processor.js");
        } catch (err) {
            console.error("Failed to load AudioWorklet module:", err);
            return;
        }

        workletNodeRef.current = new AudioWorkletNode(context, "metronome-processor");
        workletNodeRef.current.port.onmessage = (e) => {
            if (e.data.type === "tick") onTick.current?.();
        };
        workletNodeRef.current.connect(context.destination);
    };

    const initAudio = async () => {
        if (audioContextRef.current) return;
        const context = new window.AudioContext();
        audioContextRef.current = context;
        await Promise.all([setupWorklet(context), loadClickAudio(context)]);
    };

    const startWorklet = () => {
        workletNodeRef.current?.port.postMessage({ type: "start" });
    };

    const stopWorklet = () => {
        workletNodeRef.current?.port.postMessage({ type: "stop" });
    };

    const playAudio = (beatType: number, time: number) => {
        const audioToPlay = [clickAudioRef.current.clickAccent, clickAudioRef.current.clickNormal, clickAudioRef.current.clickMuted][beatType];

        if (!audioContextRef.current || !audioToPlay) return;
        
        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();
        
        gainNode.gain.value = 1;
        gainNode.connect(audioContextRef.current.destination);
        source.buffer = audioToPlay;
        source.connect(gainNode);
        source.start(time);
    };

    return {
        audioContextRef,
        initAudio,
        startWorklet,
        stopWorklet,
        playAudio,
    };
};

export default useAudio;