export type LocalStorageValueType = string | number | number[] | boolean;

const isKeyPresentInLocalStorage = (key: string) => Boolean(localStorage.getItem(key));
const getValueFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
    return;
  } catch {
    // no-op
  }
};

export const getValueFromLocalStorageOrDefault = (localStorageKey: string, defaultValue?: LocalStorageValueType) => {
  if (!isKeyPresentInLocalStorage(localStorageKey)) return defaultValue;
  return getValueFromLocalStorage(localStorageKey) ?? defaultValue;
}

export const setValueInLocalStorage = (key: string, value: LocalStorageValueType) => localStorage.setItem(key, JSON.stringify(value));

export const LOCAL_STORAGE_KEYS = {
  theme: "mn_theme",
  language: "mn_language",
  bpm: "mn_bpm",
  template: "mn_template",
  countdownLength: "mn_countdown_length",
  beatsPerMeasure: "mn_beats_per_measure",
  noteValue: "mn_note_value",
  beatTypes: "mn_beat_types",
  timerSecondsIsActive: "mn_timer_seconds_is_active",
  timerMeasuresIsActive: "mn_timer_measures_is_active",
  timerSecondsToStop: "mn_timer_seconds_to_stop",
  timerMeasuresToStop: "mn_timer_measures_to_stop",
  tempoProgrammingIsActive: "mn_tp_is_active",
  tempoProgrammingIsLoop: "mn_tp_is_loop",
  tempoProgrammingBPMToChange: "mn_tp_bpm_to_change",
  tempoProgrammingMeasuresToChangeBPM: "mn_tp_measures_to_change_bpm",
  tempoProgrammingFromBPM: "mn_tp_from_bpm",
  tempoProgrammingToBPM: "mn_tp_to_bpm",
}