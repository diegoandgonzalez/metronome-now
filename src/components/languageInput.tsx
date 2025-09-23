import { LOCAL_STORAGE_KEYS } from "../utils/localStorage";
import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS } from "../utils/constants";
import useStateRefLocalStorageSync from "../utils/hooks/useStateRefLocalStorageSync";

const LanguageInput = () => {

    const { t, i18n } = useTranslation();

    const {
        value: language,
        handleSyncValue: handleSyncLanguage,
    } = useStateRefLocalStorageSync<string>(i18n.language, LOCAL_STORAGE_KEYS.language);

    const handleChangeLanguage = (newLanguage: string) => {
        handleSyncLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    }

    return (
        <select
            id="language"
            className="languageInput"
            value={language}
            onChange={(e) => {
                e.currentTarget.blur();
                handleChangeLanguage(e.target.value);
            }}
        >
            {
                LANGUAGE_OPTIONS.map((language) => {
                    return (
                        <option key={language} value={language}>{t(language)}</option>
                    )
                })
            }
        </select>
    )
}

export default LanguageInput;