import { useState } from "react";
import Dialog from "../../../dialog/dialog";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";

type Props = {
    open: boolean,
    handleSetTemplate: (newName: string) => void,
    handleClose: () => void,
}

const CreateTemplateDialog = (props: Props) => {

    const {
        open,
        handleSetTemplate,
        handleClose,
    } = props;

    const [templateName, setTemplateName] = useState("");

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const { t } = useTranslation();

    const handleSubmit = () => {
        if (!templateName) { // TODO: min and max length
            handleOpenSnackbar("Name required");
            return;
        }

        handleSetTemplate(templateName);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            title={t("createTemplate")}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <p>
                {t("newTemplateExplanation")}
            </p>
            <label>
                {t("newTemplateName")}:
                <input
                    // TODO: min and max length
                    // TODO: style
                    type="text"
                    value={templateName}
                    onChange={(e) => {
                        setTemplateName(e.target.value);
                    }}
                />
            </label>
        </Dialog>
    );
}

export default CreateTemplateDialog;