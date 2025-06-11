export type TimeSignature = {
    beatsPerMeasure: number,
    subdivision: number,
};

export type AudioToPlay = AudioBuffer | undefined;

export type ClickAudioRef = {
    clickAccent: AudioToPlay,
    clickNormal: AudioToPlay,
    clickMuted: AudioToPlay,
}