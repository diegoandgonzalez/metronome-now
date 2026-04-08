import { useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import type { Settings, Template } from "../../utils/types";
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
    const selectedItemRef = useRef<HTMLLIElement | null>(null);

    const scrollToSelectedItem = () => {
        selectedItemRef.current?.scrollIntoView({ block: "center" });
    };

    const getTemplateDescription = (settings: Settings = DEFAULT_SETTINGS) => {
        const {
            metronomeSettings,
            tempoProgrammingSettings,
        } = settings;

        const tempo = tempoProgrammingSettings.isActive ? `${tempoProgrammingSettings.fromBPM} ${t("bpm")} - ${tempoProgrammingSettings.toBPM} ${t("bpm")}` : `${metronomeSettings.bpm} bpm`;
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
            maxWidth={"xs"}
            fullWidth={true}
            fullScreen={useFullScreen}
            slotProps={{ transition: { onEntering: scrollToSelectedItem } }}
        >
            <CustomDialogTitle onClose={handleClose}>
                {t("templates")}
            </CustomDialogTitle>
            <Grid container alignItems={"center"} justifyContent={"space-between"} spacing={2} sx={{ padding: "0px 24px", marginBottom: 1 }}>
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
            <DialogContent sx={{ height: "500px", paddingTop: 0 }}>
                <List>
                    <ListItem
                        sx={{ marginBottom: 1 }}
                        ref={!selectedTemplateId ? selectedItemRef : null}
                        disablePadding
                    >
                        <TemplateItem
                            editable={false}
                            selected={!selectedTemplateId}
                            name={t("defaultTemplate")}
                            description={getTemplateDescription(DEFAULT_SETTINGS)}
                            handleSelectTemplate={() => handleSelectTemplate("")}
                        />
                    </ListItem>
                    {
                        filteredTemplates.map((template) => {
                            return (
                                <ListItem
                                    key={template.id}
                                    ref={template.id === selectedTemplateId ? selectedItemRef : null}
                                    disablePadding
                                >
                                    <TemplateItem
                                        editable={true}
                                        selected={selectedTemplateId === template.id}
                                        name={template.name}
                                        description={getTemplateDescription(template.settings)}
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