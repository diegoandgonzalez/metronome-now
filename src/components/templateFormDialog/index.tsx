import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from "@mui/material";
import useSnackbarContext from "../snackbar/useSnackbarContext";
import type { Template, TemplateFormAction, TemplateFormData } from "../../utils/types";
import { TEMPLATE_NAME_MAX_LENGTH } from "../../utils/constants";
import CustomDialogTitle from "../dialog/customDialogTitle";

type Props = {
    open: boolean,
    data: TemplateFormData,
    templates: Template[],
    handleSubmit: (newName: string) => void,
    handleClose: () => void,
}

const getTitleKey = (action: TemplateFormAction) => {
    if (action === "CREATE") return "createTemplate";
    if (action === "UPDATE") return "updateTemplate";
    if (action === "RENAME") return "renameTemplate";
    if (action === "DUPLICATE") return "duplicateTemplate";
    if (action === "DELETE") return "deleteTemplate";
    return "";
}

const getDescriptionKey = (action: TemplateFormAction) => {
    if (action === "CREATE") return "newTemplateExplanation";
    if (action === "UPDATE") return "updateTemplateQuestion";
    if (action === "RENAME") return "renameTemplateQuestion";
    if (action === "DUPLICATE") return "newTemplateDuplicatedExplanation";
    if (action === "DELETE") return "deleteTemplateQuestion";
    return "";
}

const TemplateFormDialog = (props: Props) => {

    const {
        open,
        data,
        templates,
        handleSubmit,
        handleClose,
    } = props;

    const { templateId, action } = data;

    const originalTemplateName = templates.find((template) => template.id === templateId)?.name || "";
    const initialName = (() => {
        if (action === "CREATE" || action === "DUPLICATE") return "";
        return originalTemplateName;
    })();

    const [newTemplateName, setNewTemplateName] = useState(initialName);

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const { t } = useTranslation();

    const submit = () => {
        if (!newTemplateName) {
            handleOpenSnackbar(t("nameRequired"));
            return;
        }

        if (newTemplateName !== initialName && templates.some((template) => template.name === newTemplateName)) {
            handleOpenSnackbar(t("nameInUse"));
            return;
        }

        handleSubmit(newTemplateName);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <CustomDialogTitle onClose={handleClose}>
                {t(getTitleKey(action))}
            </CustomDialogTitle>
            <DialogContent>
                <form
                    id="formDialog"
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                    noValidate
                >
                    <Typography>
                        {t(getDescriptionKey(action), { templateName: originalTemplateName })}
                    </Typography>
                    {
                        ["CREATE", "RENAME", "DUPLICATE"].includes(action!) &&
                        <TextField
                            label={t("templateName")}
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH))}
                            sx={{ marginTop: "20px" }}
                            fullWidth
                        />
                    }
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="dark"
                    type="button"
                    onClick={handleClose}
                >
                    {t("cancel")}
                </Button>
                <Button
                    variant="contained"
                    form="formDialog"
                    type="submit"
                >
                    {t("accept")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TemplateFormDialog;