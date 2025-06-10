export type TimeSignature = {
    beatsPerMeasure: number,
    subdivision: number,
};

export type AudioToPlay = AudioBuffer | undefined;

export type ClickAudioRef = {
    click1: AudioToPlay,
    click2: AudioToPlay,
}