import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import useSnackbarContext from "../../snackbar/useSnackbarContext";
import type { SettingsFunction, Template, TemplateFunction } from "../types";
import useIndexedDB from "../../../utils/hooks/useIndexedDB";
import useDialog from "../../dialog/useDialog";

const useTemplates = (onTemplateSelectionCallback?: SettingsFunction) => {

    const {
        getAllItems: getAllItemsFromDB,
        addItem: addItemToDB,
        updateItem: updateItemInDB,
        deleteItem: deleteItemInDB,
        error: errorDB,
        isReady: isDBReady,
    } = useIndexedDB<Template>("MetronomeNowDB", "Templates", 1, "id");

    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateIDToPlay, setSelectedTemplateIDToPlay] = useState("");
    const [selectedTemplateIDToChange, setSelectedTemplateIDToChange] = useState("");

    const {
        dialogIsOpen: templateFormDialogIsOpen,
        handleOpenDialog: handleOpenTemplateFormDialog,
        handleCloseDialog: handleCloseTemplateFormDialog,
    } = useDialog();

    const {
        dialogIsOpen: templateDeleteDialogIsOpen,
        handleOpenDialog: handleOpenDeleteTemplateDialog,
        handleCloseDialog: handleCloseDeleteTemplateDialog,
    } = useDialog();

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const { t } = useTranslation();

    useEffect(() => {
        if (errorDB) {
            handleOpenSnackbar(t(errorDB.message));
        }
    }, [errorDB, handleOpenSnackbar, t])

    useEffect(() => {
        if (!isDBReady) return;

        getAllItemsFromDB()
            .then(setTemplates)
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }, [getAllItemsFromDB, isDBReady, handleOpenSnackbar]);

    const handleSelectTemplateToPlay = (newTemplateID: string) => {
        setSelectedTemplateIDToPlay(newTemplateID);

        const templateSelected = templates.find((item) => item.id === newTemplateID);

        if (onTemplateSelectionCallback) {
            onTemplateSelectionCallback(templateSelected?.settings);
        }

        handleOpenSnackbar(t("templateSelected"), 0, "success");
    }

    const handleOpenCreateTemplate = () => {
        handleOpenTemplateFormDialog();
    }

    const handleOpenUpdateTemplate = (newTemplateID: string) => {
        setSelectedTemplateIDToChange(newTemplateID);
        handleOpenTemplateFormDialog();
    }

    const handleCloseTemplateForm = () => {
        setSelectedTemplateIDToChange("");
        handleCloseTemplateFormDialog();
    }

    const handleOpenDeleteTemplate = (newTemplateID: string) => {
        setSelectedTemplateIDToChange(newTemplateID);
        handleOpenDeleteTemplateDialog();
    }

    const handleCloseDeleteTemplate = () => {
        setSelectedTemplateIDToChange("");
        handleCloseDeleteTemplateDialog();
    }

    const handleCreateTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        const newTemplate: Template = {
            id: uuidv4(),
            name: newtemplateName,
            settings: newSettings,
        }

        addItemToDB(newTemplate)
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        setSelectedTemplateIDToPlay(newTemplate.id);
                        handleOpenSnackbar(t("templateCreated"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleUpdateTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        const auxSelectedTemplate = templates.find((template) => template.id === selectedTemplateIDToChange);
        if (!auxSelectedTemplate) return;

        auxSelectedTemplate.name = newtemplateName;
        auxSelectedTemplate.settings = newSettings;

        updateItemInDB(auxSelectedTemplate)
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        handleOpenSnackbar(t("templateUpdated"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleDeleteTemplate = () => {
        deleteItemInDB(selectedTemplateIDToChange)
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        setSelectedTemplateIDToChange("");
                        handleSelectTemplateToPlay("");
                        handleOpenSnackbar(t("templateDeleted"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    return {
        isDBReady,
        templates,
        selectedTemplateIDToPlay,
        selectedTemplateIDToChange,
        templateFormDialogIsOpen,
        templateDeleteDialogIsOpen,
        handleSelectTemplateToPlay,
        handleOpenCreateTemplate,
        handleOpenUpdateTemplate,
        handleCloseTemplateForm,
        handleOpenDeleteTemplate,
        handleCloseDeleteTemplate,
        handleCreateTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
    };
}

export default useTemplates;