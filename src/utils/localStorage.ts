export type LocalStorageValueType = string | number | number[] | boolean;

export const setValueInLocalStorage = (key: string, value: LocalStorageValueType) => localStorage.setItem(key, JSON.stringify(value));

export const getValueFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
    return;
  } catch (e) {
    return;
  }
};

export const LOCAL_STORAGE_KEYS = {
  bpm: "metronome_now_bpm",
  beatsPerMeasure: "metronome_now_beats_per_measure",
  subdivision: "metronome_now_subdivision",
  beatTypes: "metronome_now_beat_types",
  theme: "metronome_now_theme",
  volume: "metronome_now_volume",
  timerIsActive: "metronome_now_timer_is_active",
  timerSecondsToStop: "metronome_now_timer_seconds_to_stop",
}