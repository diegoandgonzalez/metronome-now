'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Settings, Template, TemplateFormData } from '@/utils/types';
import useToggle from '@/utils/hooks/useToggle';
import { useSnackbar } from '@/components/snackbar/context';
import { decode, generateTemplateUniqueName, getValueFromLocalStorageOrDefault, setValueInLocalStorage } from '@/utils/helpers';
import { DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS, TEMPLATE_PARAM_NAME } from '@/utils/constants';
import { useConfirmationDialog } from '@/components/confirmationDialog/context';
import isEqual from 'lodash/isEqual';
import useIndexedDB from '@/utils/hooks/useIndexedDB';
import useStateRefLocalStorageSync from '@/utils/hooks/useStateRefLocalStorageSync';
import { useSearchParams } from 'next/navigation';

const useTemplates = (currentSettings: Settings, onTemplateSelectionCallback: (args?: Template) => void) => {

    const t = useTranslations();
    const { handleOpen: handleOpenSnackbar } = useSnackbar();
    const { handleOpen: handleOpenConfirmationDialog } = useConfirmationDialog();
    const searchParams = useSearchParams();

    const [storedSelectedTemplateNameToPlay] = useState<string>(() => getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.template, '') as string);
    const [templateToShare, setTemplateToShare] = useState<Template | null>(null);

    const [templates, setTemplates] = useState<Template[]>([]);
    const hasFetched = useRef<boolean>(false);

    const {
        value: selectedTemplateNameToPlay,
        handleSyncValue: setSelectedTemplateNameToPlay,
    } = useStateRefLocalStorageSync<string>('', LOCAL_STORAGE_KEYS.template);

    const {
        getAllItems: getAllItemsFromDB,
        addItem: addItemToDB,
        updateItem: updateItemInDB,
        deleteItem: deleteItemInDB,
        deleteAllItems: deleteAllItemsInDB,
        error: errorDB,
        isReady: isDBReady,
    } = useIndexedDB<Template>('MetronomeNowDB', 'Templates', 1, 'name');

    useEffect(() => {
        if (errorDB) {
            handleOpenSnackbar({ text: errorDB.message, type: 'error' });
        }
    }, [errorDB, handleOpenSnackbar])

    useEffect(() => {
        if (!isDBReady) return;

        if (!hasFetched.current) {
            getAllItemsFromDB()
                .then((fetchedTemplates) => {
                    hasFetched.current = true;
                    setTemplates(fetchedTemplates);
                    const storedTemplateIdExists = Boolean(storedSelectedTemplateNameToPlay) && fetchedTemplates.some((template) => template.name === storedSelectedTemplateNameToPlay);
                    setSelectedTemplateNameToPlay(storedTemplateIdExists ? storedSelectedTemplateNameToPlay : '');
                })
                .catch(() => {
                    handleOpenSnackbar({ text: t('errorOcurred') });
                });
        }
    }, [isDBReady, storedSelectedTemplateNameToPlay, t, getAllItemsFromDB, setSelectedTemplateNameToPlay, handleOpenSnackbar]);

    const [templateFormData, setTemplateFormData] = useState<TemplateFormData | null>(null);

    const {
        value: templateFormDialogIsOpen,
        handleToggle: handleToggleTemplateFormDialog,
    } = useToggle();

    const sortedTemplates = useMemo(() => {
        if (!templates?.length) return [];
        return templates.sort((a, b) => a.name.localeCompare(b.name));
    }, [templates])

    const selectedTemplateHasUnsavedChanges = useMemo(() => {
        if (!selectedTemplateNameToPlay) return false;
        const templateSelected = templates.find((template) => template.name === selectedTemplateNameToPlay);
        if (!templateSelected) return false;
        return !isEqual(currentSettings, templateSelected.settings);
    }, [selectedTemplateNameToPlay, templates, currentSettings])

    const handleWarnUnsavedChanges = (callback: () => void) => {
        if (!selectedTemplateHasUnsavedChanges) {
            callback();
            return;
        }

        handleOpenConfirmationDialog({
            question: t('unsavedChangesQuestion'),
            handleConfirm: callback
        })
    }

    const selectTemplateAndStoreInLocalStorage = useCallback((newTemplateName: string) => {
        setSelectedTemplateNameToPlay(newTemplateName);
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.template, newTemplateName);
    }, [setSelectedTemplateNameToPlay])

    const handleDeselectTemplate = () => {
        selectTemplateAndStoreInLocalStorage('');
        onTemplateSelectionCallback();
    }

    const handleSelectTemplateToPlayByName = (newTemplateName: string, callback?: () => void) => handleWarnUnsavedChanges(() => {
        if (newTemplateName === selectedTemplateNameToPlay) return;
        if (!templates?.length) return;

        selectTemplateAndStoreInLocalStorage(newTemplateName);

        const templateSelected = templates.find((template) => template.name === newTemplateName);

        onTemplateSelectionCallback(templateSelected);
        handleOpenSnackbar({ text: t('templateSelected'), type: 'success' });
        if (callback) callback();
    })

    const handleSelectTemplateToPlayByObject = useCallback((newTemplate?: Template) => {
        selectTemplateAndStoreInLocalStorage(newTemplate?.name || '');
        onTemplateSelectionCallback(newTemplate);
    }, [onTemplateSelectionCallback, selectTemplateAndStoreInLocalStorage])

    const handleOpenCreateTemplate = () => handleWarnUnsavedChanges(() => {
        setTemplateFormData({ templateName: '', action: 'CREATE' });
        handleToggleTemplateFormDialog();
    })

    const handleCloseTemplateForm = () => {
        setTemplateFormData(null);
        handleToggleTemplateFormDialog();
    }

    const handleSaveTemplateChanges = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'UPDATE' });
        handleToggleTemplateFormDialog();
    }

    const handleOpenDeleteTemplate = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'DELETE' });
        handleToggleTemplateFormDialog();
    }

    const handleOpenDuplicateTemplate = (newTemplateName: string) => handleWarnUnsavedChanges(() => {
        setTemplateFormData({ templateName: newTemplateName, action: 'DUPLICATE' });
        handleToggleTemplateFormDialog();
    })

    const handleOpenRenameTemplate = (newTemplateName: string) => handleWarnUnsavedChanges(() => {
        setTemplateFormData({ templateName: newTemplateName, action: 'RENAME' });
        handleToggleTemplateFormDialog();
    })

    const handleSubmitActionTemplate = (newtemplateName: string, newSettings: Settings) => {
        if (!templateFormData) return;

        const {
            action,
            templateName,
        } = templateFormData;

        if (action === 'DELETE') {
            handleDeleteTemplate();
            return;
        }

        if (action === 'CREATE') {
            handleCreateTemplate(newtemplateName, DEFAULT_SETTINGS);
            return;
        }

        const originalTemplateData = templates.find((template) => template.name === templateName);

        if (action === 'DUPLICATE') {
            handleCreateTemplate(newtemplateName, originalTemplateData?.settings || newSettings);
            return;
        }

        if (action === 'RENAME') {
            handleRenameTemplate(newtemplateName);
            return;
        }

        if (action === 'UPDATE') {
            handleUpdateTemplateSettings(newSettings);
            return;
        }
    }

    const handleCreateTemplate = useCallback((newtemplateName: string, newSettings: Settings) => {
        getAllItemsFromDB()
            .then(async (allTemplates) => {
                const newTemplate: Template = {
                    name: generateTemplateUniqueName(allTemplates, newtemplateName),
                    settings: newSettings,
                }

                return addItemToDB(newTemplate)
                    .then(() => {
                        setTemplates([...allTemplates, newTemplate]);
                        handleSelectTemplateToPlayByObject(newTemplate);
                        handleOpenSnackbar({ text: t('templateCreated'), type: 'success' });
                    })
            })
            .catch(() => {
                handleOpenSnackbar({ text: t('errorOcurred') });
            });
    }, [t, addItemToDB, getAllItemsFromDB, handleOpenSnackbar, handleSelectTemplateToPlayByObject])

    const handleRenameTemplate = (newtemplateName: string) => {
        const auxSelectedTemplate = templates.find((template) => template.name === templateFormData?.templateName);
        if (!auxSelectedTemplate) return;

        auxSelectedTemplate.name = newtemplateName;

        addItemToDB(auxSelectedTemplate)
            .then(async () => {
                return deleteItemInDB(templateFormData!.templateName) // name is key so delete template with old name
                    .then(async () => {
                        return getAllItemsFromDB()
                            .then((newTemplates) => {
                                setTemplates(newTemplates);
                                handleSelectTemplateToPlayByObject(auxSelectedTemplate);
                                handleOpenSnackbar({ text: t('templateUpdated'), type: 'success' });
                            })
                    })
            })
            .catch(() => {
                handleOpenSnackbar({ text: t('errorOcurred') });
            });
    }

    const handleUpdateTemplateSettings = (newSettings: Settings) => {
        const auxSelectedTemplate = templates.find((template) => template.name === templateFormData?.templateName);
        if (!auxSelectedTemplate) return;

        auxSelectedTemplate.settings = newSettings;

        updateItemInDB(auxSelectedTemplate)
            .then(async () => {
                return getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        handleSelectTemplateToPlayByObject(auxSelectedTemplate);
                        handleOpenSnackbar({ text: t('templateUpdated'), type: 'success' });
                    })
            })
            .catch(() => {
                handleOpenSnackbar({ text: t('errorOcurred') });
            });
    }

    const handleDeleteTemplate = () => {
        deleteItemInDB(templateFormData?.templateName || '')
            .then(async () => {
                return getAllItemsFromDB()
                    .then((newTemplates) => {
                        setTemplates(newTemplates);
                        handleSelectTemplateToPlayByObject();
                        handleOpenSnackbar({ text: t('templateDeleted'), type: 'success' });
                    })
            })
            .catch(() => {
                handleOpenSnackbar({ text: t('errorOcurred') });
            });
    }

    const handleOpenShareTemplateDialog = (templateName: string) => {
        const foundTemplate = templates.find((template) => template.name === templateName);
        if (!foundTemplate) return;
        setTemplateToShare(foundTemplate);
    }

    const handleCloseShareTemplateDialog = () => {
        setTemplateToShare(null);
    }

    const handleDeleteAllTemplates = () => {
        handleOpenConfirmationDialog({
            question: t('confirmDeleteAll'),
            handleConfirm: () => {
                deleteAllItemsInDB()
                    .then(async () => {
                        return getAllItemsFromDB()
                            .then((newTemplates) => {
                                setTemplates(newTemplates);
                                handleSelectTemplateToPlayByObject();
                                handleOpenSnackbar({ text: t('templatesDeleted'), type: 'success' });
                            })
                    })
                    .catch(() => {
                        handleOpenSnackbar({ text: t('errorOcurred') });
                    });
            }
        });
    }

    // import template from url
    useEffect(() => {
        if (!isDBReady) return;

        const encodedTemplate = searchParams.get(TEMPLATE_PARAM_NAME);
        if (!encodedTemplate) return;

        const url = new URL(window.location.href);
        url.searchParams.delete(TEMPLATE_PARAM_NAME);
        window.history.replaceState({}, '', url.toString());

        const decodedTemplate = decode(encodedTemplate) as Template;
        handleCreateTemplate(decodedTemplate.name, decodedTemplate.settings);
    }, [isDBReady, searchParams, handleCreateTemplate]);

    return {
        selectedTemplateHasUnsavedChanges,
        templates: sortedTemplates,
        selectedTemplateNameToPlay,
        templateToShare,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlayByName,
        handleDeselectTemplate,
        handleSubmitActionTemplate,
        handleOpenCreateTemplate,
        handleSaveTemplateChanges,
        handleOpenDeleteTemplate,
        handleOpenRenameTemplate,
        handleOpenDuplicateTemplate,
        handleOpenShareTemplateDialog,
        handleCloseShareTemplateDialog,
        handleCloseTemplateForm,
        handleDeleteAllTemplates,
    };
}

export default useTemplates;