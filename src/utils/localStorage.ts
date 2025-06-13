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
  theme: "mn_theme",
  language: "mn_language",
  bpm: "mn_bpm",
  beatsPerMeasure: "mn_beats_per_measure",
  subdivision: "mn_subdivision",
  beatTypes: "mn_beat_types",
  volume: "mn_volume",
  timerIsActive: "mn_timer_is_active",
  timerSecondsToStop: "mn_timer_seconds_to_stop",
  bpmProgrammingIsActive: "mn_bpm_programming_is_active",
  bpmToChange: "mn_bpm_to_change",
  goalBPM: "mn_goal_bpm",
  measuresToChangeBPM: "mn_measures_to_change_bpm",
  addSubtractOption: "mn_add_subtract_option",
}