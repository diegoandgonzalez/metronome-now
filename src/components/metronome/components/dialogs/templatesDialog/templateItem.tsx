import { useTranslation } from "react-i18next";
import EditIcon from "../../../../../assets/icons/editIcon";
import DeleteIcon from "../../../../../assets/icons/deleteIcon";
import PlayIcon from "../../../../../assets/icons/playIcon";

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
        <div className="listItem">
            <div className="playContainer">
                <button
                    title={t("selectTemplate")}
                    onClick={(e) => {
                        e.currentTarget.blur();
                        handleSelectTemplate();
                    }}
                >
                    <PlayIcon size={16} />
                </button>
                <div data-is-selected={String(selected)} onClick={handleSelectTemplate}>
                    <p className="templateName">
                        {name}
                    </p>
                    <p className="templateDescription">
                        {description}
                    </p>
                </div>
            </div>
            {
                editable &&
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