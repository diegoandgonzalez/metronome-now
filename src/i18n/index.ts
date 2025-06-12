import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import es from "./translations/es.json";
import { getValueFromLocalStorage, LOCAL_STORAGE_KEYS } from "../utils/localStorage";
import { DEFAULT_LANGUAGE } from "../utils/constants";

const initialLanguage = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.language) || DEFAULT_LANGUAGE;

const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: initialLanguage,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;