import { THEMES } from "../utils/constants";
import useTheme from "../utils/hooks/useTheme";

const ThemeButton = () => {

    const {
        theme,
        toggleTheme,
    } = useTheme();

    return (
        <button
            className="themeChanger"
            onClick={(e) => {
                e.currentTarget.blur();
                toggleTheme();
            }}
        >
            {theme === THEMES.dark ? "🔆" : "🌙"}
        </button>
    )
}

export default ThemeButton;