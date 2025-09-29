import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MetronomeSettings, Template } from "../../../types";
import Dialog from "../../../../dialog/dialog";
import CreateIcon from "../../../../../assets/icons/createIcon";
import { DEFAULT_SETTINGS, TEMPLATE_NAME_MAX_LENGTH } from "../../../../../utils/constants";
import TemplateItem from "./templateItem";

type Props = {
    open: boolean,
    disabled: boolean,
    selectedTemplateId: string
    templates: Template[],
    handleSelectTemplate: (templateId: string) => void,
    handleCreateTemplate: () => void,
    handleUpdateTemplate: (templateId: string) => void,
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
        handleUpdateTemplate,
        handleDeleteTemplate,
        handleClose,
    } = props;

    const [searchValue, setSearchValue] = useState("");

    const { t } = useTranslation();

    const getTemplateDescription = (metronomeSettings: MetronomeSettings = DEFAULT_SETTINGS.metronomeSettings) => {
        return `${metronomeSettings.bpm} bpm - ${metronomeSettings.beatsPerMeasure}/${metronomeSettings.noteValue}`;
    }

    return (
        <Dialog
            open={open}
            title={t("templates")}
            handleClose={handleClose}
        >
            <div className="templatesDialogContainer">
                <div className="searchTemplateInputContainer">
                    <input
                        id="searchTemplate"
                        className="templateNameInput"
                        type="text"
                        placeholder={t("searchTemplate")}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value.substring(0, TEMPLATE_NAME_MAX_LENGTH))}
                    />
                </div>
                <div className="createContainer">
                    <button
                        disabled={disabled}
                        title={t("createTemplate")}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            handleCreateTemplate();
                        }}
                    >
                        <CreateIcon size={16} />
                    </button>
                </div>
                <div className="list">
                    <TemplateItem
                        editable={false}
                        selected={selectedTemplateId === ""}
                        name={t("noTemplate")}
                        description={getTemplateDescription(DEFAULT_SETTINGS.metronomeSettings)}
                        handleSelectTemplate={() => handleSelectTemplate("")}
                    />
                    {
                        templates
                            .filter((template) => template.name.toLowerCase().includes(searchValue.toLowerCase()))
                            .sort((a, b) => -a.name.localeCompare(b.name))
                            .map((template) => {
                                return (
                                    <TemplateItem
                                        key={template.id}
                                        editable={true}
                                        selected={selectedTemplateId === template.id}
                                        name={template.name}
                                        description={getTemplateDescription(template.settings?.metronomeSettings)}
                                        handleSelectTemplate={() => handleSelectTemplate(template.id)}
                                        handleUpdateTemplate={() => handleUpdateTemplate(template.id)}
                                        handleDeleteTemplate={() => handleDeleteTemplate(template.id)}
                                    />
                                )
                            })
                    }
                </div>
            </div>
        </Dialog>
    );
}

export default TemplatesDialog;