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
  theme: "metronome_now_theme",
  language: "metronome_now_language",
  bpm: "metronome_now_bpm",
  beatsPerMeasure: "metronome_now_beats_per_measure",
  subdivision: "metronome_now_subdivision",
  beatTypes: "metronome_now_beat_types",
  volume: "metronome_now_volume",
  timerIsActive: "metronome_now_timer_is_active",
  timerSecondsToStop: "metronome_now_timer_seconds_to_stop",
  bpmProgrammingIsActive: "metronome_now_bpm_programming_is_active",
  bpmToChange: "metronome_now_bpm_to_change",
  goalBPM: "metronome_now_goal_bpm",
  measuresToChangeBPM: "metronome_now_measures_to_change_bpm",
}