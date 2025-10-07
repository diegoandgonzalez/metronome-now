import { useState } from "react";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";
import FormDialog from "../../../dialog/formDialog";
import type { Template } from "../../types";
import { TEMPLATE_NAME_MAX_LENGTH } from "../../../../utils/constants";

type Props = {
    open: boolean,
    initialValue: string,
    templates: Template[],
    handleSubmit: (newName: string) => void,
    handleClose: () => void,
}

const TemplateFormDialog = (props: Props) => {

    const {
        open,
        initialValue,
        templates,
        handleSubmit,
        handleClose,
    } = props;

    const [templateName, setTemplateName] = useState(initialValue);

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const { t } = useTranslation();

    const submit = () => {
        if (!templateName) {
            handleOpenSnackbar(t("nameRequired"));
            return;
        }

        if (templateName !== initialValue && templates.some((template) => template.name === templateName)) {
            handleOpenSnackbar(t("nameInUse"));
            return;
        }

        handleSubmit(templateName);
        handleClose();
    }

    const isCreate = !initialValue;

    return (
        <FormDialog
            open={open}
            title={t(isCreate ? "createTemplate" : "updateTemplate")}
            handleClose={handleClose}
            handleSubmit={submit}
        >
            <p>
                {t(isCreate ? "newTemplateExplanation" : "updateTemplateQuestion")}
            </p>
            <label>
                {t("templateName")}:
                <input
                    id="templateName"
                    className="templateNameInput"
                    type="text"
                    value={templateName}
                    onChange={(e) => {
                        setTemplateName(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH));
                    }}
                />
            </label>
        </FormDialog>
    );
}

export default TemplateFormDialog;