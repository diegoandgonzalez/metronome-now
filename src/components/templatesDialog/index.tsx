import { useMemo, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import type { MetronomeSettings, Template } from "../../utils/types";
import { DEFAULT_SETTINGS, TEMPLATE_NAME_MAX_LENGTH } from "../../utils/constants";
import Dialog from "../dialog/dialog";
import TemplateItem from "./templateItem";
import styles from "./templatesDialog.module.css";
import IconButton from "../iconButton";

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
            title={t("templates")}
            handleClose={handleClose}
        >
            <div className={styles.templatesDialogContent}>
                <div className={styles.templatesDialogHeader}>
                    <search>
                        <input
                            id="searchTemplate"
                            type="text"
                            placeholder={t("searchTemplate")}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH))}
                        />
                    </search>
                    <IconButton
                        disabled={disabled}
                        variant="square"
                        title={t("createTemplate")}
                        onClick={handleCreateTemplate}
                    >
                        <RiAddFill size={20} />
                    </IconButton>
                </div>
                {
                    !searchValue &&
                    <div className={filteredTemplates.length ? styles.selectedTemplateContainer : ""}>
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
            </div>
        </Dialog>
    );
}

export default TemplatesDialog;