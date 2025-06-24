import { useState } from "react";
import Dialog from "../../../dialog/dialog";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";

type Props = {
    open: boolean,
    templateNames: string[],
    handleSetTemplate: (newName: string) => void,
    handleClose: () => void,
}

const CreateTemplateDialog = (props: Props) => {

    const {
        open,
        templateNames,
        handleSetTemplate,
        handleClose,
    } = props;

    const [templateName, setTemplateName] = useState("");

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const { t } = useTranslation();

    const handleSubmit = () => {
        if (!templateName) {
            handleOpenSnackbar(t("nameRequired"));
            return;
        }

        if (templateNames.includes(templateName)) {
            handleOpenSnackbar(t("nameInUse"));
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
                    type="text"
                    value={templateName}
                    onChange={(e) => {
                        setTemplateName(e.target.value.substring(0, 20));
                    }}
                />
            </label>
        </Dialog>
    );
}

export default CreateTemplateDialog;