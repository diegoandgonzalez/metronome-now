import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useSnackbarContext from "../../snackbar/useSnackbarContext";
import type { Template, MetronomeTimerTempoProgrammingFunction, TemplateMetronomeTimerTempoProgrammingFunction } from "../types";
import { useTranslation } from "react-i18next";
import useIndexedDB from "../../../utils/hooks/useIndexedDB";

const useTemplates = (onTemplateSelectionCallback?: MetronomeTimerTempoProgrammingFunction) => {

    const {
        getAllItems: getAllItemsFromDB,
        addItem: addItemToDB,
        updateItem: updateItemInDB,
        deleteItem: deleteItemInDB,
        error: errorDB,
        isReady: isDBReady,
    } = useIndexedDB<Template>("MetronomeNowDB", "Templates", 1, "id");

    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateID, setSelectedTemplateID] = useState("");

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

    const handleSelectTemplate = (newTemplateID: string) => {
        setSelectedTemplateID(newTemplateID);

        const templateSelected = templates.find((item) => item.id === newTemplateID);
        if (!templateSelected) return;
        if (onTemplateSelectionCallback) {
            onTemplateSelectionCallback(templateSelected.metronomeSettings, templateSelected.timerSettings, templateSelected.tempoProgrammigSettings);
        }
    }

    const handleCreateTemplate: TemplateMetronomeTimerTempoProgrammingFunction = (newtemplateName, newMetronomeSettings, newTimerSettings, newTempoProgrammingSettings) => {
        const newTemplate: Template = {
            id: uuidv4(),
            name: newtemplateName,
            metronomeSettings: newMetronomeSettings,
            timerSettings: newTimerSettings,
            tempoProgrammigSettings: newTempoProgrammingSettings,
        }

        addItemToDB(newTemplate)
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        setSelectedTemplateID(newTemplate.id);
                        handleOpenSnackbar(t("templateCreated"), 0, "success");
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleUpdateTemplate: MetronomeTimerTempoProgrammingFunction = (newMetronomeSettings, newTimerSettings, newTempoProgrammingSettings) => {
        const auxSelectedTemplate = templates.find((template) => template.id === selectedTemplateID);
        if (!auxSelectedTemplate) return;

        auxSelectedTemplate.metronomeSettings = newMetronomeSettings;
        auxSelectedTemplate.timerSettings = newTimerSettings;
        auxSelectedTemplate.tempoProgrammigSettings = newTempoProgrammingSettings;

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
        deleteItemInDB(selectedTemplateID)
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        setSelectedTemplateID("");
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
        selectedTemplateID,
        handleSelectTemplate,
        handleCreateTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
    };
}

export default useTemplates;