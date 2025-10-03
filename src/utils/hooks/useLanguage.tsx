import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_KEYS } from "../localStorage";
import useStateRefLocalStorageSync from "./useStateRefLocalStorageSync";

const useLanguage = () => {

    const { i18n } = useTranslation();

    const {
        value: language,
        handleSyncValue: handleSyncLanguage,
    } = useStateRefLocalStorageSync<string>(i18n.language, LOCAL_STORAGE_KEYS.language);

    const handleChangeLanguage = (newLanguage: string) => {
        handleSyncLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    }

    return {
        language,
        handleChangeLanguage,
    }
}

export default useLanguage;