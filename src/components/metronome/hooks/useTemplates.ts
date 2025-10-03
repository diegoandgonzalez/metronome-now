import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import useSnackbarContext from "../../snackbar/useSnackbarContext";
import type { Template, TemplateFunction } from "../types";
import useIndexedDB from "../../../utils/hooks/useIndexedDB";
import useDialog from "../../dialog/useDialog";
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import useStateRefLocalStorageSync from "../../../utils/hooks/useStateRefLocalStorageSync";

const storedSelectedTemplateIdToPlay = getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.template, "");

const useTemplates = (onTemplateSelectionCallback: (args?: Template) => void) => {

    const {
        getAllItems: getAllItemsFromDB,
        addItem: addItemToDB,
        updateItem: updateItemInDB,
        deleteItem: deleteItemInDB,
        error: errorDB,
        isReady: isDBReady,
    } = useIndexedDB<Template>("MetronomeNowDB", "Templates", 1, "id");

    const [templates, setTemplates] = useState<Template[]>([]);

    const {
        value: selectedTemplateIdToPlay,
        handleSyncValue: setSelectedTemplateIdToPlay,
    } = useStateRefLocalStorageSync<string>("", LOCAL_STORAGE_KEYS.template);

    const [selectedTemplateIdToChange, setSelectedTemplateIdToChange] = useState("");

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

        if (!templates.length) {
            getAllItemsFromDB()
                .then((fetchedTemplates) => {
                    setTemplates(fetchedTemplates);
                    const storedTemplateIdExists = Boolean(storedSelectedTemplateIdToPlay) && fetchedTemplates.some((template) => template.id === storedSelectedTemplateIdToPlay);
                    setSelectedTemplateIdToPlay(storedTemplateIdExists ? storedSelectedTemplateIdToPlay : "");
                })
                .catch((error) => {
                    handleOpenSnackbar(error);
                });
        }
    }, [isDBReady, templates, getAllItemsFromDB, setSelectedTemplateIdToPlay, handleOpenSnackbar]);

    const handleSelectTemplateToPlay = (newTemplateID: string) => {
        setSelectedTemplateIdToPlay(newTemplateID);

        const templateSelected = templates.find((template) => template.id === newTemplateID);

        onTemplateSelectionCallback(templateSelected);
    }

    const handleOpenCreateTemplate = () => {
        handleOpenTemplateFormDialog();
    }

    const handleOpenUpdateTemplate = (newTemplateID: string) => {
        setSelectedTemplateIdToChange(newTemplateID);
        handleOpenTemplateFormDialog();
    }

    const handleCloseTemplateForm = () => {
        setSelectedTemplateIdToChange("");
        handleCloseTemplateFormDialog();
    }

    const handleOpenDeleteTemplate = (newTemplateID: string) => {
        setSelectedTemplateIdToChange(newTemplateID);
        handleOpenDeleteTemplateDialog();
    }

    const handleCloseDeleteTemplate = () => {
        setSelectedTemplateIdToChange("");
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
                        setSelectedTemplateIdToPlay(newTemplate.id);
                        handleOpenSnackbar(t("templateCreated"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleUpdateTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        const auxSelectedTemplate = templates.find((template) => template.id === selectedTemplateIdToChange);
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
        deleteItemInDB(selectedTemplateIdToChange)
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        setSelectedTemplateIdToChange("");
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
        selectedTemplateIdToPlay,
        selectedTemplateIdToChange,
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