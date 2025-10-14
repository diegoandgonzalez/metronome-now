import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import useSnackbarContext from "../../snackbar/useSnackbarContext";
import type { Template, TemplateFormData, TemplateFunction } from "../../../utils/types";
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

    const [templateFormData, setTemplateFormData] = useState<TemplateFormData | null>(null);

    const {
        dialogIsOpen: templateFormDialogIsOpen,
        handleOpenDialog: handleOpenTemplateFormDialog,
        handleCloseDialog: handleCloseTemplateFormDialog,
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
                    setTemplates(fetchedTemplates.sort((a, b) => a.name.localeCompare(b.name)));
                    const storedTemplateIdExists = Boolean(storedSelectedTemplateIdToPlay) && fetchedTemplates.some((template) => template.id === storedSelectedTemplateIdToPlay);
                    setSelectedTemplateIdToPlay(storedTemplateIdExists ? storedSelectedTemplateIdToPlay : "");
                })
                .catch((error) => {
                    handleOpenSnackbar(error);
                });
        }
    }, [isDBReady, templates, getAllItemsFromDB, setSelectedTemplateIdToPlay, handleOpenSnackbar]);

    const handleSelectTemplateToPlay = (newTemplateID: string) => {
        if (newTemplateID === selectedTemplateIdToPlay) return;
        setSelectedTemplateIdToPlay(newTemplateID);

        const templateSelected = templates.find((template) => template.id === newTemplateID);

        onTemplateSelectionCallback(templateSelected);
        handleOpenSnackbar(t("templateSelected"), 0, "success");
    }

    const handleOpenCreateTemplate = () => {
        setTemplateFormData({ templateId: "", action: "CREATE" });
        handleOpenTemplateFormDialog();
    }

    const handleCloseTemplateForm = () => {
        setTemplateFormData(null);
        handleCloseTemplateFormDialog();
    }

    const handleOpenUpdateTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: "UPDATE" });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDeleteTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: "DELETE" });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDuplicateTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: "DUPLICATE" });
        handleOpenTemplateFormDialog();
    }

    const handleOpenRenameTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: "RENAME" });
        handleOpenTemplateFormDialog();
    }

    const handleSubmitActionTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        if (!templateFormData) return;

        const {
            action,
            templateId,
        } = templateFormData;

        const originalTemplateData = templates.find((template) => template.id === templateId);

        if (action === "CREATE") {
            handleCreateTemplate(newtemplateName, newSettings);
            return;
        }

        if (action === "DUPLICATE") {
            handleCreateTemplate(newtemplateName, originalTemplateData?.settings || newSettings);
            return;
        }

        if (action === "RENAME") {
            handleUpdateTemplate(newtemplateName, originalTemplateData?.settings || newSettings);
            return;
        }

        if (action === "UPDATE") {
            handleUpdateTemplate(originalTemplateData?.name || "", newSettings);
            return;
        }

        if (action === "DELETE") {
            handleDeleteTemplate();
            return;
        }
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
                        setTemplates(newTemplates.sort((a, b) => a.name.localeCompare(b.name)));
                        setSelectedTemplateIdToPlay(newTemplate.id);
                        handleOpenSnackbar(t("templateCreated"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleUpdateTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        const auxSelectedTemplate = templates.find((template) => template.id === templateFormData?.templateId);
        if (!auxSelectedTemplate) return;

        auxSelectedTemplate.name = newtemplateName;
        auxSelectedTemplate.settings = newSettings;

        updateItemInDB(auxSelectedTemplate)
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates.sort((a, b) => a.name.localeCompare(b.name)));
                        handleOpenSnackbar(t("templateUpdated"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleDeleteTemplate = () => {
        deleteItemInDB(templateFormData?.templateId || "")
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates.sort((a, b) => a.name.localeCompare(b.name)));
                        setTemplateFormData(null);
                        handleSelectTemplateToPlay("");
                        handleOpenSnackbar(t("templateDeleted"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleSelectTemplateByPosition = (position: number) => {
        if (templates.length < position) return;
        handleSelectTemplateToPlay(templates[position - 1]?.id);
    }

    const handleSelectPrevTemplate = () => {
        const templateIndex = templates.findIndex((template) => template.id === selectedTemplateIdToPlay);
        const prevTemplateId = templates[templateIndex - 1]?.id || "";
        handleSelectTemplateToPlay(prevTemplateId);
    }

    const handleSelectNextTemplate = () => {
        const templateIndex = templates.findIndex((template) => template.id === selectedTemplateIdToPlay);
        if (templateIndex === templates.length - 1) return;

        const nextTemplateId = templates[templateIndex + 1].id;
        handleSelectTemplateToPlay(nextTemplateId);
    }

    return {
        isDBReady,
        templates,
        selectedTemplateIdToPlay,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlay,
        handleSelectTemplateByPosition,
        handleSelectPrevTemplate,
        handleSelectNextTemplate,
        handleOpenCreateTemplate,
        handleOpenUpdateTemplate,
        handleOpenDeleteTemplate,
        handleOpenRenameTemplate,
        handleOpenDuplicateTemplate,
        handleCloseTemplateForm,
        handleSubmitActionTemplate,
    };
}

export default useTemplates;