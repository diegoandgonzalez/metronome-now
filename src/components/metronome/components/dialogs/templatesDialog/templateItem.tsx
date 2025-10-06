import { useTranslation } from "react-i18next";
import EditIcon from "../../../../../assets/icons/editIcon";
import DeleteIcon from "../../../../../assets/icons/deleteIcon";
import DuplicateIcon from "../../../../../assets/icons/duplicateIcon";

type Props = {
    selected: boolean,
    editable: boolean,
    name: string,
    description: string,
    handleSelectTemplate: () => void,
    handleUpdateTemplate?: () => void,
    handleDeleteTemplate?: () => void,
}

const TemplateItem = (props: Props) => {

    const {
        selected,
        editable,
        name,
        description,
        handleSelectTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
    } = props;

    const { t } = useTranslation();

    return (
        <div
            className="listItem"
            data-is-selected={String(selected)}
        >
            <div
                className="playContainer"
                onClick={() => {
                    if (selected) return;
                    handleSelectTemplate();
                }}
            >
                <div title={name}>
                    <p className="templateName">
                        {name}
                    </p>
                    <p className="templateDescription">
                        {description}
                    </p>
                </div>
            </div>
            {
                editable && selected &&
                <div className="actionsContainer">
                    <button
                        title={t("updateTemplate")}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            if (handleUpdateTemplate) {
                                handleUpdateTemplate();
                            }
                        }}
                    >
                        <EditIcon size={16} />
                    </button>
                    {/* <button
                        title={t("duplicateTemplate")}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            if (handleUpdateTemplate) {
                                handleUpdateTemplate();
                            }
                        }}
                    >
                        <DuplicateIcon size={16} />
                    </button> */}
                    <button
                        title={t("deleteTemplate")}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            if (handleDeleteTemplate) {
                                handleDeleteTemplate();
                            }
                        }}
                    >
                        <DeleteIcon size={16} />
                    </button>
                </div>
            }
        </div>
    );
}

export default TemplateItem;