'use client'
import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Button,
    Dialog,
    DialogContent,
    Grid,
    List,
    ListItem,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Settings, Template } from '@/utils/types';
import { DEFAULT_SETTINGS, TEMPLATE_NAME_MAX_LENGTH } from '@/utils/constants';
import useIsMobileSize from '@/utils/hooks/useIsMobileSize';
import TemplateItem from '@/components/templateItem';
import DialogTitle from '@/components/dialogTitle';

type Props = {
    open: boolean,
    selectedTemplateName: string
    templates: Template[],
    selectedTemplateHasUnsavedChanges: boolean,
    handleSelectTemplate: (templateName: string) => void,
    handleCreateTemplate: () => void,
    handleRenameTemplate: (templateName: string) => void,
    handleSaveTemplateChanges: (templateName: string) => void,
    handleDuplicateTemplate: (templateName: string) => void,
    handleDeleteTemplate: (templateName: string) => void,
    handleClose: () => void,
}

const TemplatesDialog = (props: Props) => {

    const {
        open,
        selectedTemplateName,
        templates,
        selectedTemplateHasUnsavedChanges,
        handleSelectTemplate,
        handleCreateTemplate,
        handleRenameTemplate,
        handleSaveTemplateChanges,
        handleDuplicateTemplate,
        handleDeleteTemplate,
        handleClose,
    } = props;

    const t = useTranslations();

    const [searchValue, setSearchValue] = useState('');

    const useFullScreen = useIsMobileSize();
    const selectedItemRef = useRef<HTMLLIElement | null>(null);

    const scrollToSelectedItem = () => {
        selectedItemRef.current?.scrollIntoView({ block: 'center' });
    };

    const getTemplateDescription = (settings: Settings = DEFAULT_SETTINGS) => {
        const {
            metronomeSettings,
            tempoProgrammingSettings,
        } = settings;

        const tempo = tempoProgrammingSettings.isActive ? `${tempoProgrammingSettings.fromBPM} ${'bpm'} - ${tempoProgrammingSettings.toBPM} ${'bpm'}` : `${metronomeSettings.bpm} bpm`;
        const timeSignature = `(${metronomeSettings.beatsPerMeasure}/${metronomeSettings.noteValue})`;
        return `${tempo} ${timeSignature}`;
    }

    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => template.name.toLowerCase().includes(searchValue.toLowerCase()));
    }, [templates, searchValue])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'xs'}
            fullWidth={true}
            fullScreen={useFullScreen}
            slotProps={{ transition: { onEntering: scrollToSelectedItem } }}
        >
            <DialogTitle onClose={handleClose}>
                {t('templates')}
            </DialogTitle>
            <DialogContent sx={{ paddingBottom: 1 }}>
                <Grid container alignItems={'center'} justifyContent={'space-between'} spacing={2}>
                    <TextField
                        variant='outlined'
                        label={t('searchTemplate')}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH))}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        title={t('createTemplate')}
                        aria-label={t('createTemplate')}
                        variant='contained'
                        sx={{ minWidth: 0, padding: 1 }}
                        onClick={handleCreateTemplate}
                    >
                        <AddIcon />
                    </Button>
                </Grid>
            </DialogContent>
            <DialogContent sx={{ height: '30rem', paddingTop: 0 }}>
                <List>
                    <ListItem
                        sx={{ marginBottom: 1 }}
                        ref={!selectedTemplateName ? selectedItemRef : null}
                        disablePadding
                    >
                        <TemplateItem
                            editable={false}
                            selected={!selectedTemplateName}
                            name={t('defaultTemplate')}
                            description={getTemplateDescription(DEFAULT_SETTINGS)}
                            handleSelect={() => handleSelectTemplate('')}
                        />
                    </ListItem>
                    {
                        filteredTemplates.map((template) => {
                            const isSelected = selectedTemplateName === template.name;

                            return (
                                <ListItem
                                    key={template.name}
                                    ref={isSelected ? selectedItemRef : null}
                                    disablePadding
                                >
                                    <TemplateItem
                                        editable={true}
                                        selected={isSelected}
                                        name={template.name}
                                        description={getTemplateDescription(template.settings)}
                                        hasUnsavedChanges={isSelected ? selectedTemplateHasUnsavedChanges : false}
                                        handleSelect={() => handleSelectTemplate(template.name)}
                                        handleRename={() => handleRenameTemplate(template.name)}
                                        handleDuplicate={() => handleDuplicateTemplate(template.name)}
                                        handleSaveChanges={() => handleSaveTemplateChanges(template.name)}
                                        handleDelete={() => handleDeleteTemplate(template.name)}
                                    />
                                </ListItem>
                            )
                        })
                    }
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default TemplatesDialog;