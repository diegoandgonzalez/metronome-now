export type LocalStorageValueType = string | number | number[] | boolean;

const isKeyPresentInLocalStorage = (key: string) => Boolean(localStorage.getItem(key));
const getValueFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
    return;
  } catch (e) {
    return;
  }
};

export const getValueFromLocalStorageOrDefault = (localStorageKey: string, defaultValue?: LocalStorageValueType) => {
  return isKeyPresentInLocalStorage(localStorageKey) ? getValueFromLocalStorage(localStorageKey) : (defaultValue || null);
}

export const setValueInLocalStorage = (key: string, value: LocalStorageValueType) => localStorage.setItem(key, JSON.stringify(value));

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
  tempoProgrammingIsActive: "mn_tp_is_active",
  tempoProgrammingBPMToChange: "mn_tp_bpm_to_change",
  tempoProgrammingGoalBPM: "mn_tp_goal_bpm",
  tempoProgrammingMeasuresToChangeBPM: "mn_tp_measures_to_change_bpm",
  tempoProgrammingAddSubtractOption: "mn_tp_add_subtract_option",
}