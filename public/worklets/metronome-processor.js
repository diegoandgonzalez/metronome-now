const LOOKAHEAD_MS = 25;

class MetronomeProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.lookahead = LOOKAHEAD_MS / 1000;
        this.nextTickTime = 0;
        this.isRunning = false;
        this.port.onmessage = (e) => {
            if (e.data.type === 'start') this.isRunning = true;
            if (e.data.type === 'stop') this.isRunning = false;
        };
    }

    process() {
        if (this.isRunning && currentTime >= this.nextTickTime) {
            this.port.postMessage({ type: 'tick', currentTime });
            this.nextTickTime = currentTime + this.lookahead;
        }

        return true;
    }
}

registerProcessor('metronome-processor', MetronomeProcessor);