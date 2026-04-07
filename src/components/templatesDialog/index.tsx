import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import type { MetronomeSettings, Template } from "../../utils/types";
import { DEFAULT_SETTINGS, TEMPLATE_NAME_MAX_LENGTH } from "../../utils/constants";
import useIsMobileSize from "../../utils/hooks/useIsMobileSize";
import TemplateItem from "./templateItem";
import { Button, Dialog, DialogContent, Grid, List, ListItem, TextField } from "@mui/material";
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
    const useFullScreen = useIsMobileSize();

    const getTemplateDescription = (metronomeSettings: MetronomeSettings = DEFAULT_SETTINGS.metronomeSettings) => {
        return `${metronomeSettings.bpm} bpm - ${metronomeSettings.beatsPerMeasure}/${metronomeSettings.noteValue}`;
    }

    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => template.name.toLowerCase().includes(searchValue.toLowerCase()))
    }, [templates, searchValue])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={"xs"}
            fullWidth={true}
            fullScreen={useFullScreen}
        >
            <CustomDialogTitle onClose={handleClose}>
                {t("templates")}
            </CustomDialogTitle>
            <DialogContent
                sx={{
                    // marginBottom: "20px",
                    height: "500px",
                }}
            >
                <Grid container alignItems={"center"} justifyContent={"space-between"} spacing={2} sx={{ marginTop: 1 }}>
                    <TextField
                        variant="outlined"
                        label={t("searchTemplate")}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH))}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        variant="contained"
                        sx={{ minWidth: 0, padding: 1 }}
                        disabled={disabled}
                        onClick={handleCreateTemplate}
                    >
                        <AddIcon />
                    </Button>
                </Grid>
                <List sx={{ marginTop: 1 }}>
                    <ListItem disablePadding>
                        <TemplateItem
                            editable={false}
                            selected={selectedTemplateId === ""}
                            name={t("defaultTemplate")}
                            description={getTemplateDescription(DEFAULT_SETTINGS.metronomeSettings)}
                            handleSelectTemplate={() => handleSelectTemplate("")}
                        />
                    </ListItem>
                    {
                        filteredTemplates.map((template) => {
                            return (
                                <ListItem disablePadding key={template.id}>
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