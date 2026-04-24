'use client'
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FileToCreate, Settings, Template, TemplateFormData, TemplateFunction } from '@/utils/types';
import useDialog from '@/utils/hooks/useDialog';
import { useSnackbar } from '@/components/snackbar/context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useDriveAppData from '@/utils/hooks/useDriveAppData';
import { getValueFromLocalStorageOrDefault, LOCAL_STORAGE_KEYS, setValueInLocalStorage } from '@/utils/localStorage';
import { DEFAULT_SETTINGS } from '@/utils/constants';
import { areSettingObjectsEqual } from '@/utils/helpers';
import { useConfirmationDialog } from '@/components/confirmationDialog/context';

const KEY = 'template-files';

const useTemplates = (currentSettings: Settings, onTemplateSelectionCallback: (args?: Template) => void) => {

    const t = useTranslations();
    const { handleOpen: handleOpenSnackbar } = useSnackbar();
    const { handleOpen: handleOpenConfirmationDialog } = useConfirmationDialog();

    const {
        isReady,
        readAllFiles,
        writeFile,
        deleteFile,
        deleteAllFiles,
    } = useDriveAppData();

    const [selectedTemplateNameToPlay, setSelectedTemplateNameToPlay] = useState<string>(() => getValueFromLocalStorageOrDefault(LOCAL_STORAGE_KEYS.template, ''));
    const [templateFormData, setTemplateFormData] = useState<TemplateFormData | null>(null);

    const queryClient = useQueryClient();

    const { data: templateFiles } = useQuery({
        queryKey: [KEY],
        queryFn: readAllFiles,
        enabled: isReady,
    });

    const templates = useMemo(() => {
        if (!templateFiles?.length) return [] as Template[];
        return templateFiles.map((file) => file.content) as Template[];
    }, [templateFiles])

    const { mutate: createTemplate } = useMutation({
        mutationFn: (newFile: FileToCreate) => writeFile(newFile),
        onSuccess: (_, newFile: FileToCreate) => {
            queryClient.invalidateQueries({ queryKey: [KEY] });
            handleSelectTemplateToPlayByObject(newFile.content as Template);
            handleOpenSnackbar({ text: t('templateCreated'), type: 'success' });
        },
    });

    const { mutate: updateTemplate } = useMutation({
        mutationFn: (newFile: FileToCreate) => writeFile(newFile),
        onSuccess: (_, newFile: FileToCreate) => {
            queryClient.invalidateQueries({ queryKey: [KEY] });
            handleSelectTemplateToPlayByObject(newFile.content as Template);
            handleOpenSnackbar({ text: t('templateUpdated'), type: 'success' });
        },
    });

    const { mutate: deleteTemplate } = useMutation({
        mutationFn: (fileName: string) => deleteFile(fileName),
        onSuccess: (_, fileNameDeleted) => {
            queryClient.invalidateQueries({ queryKey: [KEY] });
            handleOpenSnackbar({ text: t('templateDeleted'), type: 'success' });
            if (selectedTemplateNameToPlay === fileNameDeleted) {
                handleDeselectTemplate();
            }
        },
    });

    const { mutate: deleteAllTemplates } = useMutation({
        mutationFn: deleteAllFiles,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEY] });
            handleDeselectTemplate();
            handleOpenSnackbar({ text: t('templatesDeleted'), type: 'success' });
        },
    });

    const {
        dialogIsOpen: templateFormDialogIsOpen,
        handleOpenDialog: handleOpenTemplateFormDialog,
        handleCloseDialog: handleCloseTemplateFormDialog,
    } = useDialog();

    const sortedTemplates = useMemo(() => {
        if (!templates?.length) return [];
        return templates.sort((a, b) => a.name.localeCompare(b.name));
    }, [templates])

    const selectedTemplateHasUnsavedChanges = useMemo(() => {
        if (!selectedTemplateNameToPlay) return false;
        const templateSelected = templates.find((template) => template.name === selectedTemplateNameToPlay);
        if (!templateSelected) return false;
        return !areSettingObjectsEqual(currentSettings, templateSelected.settings);
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

    const selectTemplateAndStoreInLocalStorage = (newTemplateName: string) => {
        setSelectedTemplateNameToPlay(newTemplateName);
        setValueInLocalStorage(LOCAL_STORAGE_KEYS.template, newTemplateName);
    }

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

    const handleSelectTemplateToPlayByObject = (newTemplate?: Template) => {
        selectTemplateAndStoreInLocalStorage(newTemplate?.name || '');
        onTemplateSelectionCallback(newTemplate);
    }

    const handleOpenCreateTemplate = () => handleWarnUnsavedChanges(() => {
        setTemplateFormData({ templateName: '', action: 'CREATE' });
        handleOpenTemplateFormDialog();
    })

    const handleCloseTemplateForm = () => {
        setTemplateFormData(null);
        handleCloseTemplateFormDialog();
    }

    const handleSaveTemplateChanges = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'UPDATE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDeleteTemplate = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'DELETE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDuplicateTemplate = (newTemplateName: string) => handleWarnUnsavedChanges(() => {
        setTemplateFormData({ templateName: newTemplateName, action: 'DUPLICATE' });
        handleOpenTemplateFormDialog();
    })

    const handleOpenRenameTemplate = (newTemplateName: string) => handleWarnUnsavedChanges(() => {
        setTemplateFormData({ templateName: newTemplateName, action: 'RENAME' });
        handleOpenTemplateFormDialog();
    })

    const handleSubmitActionTemplate: TemplateFunction = (newtemplateName, newSettings) => {
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
            handleUpdateTemplate(newtemplateName, originalTemplateData?.settings || newSettings);
            return;
        }

        if (action === 'UPDATE') {
            handleUpdateTemplate(originalTemplateData?.name || '', newSettings);
            return;
        }
    }

    const handleCreateTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        const newTemplate: Template = {
            name: newtemplateName,
            settings: newSettings,
        }

        createTemplate({ name: newtemplateName, content: newTemplate });
    }

    const handleUpdateTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        const newTemplate: Template = {
            name: newtemplateName,
            settings: newSettings,
        }

        updateTemplate({ name: newtemplateName, content: newTemplate });
    }

    const handleDeleteTemplate = () => {
        if (!templateFormData) return;
        deleteTemplate(templateFormData?.templateName);
    }

    const handleDeleteAllTemplates = () => {
        handleDeselectTemplate();
        deleteAllTemplates();
    }

    const handleSelectTemplateByPosition = (position: number) => {
        if (!templateFiles?.length) return;

        if (templateFiles.length < position) return;
        handleSelectTemplateToPlayByName(templateFiles[position - 1]?.name);
    }

    return {
        selectedTemplateHasUnsavedChanges,
        templates: sortedTemplates,
        selectedTemplateNameToPlay,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlayByName,
        handleSelectTemplateByPosition,
        handleDeselectTemplate,
        handleSubmitActionTemplate,
        handleOpenCreateTemplate,
        handleSaveTemplateChanges,
        handleOpenDeleteTemplate,
        handleDeleteAllTemplates,
        handleOpenRenameTemplate,
        handleOpenDuplicateTemplate,
        handleCloseTemplateForm,
    };
}

export default useTemplates;