import { useState } from "react";
import { DEFAULT_LANGUAGE } from "../utils/constants";
import { getValueFromLocalStorage, LOCAL_STORAGE_KEYS, setValueInLocalStorage } from "../utils/localStorage";
import { useTranslation } from "react-i18next";

const LanguageChanger = () => {

    const [language, setLanguage] = useState(() => {
        return getValueFromLocalStorage(LOCAL_STORAGE_KEYS.language) || DEFAULT_LANGUAGE;
    })

    const { t, i18n } = useTranslation();

    const handleChangeLanguage = (newLanguage: string) => {
        setLanguage(newLanguage);
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.language, newLanguage);
        i18n.changeLanguage(newLanguage);
    }

    return (
        <select
            className="languageChanger"
            value={language}
            onChange={(e) => handleChangeLanguage(e.target.value)}
        >
            {
                ["en", "es"].map((item) => {
                    return (
                        <option key={item} value={item}>{t(item)}</option>
                    )
                })
            }
        </select>
    )
}

export default LanguageChanger;