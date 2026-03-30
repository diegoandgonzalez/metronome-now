import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import type { MetronomeSettings, Template } from "../../utils/types";
import { DEFAULT_SETTINGS, TEMPLATE_NAME_MAX_LENGTH } from "../../utils/constants";
import TemplateItem from "./templateItem";
import { Dialog, DialogContent, Grid, IconButton, TextField } from "@mui/material";
import CustomDialogTitle from "../dialog/customDialogTitle";

type Props = {
    open: boolean,
    disabled: boolean,
    selectedTemplateId: string
    templates: Template[],
    handleSelectTemplate: (templateId: string) => void,
    handleCreateTemplate: () => void,
    handleRenameTemplate: (templateId: string) => void,
    handleUpdateTemplate: (templateId: string) => void,
    handleDuplicateTemplate: (templateId: string) => void,
    handleDeleteTemplate: (templateId: string) => void,
    handleClose: () => void,
}

const TemplatesDialog = (props: Props) => {

    const {
        open,
        disabled,
        selectedTemplateId,
        templates,
        handleSelectTemplate,
        handleCreateTemplate,
        handleRenameTemplate,
        handleUpdateTemplate,
        handleDuplicateTemplate,
        handleDeleteTemplate,
        handleClose,
    } = props;

    const [searchValue, setSearchValue] = useState("");

    const { t } = useTranslation();

    const getTemplateDescription = (metronomeSettings: MetronomeSettings = DEFAULT_SETTINGS.metronomeSettings) => {
        return `${metronomeSettings.bpm} bpm - ${metronomeSettings.beatsPerMeasure}/${metronomeSettings.noteValue}`;
    }

    const selectedTemplate = useMemo(() => {
        return templates.find((template) => template.id === selectedTemplateId);
    }, [templates, selectedTemplateId])

    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => template.name.toLowerCase().includes(searchValue.toLowerCase()))
    }, [templates, searchValue])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <CustomDialogTitle onClose={handleClose}>
                {t("templates")}
            </CustomDialogTitle>
            <DialogContent>
                <Grid container alignItems={"center"} spacing={1} sx={{ marginBottom: "20px" }}>
                    <TextField
                        variant="outlined"
                        label={t("searchTemplate")}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH))}
                    />
                    <IconButton
                        disabled={disabled}
                        title={t("createTemplate")}
                        onClick={handleCreateTemplate}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
                {
                    !searchValue &&
                    <div>
                        <TemplateItem
                            editable={Boolean(selectedTemplate)}
                            selected={true}
                            name={selectedTemplate?.name || t("defaultTemplate")}
                            description={getTemplateDescription(selectedTemplate?.settings?.metronomeSettings || DEFAULT_SETTINGS.metronomeSettings)}
                            handleSelectTemplate={() => handleSelectTemplate(selectedTemplateId)}
                            handleRenameTemplate={() => handleRenameTemplate(selectedTemplateId)}
                            handleUpdateTemplate={() => handleUpdateTemplate(selectedTemplateId)}
                            handleDuplicateTemplate={() => handleDuplicateTemplate(selectedTemplateId)}
                            handleDeleteTemplate={() => handleDeleteTemplate(selectedTemplateId)}
                        />
                    </div>
                }
                <ol>
                    {
                        (selectedTemplate || (!selectedTemplate && searchValue)) &&
                        <li>
                            <TemplateItem
                                editable={false}
                                selected={selectedTemplateId === ""}
                                name={t("defaultTemplate")}
                                description={getTemplateDescription(DEFAULT_SETTINGS.metronomeSettings)}
                                handleSelectTemplate={() => handleSelectTemplate("")}
                            />
                        </li>
                    }
                    {
                        filteredTemplates.map((template) => {
                            if (selectedTemplateId === template.id && !searchValue) return null;
                            return (
                                <li key={template.id}>
                                    <TemplateItem
                                        editable={true}
                                        selected={selectedTemplateId === template.id}
                                        name={template.name}
                                        description={getTemplateDescription(template.settings?.metronomeSettings)}
                                        handleSelectTemplate={() => handleSelectTemplate(template.id)}
                                        handleRenameTemplate={() => handleRenameTemplate(template.id)}
                                        handleUpdateTemplate={() => handleUpdateTemplate(template.id)}
                                        handleDuplicateTemplate={() => handleDuplicateTemplate(template.id)}
                                        handleDeleteTemplate={() => handleDeleteTemplate(template.id)}
                                    />
                                </li>
                            )
                        })
                    }
                </ol>
            </DialogContent>
        </Dialog>
    );
}

export default TemplatesDialog;