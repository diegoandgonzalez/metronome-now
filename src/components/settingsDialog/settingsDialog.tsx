import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import FormDialog from "../dialog/formDialog";

type Props = {
    open: boolean,
    language: string,
    handleChangeLanguage: (arg: string) => void,
    handleClose: () => void,
}

const SettingsDialog = (props: Props) => {

    const {
        open,
        language,
        handleChangeLanguage,
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
        </FormDialog>
    );
}

export default SettingsDialog;