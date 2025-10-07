import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS, THEMES } from "../../utils/constants";
import FormDialog from "./formDialog";

type Props = {
    open: boolean,
    language: string,
    theme: string,
    handleChangeLanguage: (arg: string) => void,
    handleChangeTheme: (arg: string) => void,
    handleClose: () => void,
}

const SettingsDialog = (props: Props) => {

    const {
        open,
        language,
        theme,
        handleChangeLanguage,
        handleChangeTheme,
        handleClose,
    } = props;

    const { t } = useTranslation();

    return (
        <FormDialog
            hideActions
            open={open}
            title={t("settings")}
            handleSubmit={handleClose}
            handleClose={handleClose}
        >
            <select
                id="language"
                value={language}
                onChange={(e) => handleChangeLanguage(e.target.value)}
            >
                {
                    LANGUAGE_OPTIONS.map((language) => {
                        return (
                            <option key={language.value} value={language.value}>{language.name}</option>
                        )
                    })
                }
            </select>
            <select
                id="theme"
                value={theme}
                onChange={(e) => handleChangeTheme(e.target.value)}
            >
                {
                    Object.keys(THEMES).map((themeKey) => {
                        return (
                            <option key={themeKey} value={themeKey}>{t(themeKey)}</option>
                        )
                    })
                }
            </select>
        </FormDialog>
    );
}

export default SettingsDialog;