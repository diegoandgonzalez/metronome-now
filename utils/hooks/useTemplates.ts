'use client'
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FileToCreate, Template, TemplateFormData, TemplateFunction } from '@/utils/types';
import useDialog from '@/utils/hooks/useDialog';
import { useSnackbar } from '@/components/snackbar/context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useDriveAppData from '@/utils/hooks/useDriveAppData';

const KEY = 'template-files';

const useTemplates = (onTemplateSelectionCallback?: (args?: Template) => void) => {

    const t = useTranslations();

    const {
        isReady,
        readAllFiles,
        writeFile,
        deleteFile,
    } = useDriveAppData();

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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEY] });
            handleSelectTemplateToPlayByObject();
            handleOpenSnackbar({ text: t('templateDeleted'), type: 'success' });
        },
    });

    const [selectedTemplateNameToPlay, setSelectedTemplateNameToPlay] = useState<string>(''); // TODO: valor inicial?
    const [templateFormData, setTemplateFormData] = useState<TemplateFormData | null>(null);

    const {
        dialogIsOpen: templateFormDialogIsOpen,
        handleOpenDialog: handleOpenTemplateFormDialog,
        handleCloseDialog: handleCloseTemplateFormDialog,
    } = useDialog();

    const { handleOpen: handleOpenSnackbar } = useSnackbar();

    const handleSelectTemplateToPlayByName = (newTemplateName: string) => {
        if (!onTemplateSelectionCallback) return;
        if (newTemplateName === selectedTemplateNameToPlay) return;
        if (!templates?.length) return;

        setSelectedTemplateNameToPlay(newTemplateName);

        const templateSelected = templates.find((template) => template.name === newTemplateName);

        onTemplateSelectionCallback(templateSelected);
        handleOpenSnackbar({ text: t('templateSelected'), type: 'success' });
    }

    const handleSelectTemplateToPlayByObject = (newTemplate?: Template) => {
        if (!onTemplateSelectionCallback) return;
        setSelectedTemplateNameToPlay(newTemplate?.name || '');
        onTemplateSelectionCallback(newTemplate);
    }

    const handleOpenCreateTemplate = () => {
        setTemplateFormData({ templateName: '', action: 'CREATE' });
        handleOpenTemplateFormDialog();
    }

    const handleCloseTemplateForm = () => {
        setTemplateFormData(null);
        handleCloseTemplateFormDialog();
    }

    const handleOpenUpdateTemplate = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'UPDATE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDeleteTemplate = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'DELETE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenDuplicateTemplate = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'DUPLICATE' });
        handleOpenTemplateFormDialog();
    }

    const handleOpenRenameTemplate = (newTemplateName: string) => {
        setTemplateFormData({ templateName: newTemplateName, action: 'RENAME' });
        handleOpenTemplateFormDialog();
    }

    const handleSubmitActionTemplate: TemplateFunction = (newtemplateName, newSettings) => {
        if (!templateFormData) return;

        const {
            action,
            templateName,
        } = templateFormData;

        const originalTemplateData = templates.find((template) => template.name === templateName);

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

    const handleSelectTemplateByPosition = (position: number) => {
        if (!templateFiles?.length) return;

        if (templateFiles.length < position) return;
        handleSelectTemplateToPlayByName(templateFiles[position - 1]?.name);
    }

    const handleSelectPrevTemplate = () => {
        if (!templateFiles?.length) return;

        const templateIndex = templateFiles.findIndex((template) => template.name === selectedTemplateNameToPlay);
        const prevTemplateName = templateFiles[templateIndex - 1]?.name || '';
        handleSelectTemplateToPlayByName(prevTemplateName);
    }

    const handleSelectNextTemplate = () => {
        if (!templateFiles?.length) return;

        const templateIndex = templateFiles.findIndex((template) => template.name === selectedTemplateNameToPlay);
        if (templateIndex === templateFiles.length - 1) return;

        const nextTemplateName = templateFiles[templateIndex + 1].name;
        handleSelectTemplateToPlayByName(nextTemplateName);
    }

    const sortedTemplates = useMemo(() => {
        if (!templates?.length) return [];
        return templates.sort((a, b) => a.name.localeCompare(b.name));
    }, [templates])

    return {
        templates: sortedTemplates,
        selectedTemplateNameToPlay,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlayByName,
        handleSelectTemplateByPosition,
        handleSelectPrevTemplate,
        handleSelectNextTemplate,
        handleSubmitActionTemplate,
        handleOpenCreateTemplate,
        handleOpenUpdateTemplate,
        handleOpenDeleteTemplate,
        handleOpenRenameTemplate,
        handleOpenDuplicateTemplate,
        handleCloseTemplateForm,
    };
}

export default useTemplates;