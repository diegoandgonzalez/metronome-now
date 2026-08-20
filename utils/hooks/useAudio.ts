'use client'
import { useEffect, useRef } from 'react';

type AudioToPlay = AudioBuffer | undefined;

type ClickAudioRef = {
    clickAccent: AudioToPlay,
    clickNormal: AudioToPlay,
    clickMuted: AudioToPlay,
}

const useAudio = (onTick: React.RefObject<() => void>) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const clickAudioRef = useRef<ClickAudioRef>({
        clickAccent: undefined,
        clickNormal: undefined,
        clickMuted: undefined
    });
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const rawBuffers = useRef<{ [key: string]: ArrayBuffer }>({});

    const getAudioBuffer = async (url: string, context: AudioContext) => {
        let arrayBuffer = rawBuffers.current[url];

        if (!arrayBuffer) {
            const response = await fetch(url);
            arrayBuffer = await response.arrayBuffer();
            rawBuffers.current[url] = arrayBuffer;
        }

        return await context.decodeAudioData(arrayBuffer.slice(0));
    };

    useEffect(() => {
        const urls = [
            '/audio/clickAccent.wav',
            '/audio/clickNormal.wav',
            '/audio/clickMuted.wav'
        ];

        const prefetch = async () => {
            try {
                await Promise.all(urls.map(async (url) => {
                    const response = await fetch(url);
                    rawBuffers.current[url] = await response.arrayBuffer();
                }));
            } catch { }
        };

        prefetch();

        return () => {
            workletNodeRef.current?.disconnect();
            workletNodeRef.current = null;
        };
    }, []);

    const loadClickAudio = async (context: AudioContext) => {
        const [clickAccent, clickNormal, clickMuted] = await Promise.all([
            getAudioBuffer('/audio/clickAccent.wav', context),
            getAudioBuffer('/audio/clickNormal.wav', context),
            getAudioBuffer('/audio/clickMuted.wav', context),
        ]);

        clickAudioRef.current = { clickAccent, clickNormal, clickMuted };
    };

    const setupWorklet = async (context: AudioContext) => {
        await context.audioWorklet.addModule('/worklets/metronome-processor.js');

        workletNodeRef.current = new AudioWorkletNode(context, 'metronome-processor');
        workletNodeRef.current.port.onmessage = (e) => {
            if (e.data.type === 'tick') onTick.current?.();
        };
        workletNodeRef.current.connect(context.destination);
    };

    const initAudio = async () => {
        if (audioContextRef.current) return;

        const context = new window.AudioContext();
        if (context.state === 'suspended') await context.resume();
        audioContextRef.current = context;

        await Promise.all([
            setupWorklet(context),
            loadClickAudio(context)
        ]);
    };

    const startWorklet = () => {
        workletNodeRef.current?.port.postMessage({ type: 'start' });
    };

    const stopWorklet = () => {
        workletNodeRef.current?.port.postMessage({ type: 'stop' });
    };

    const playAudio = (beatType: number, time: number) => {
        const audioToPlay = Object.values(clickAudioRef.current)[beatType];

        if (!audioContextRef.current || !audioToPlay) return;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioToPlay;
        source.connect(audioContextRef.current.destination);
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