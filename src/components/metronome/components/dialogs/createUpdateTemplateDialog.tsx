import { useState } from "react";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";
import FormDialog from "../../../dialog/formDialog";

type Props = {
    open: boolean,
    initialValue: string,
    templateNames: string[],
    handleSetTemplate: (newName: string) => void,
    handleClose: () => void,
}

const CreateUpdateTemplateDialog = (props: Props) => {

    const {
        open,
        initialValue,
        templateNames,
        handleSetTemplate,
        handleClose,
    } = props;

    const [templateName, setTemplateName] = useState(initialValue);

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const { t } = useTranslation();

    const handleSubmit = () => {
        if (!templateName) {
            handleOpenSnackbar(t("nameRequired"));
            return;
        }

        if (templateName !== initialValue && templateNames.includes(templateName)) {
            handleOpenSnackbar(t("nameInUse"));
            return;
        }

        handleSetTemplate(templateName);
        handleClose();
    }

    const isCreate = !initialValue;

    return (
        <FormDialog
            open={open}
            title={t(isCreate ? "createTemplate" : "updateTemplate")}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <p>
                {t(isCreate ? "newTemplateExplanation" : "updateTemplateQuestion")}
            </p>
            <label>
                {t("templateName")}:
                <input
                    className="templateNameInput"
                    type="text"
                    value={templateName}
                    onChange={(e) => {
                        setTemplateName(e.target.value.substring(0, 30));
                    }}
                />
            </label>
        </FormDialog>
    );
}

export default CreateUpdateTemplateDialog;