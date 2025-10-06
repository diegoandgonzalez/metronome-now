import { useTranslation } from "react-i18next";
import EditIcon from "../../../../../assets/icons/editIcon";
import DeleteIcon from "../../../../../assets/icons/deleteIcon";
import DuplicateIcon from "../../../../../assets/icons/duplicateIcon";
import DotsMenu from "../../../../dotsMenu";

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
                editable &&
                <div className="actionsContainer">
                    <DotsMenu
                        options={[
                            {
                                name: t("updateTemplate"),
                                icon: <EditIcon size={15} />,
                                onClick: () => {
                                    if (handleUpdateTemplate) {
                                        handleUpdateTemplate();
                                    }
                                },
                            },
                            {
                                name: t("deleteTemplate"),
                                icon: <DeleteIcon size={15} />,
                                onClick: () => {
                                    if (handleDeleteTemplate) {
                                        handleDeleteTemplate();
                                    }
                                },
                            }
                        ]}
                    />
                </div>
            }
        </div>
    );
}

export default TemplateItem;