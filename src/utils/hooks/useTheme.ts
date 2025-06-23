import { useEffect } from "react";
import { DEFAULT_THEME, THEMES } from "../constants";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../localStorage";
import useStateRefLocalStorageSync from "./useStateRefLocalStorageSync";

const defaultTheme = (() => {
    if (!window.matchMedia) return DEFAULT_THEME;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return THEMES.dark;
    return "light";
})();

const initialTheme = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.theme, defaultTheme);

const useTheme = () => {

    const {
        value: theme,
        handleSyncValue: handleSyncTheme,
    } = useStateRefLocalStorageSync<string>(initialTheme, LOCAL_STORAGE_KEYS.theme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", initialTheme);
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === THEMES.dark ? THEMES.light : THEMES.dark;
        handleSyncTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    }

    return {
        theme,
        toggleTheme,
    }
}

export default useTheme;