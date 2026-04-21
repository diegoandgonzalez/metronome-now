'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS } from '@/utils/localStorage';
import type { Template, TemplateFormData, TemplateFunction } from '@/utils/types';
import useIndexedDB from '@/utils/hooks/useIndexedDB';
import useDialog from '@/utils/hooks/useDialog';
import useStateRefLocalStorageSync from '@/utils/hooks/useStateRefLocalStorageSync';
import useSnackbarContext from '@/components/snackbar/useSnackbarContext';

const useTemplates = (onTemplateSelectionCallback: (args?: Template) => void) => {

    const t = useTranslations();
    const [storedSelectedTemplateIdToPlay] = useState<string>(() => getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.template, '') as string);

    const {
        getAllItems: getAllItemsFromDB,
        addItem: addItemToDB,
        updateItem: updateItemInDB,
        deleteItem: deleteItemInDB,
        error: errorDB,
        isReady: isDBReady,
    } = useIndexedDB<Template>('MetronomeNowDB', 'Templates', 1, 'id');

    const [templates, setTemplates] = useState<Template[]>([]);
    const hasFetched = useRef<boolean>(false);

    const {
        value: selectedTemplateIdToPlay,
        handleSyncValue: setSelectedTemplateIdToPlay,
    } = useStateRefLocalStorageSync<string>('', LOCAL_STORAGE_KEYS.template);

    const [templateFormData, setTemplateFormData] = useState<TemplateFormData | null>(null);

    const {
        dialogIsOpen: templateFormDialogIsOpen,
        handleOpenDialog: handleOpenTemplateFormDialog,
        handleCloseDialog: handleCloseTemplateFormDialog,
    } = useDialog();

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    useEffect(() => {
        if (errorDB) {
            handleOpenSnackbar(errorDB.message);
        }
    }, [errorDB, handleOpenSnackbar])

    useEffect(() => {
        if (!isDBReady) return;

        if (!hasFetched.current) {
            getAllItemsFromDB()
                .then((fetchedTemplates) => {
                    hasFetched.current = true;
                    setTemplates(fetchedTemplates);
                    const storedTemplateIdExists = Boolean(storedSelectedTemplateIdToPlay) && fetchedTemplates.some((template) => template.id === storedSelectedTemplateIdToPlay);
                    setSelectedTemplateIdToPlay(storedTemplateIdExists ? storedSelectedTemplateIdToPlay : '');
                })
                .catch((error) => {
                    handleOpenSnackbar(error);
                });
        }
    }, [isDBReady, storedSelectedTemplateIdToPlay, getAllItemsFromDB, setSelectedTemplateIdToPlay, handleOpenSnackbar]);

    const handleSelectTemplateToPlayById = (newTemplateID: string) => {
        if (newTemplateID === selectedTemplateIdToPlay) return;
        setSelectedTemplateIdToPlay(newTemplateID);

        const templateSelected = templates.find((template) => template.id === newTemplateID);

        onTemplateSelectionCallback(templateSelected);
        handleOpenSnackbar(t('templateSelected'), 0, 'success');
    }

    const handleSelectTemplateToPlayByObject = (newTemplate?: Template) => {
        setSelectedTemplateIdToPlay(newTemplate?.id || '');
        onTemplateSelectionCallback(newTemplate);
    }

    const handleOpenCreateTemplate = () => {
        setTemplateFormData({ templateId: '', action: 'CREATE' });
        handleOpenTemplateFormDialog();
    }

    const handleCloseTemplateForm = () => {
        setTemplateFormData(null);
        handleCloseTemplateFormDialog();
    }

    const handleOpenUpdateTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: 'UPDATE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDeleteTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: 'DELETE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDuplicateTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: 'DUPLICATE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenRenameTemplate = (newTemplateID: string) => {
        setTemplateFormData({ templateId: newTemplateID, action: 'RENAME' });
        handleOpenTemplateFormDialog();
    }

    const handleSubmitActionTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        if (!templateFormData) return;

        const {
            action,
            templateId,
        } = templateFormData;

        const originalTemplateData = templates.find((template) => template.id === templateId);

        if (action === 'CREATE') {
            handleCreateTemplate(newtemplateName, newSettings);
            return;
        }

        if (action === 'DUPLICATE') {
            handleCreateTemplate(newtemplateName, originalTemplateData?.settings || newSettings);
            return;
        }

        if (action === 'RENAME') {
            handleUpdateTemplate(newtemplateName, originalTemplateData?.settings || newSettings);
            return;
        }

        if (action === 'UPDATE') {
            handleUpdateTemplate(originalTemplateData?.name || '', newSettings);
            return;
        }

        if (action === 'DELETE') {
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
                        setTemplates(newTemplates);
                        handleSelectTemplateToPlayByObject(newTemplate);
                        handleOpenSnackbar(t('templateCreated'), 0, 'success');
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
                        setTemplates(newTemplates);
                        handleSelectTemplateToPlayByObject(auxSelectedTemplate);
                        handleOpenSnackbar(t('templateUpdated'), 0, 'success');
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleDeleteTemplate = () => {
        deleteItemInDB(templateFormData?.templateId || '')
            .then(() => {
                getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        handleSelectTemplateToPlayByObject();
                        handleOpenSnackbar(t('templateDeleted'), 0, 'success');
                    })
            })
            .catch((error) => {
                handleOpenSnackbar(error);
            });
    }

    const handleSelectTemplateByPosition = (position: number) => {
        if (templates.length < position) return;
        handleSelectTemplateToPlayById(templates[position - 1]?.id);
    }

    const handleSelectPrevTemplate = () => {
        const templateIndex = templates.findIndex((template) => template.id === selectedTemplateIdToPlay);
        const prevTemplateId = templates[templateIndex - 1]?.id || '';
        handleSelectTemplateToPlayById(prevTemplateId);
    }

    const handleSelectNextTemplate = () => {
        const templateIndex = templates.findIndex((template) => template.id === selectedTemplateIdToPlay);
        if (templateIndex === templates.length - 1) return;

        const nextTemplateId = templates[templateIndex + 1].id;
        handleSelectTemplateToPlayById(nextTemplateId);
    }

    const sortedTemplates = useMemo(() => {
        return templates.sort((a, b) => a.name.localeCompare(b.name));
    }, [templates])

    return {
        isDBReady,
        templates: sortedTemplates,
        selectedTemplateIdToPlay,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlayById,
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