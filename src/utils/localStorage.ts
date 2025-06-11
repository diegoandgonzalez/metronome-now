export const setValueInLocalStorage = (key: string, value: string | number | number[]) => localStorage.setItem(key, JSON.stringify(value));

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
}