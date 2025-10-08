import { useTranslation } from "react-i18next";
import EditIcon from "../../../../../assets/icons/editIcon";
import DeleteIcon from "../../../../../assets/icons/deleteIcon";
import DotsMenu from "../../../../dotsMenu";
import DuplicateIcon from "../../../../../assets/icons/duplicateIcon";
import OverwriteIcon from "../../../../../assets/icons/overwriteIcon";

type Props = {
    selected: boolean,
    editable: boolean,
    name: string,
    description: string,
    handleSelectTemplate: () => void,
    handleRenameTemplate?: () => void,
    handleUpdateTemplate?: () => void,
    handleDuplicateTemplate?: () => void,
    handleDeleteTemplate?: () => void,
}

const TemplateItem = (props: Props) => {

    const {
        selected,
        editable,
        name,
        description,
        handleSelectTemplate,
        handleRenameTemplate,
        handleUpdateTemplate,
        handleDuplicateTemplate,
        handleDeleteTemplate,
    } = props;

    const { t } = useTranslation();

    return (
        <div
            role="button"
            tabIndex={0}
            className="templateItem"
            data-is-selected={String(selected)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (selected) return;
                    handleSelectTemplate();
                }
            }}
            onClick={() => {
                if (selected) return;
                handleSelectTemplate();
            }}
        >
            <div>
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
                editable &&
                <DotsMenu
                    options={[
                        {
                            key: "rename",
                            label: t("renameTemplate"),
                            icon: <EditIcon size={15} />,
                            onClick: () => handleRenameTemplate?.(),
                        },
                        {
                            key: "update",
                            label: t("updateTemplate"),
                            icon: <OverwriteIcon size={15} />,
                            onClick: () => handleUpdateTemplate?.(),
                        },
                        {
                            key: "duplicate",
                            label: t("duplicateTemplate"),
                            icon: <DuplicateIcon size={15} />,
                            onClick: () => handleDuplicateTemplate?.(),
                        },
                        {
                            key: "delete",
                            label: t("deleteTemplate"),
                            icon: <DeleteIcon size={15} />,
                            onClick: () => handleDeleteTemplate?.(),
                        }
                    ].filter((option) => {
                        if (!selected && option.key === "update") return false;
                        return true;
                    })}
                />
            }
        </div>
    );
}

export default TemplateItem;