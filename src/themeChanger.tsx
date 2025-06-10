import { useEffect, useState } from "react";
import { DEFAULT_THEME } from "./utils/constants";
import { getValueFromLocalStorage, LOCAL_STORAGE_KEYS, setValueInLocalStorage } from "./utils/localStorage";

const ThemeChanger = () => {

    const [theme, setTheme] = useState(() => {
        return getValueFromLocalStorage(LOCAL_STORAGE_KEYS.theme) || DEFAULT_THEME;
    })

    useEffect(() => {
        const documentAttribute = document.documentElement.getAttribute("data-theme");
        if (documentAttribute !== theme) {
            document.documentElement.setAttribute("data-theme", theme);
            setValueInLocalStorage(LOCAL_STORAGE_KEYS.theme, theme);
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev: string) => prev === "dark" ? "light" : "dark");
    }

    return (
        <button
            className="themeChanger"
            onClick={(e) => {
                toggleTheme();
                e.currentTarget.blur();
            }}
        >
            {theme === "dark" ? "🔆" : "🌙"}
        </button>
    )
}

export default ThemeChanger;