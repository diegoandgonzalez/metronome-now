import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import FormDialog from "../../../dialog/formDialog";
import type { Template, TemplateFormData } from "../../types";
import { TEMPLATE_NAME_MAX_LENGTH } from "../../../../utils/constants";

type Props = {
    open: boolean,
    data: TemplateFormData,
    templates: Template[],
    handleSubmit: (newName: string) => void,
    handleClose: () => void,
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

    const initialName = (() => {
        if (action === "CREATE" || action === "DUPLICATE") return "";
        return templates.find((template) => template.id === templateId)?.name || "";
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
        <FormDialog
            open={open}
            title={
                (() => {
                    if (action === "CREATE") return "Crear";
                    if (action === "UPDATE") return "Actualizar configuración";
                    if (action === "RENAME") return "Renombrar";
                    if (action === "DUPLICATE") return "DUPLICAR";
                    if (action === "DELETE") return "ELIMINAR";
                    return "";
                })()
            }
            handleClose={handleClose}
            handleSubmit={submit}
        >
            <p>
                {
                    t((() => {
                        if (action === "CREATE") return "newTemplateExplanation";
                        if (action === "UPDATE") return "updateTemplateQuestion";
                        if (action === "RENAME") return "¿Deseas renombrar la plantilla?";
                        if (action === "DUPLICATE") return "Se creará una nueva plantilla con la configuración de la plantilla seleccionada.";
                        if (action === "DELETE") return "¿Deseas eliminar la plantilla?";
                        return "";
                    })())
                }
            </p>
            {
                ["CREATE", "RENAME", "DUPLICATE"].includes(action!) &&
                <label>
                    {t("templateName")}:
                    <input
                        id="templateName"
                        className="templateNameInput"
                        type="text"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH))}
                    />
                </label>
            }
        </FormDialog>
    );
}

export default TemplateFormDialog;