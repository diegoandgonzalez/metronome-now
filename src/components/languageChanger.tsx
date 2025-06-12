import { useState } from "react";
import { LOCAL_STORAGE_KEYS, setValueInLocalStorage } from "../utils/localStorage";
import { useTranslation } from "react-i18next";

const LanguageChanger = () => {

    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

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