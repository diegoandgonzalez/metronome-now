import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import es from "./translations/es.json";
import it from "./translations/it.json";
import pt from "./translations/pt.json";
import de from "./translations/de.json";
import fr from "./translations/fr.json";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../utils/localStorage";
import { DEFAULT_LANGUAGE } from "../utils/constants";

const browserLanguage = (() => {
    let auxLang = navigator.language;
    
    if (auxLang.includes("-")) return auxLang.substring(0, auxLang.indexOf("-"));
    return auxLang;
})();

const initialLanguage = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.language, browserLanguage || DEFAULT_LANGUAGE);

const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    },
    it: {
        translation: it,
    },
    pt: {
        translation: pt,
    },
    de: {
        translation: de,
    },
    fr: {
        translation: fr,
    },
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