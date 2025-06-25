import { useTranslation } from "react-i18next";
import CreateIcon from "../../../assets/icons/createIcon";
import DeleteIcon from "../../../assets/icons/deleteIcon";
import EditIcon from "../../../assets/icons/editIcon";
import type {
    Template,
} from "../types";

type Props = {
    disabled: boolean,
    value: string
    templates: Template[],
    handleSelectTemplate: (newTemplateID: string) => void,
    handleCreateTemplate: () => void,
    handleUpdateTemplate: () => void,
    handleDeleteTemplate: () => void,
}

const TemplatesInput = (props: Props) => {

    const {
        disabled,
        value,
        templates,
        handleSelectTemplate,
        handleCreateTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
    } = props;

    const { t } = useTranslation();

    return (
        <div className="templatesInputContainer">
            <select
                disabled={disabled}
                className="templatesInput"
                value={value}
                onChange={(e) => {
                    e.currentTarget.blur();
                    handleSelectTemplate(e.target.value);
                }}
            >
                <option value={""}>{t("noTemplate")}</option>
                {
                    templates
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((template) => {
                            return (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            )
                        })
                }
            </select>
            <button
                className="templatesButton"
                disabled={disabled}
                title={t("createTemplate")}
                onClick={(e) => {
                    e.currentTarget.blur();
                    handleCreateTemplate();
                }}
            >
                {<CreateIcon size={22} />}
            </button>
            {
                Boolean(value) &&
                <>
                    <button
                        className="templatesButton"
                        disabled={disabled}
                        title={t("updateTemplate")}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            handleUpdateTemplate();
                        }}
                    >
                        {<EditIcon size={18} />}
                    </button>
                    <button
                        className="templatesButton"
                        disabled={disabled}
                        title={t("deleteTemplate")}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            handleDeleteTemplate();
                        }}
                    >
                        {<DeleteIcon size={16} />}
                    </button>
                </>
            }
        </div>
    );
}

export default TemplatesInput;