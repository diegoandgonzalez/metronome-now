import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, MenuItem, Select } from "@mui/material";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import CustomDialogTitle from "../dialog/customDialogTitle";

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
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <CustomDialogTitle onClose={handleClose}>
                {t("settings")}
            </CustomDialogTitle>
            <DialogContent>
                <Select
                    fullWidth
                    value={language}
                    onChange={(e) => handleChangeLanguage(e.target.value)}
                >
                    {
                        LANGUAGE_OPTIONS.map((language) => {
                            return (
                                <MenuItem key={language.value} value={language.value}>{language.name}</MenuItem>
                            )
                        })
                    }
                </Select>
            </DialogContent>
        </Dialog>
    );
}

export default SettingsDialog;