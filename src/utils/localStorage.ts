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
  beatsPerMeasure: "metronome_now_beatsPerMeasure",
  subdivision: "metronome_now_subdivision",
  accentedBeats: "metronome_now_accentedBeats",
  theme: "metronome_now_theme",
}