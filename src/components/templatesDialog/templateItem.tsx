import { useTranslation } from "react-i18next";
import DotsMenu from "../dotsMenu";
import { Typography } from "@mui/material";

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
            <div title={t("setTemplate") + " " + name}>
                <Typography>
                    {name}
                </Typography>
                <Typography variant="caption">
                    {description}
                </Typography>
            </div>
            {
                editable &&
                <DotsMenu
                    options={
                        [
                            {
                                key: "update",
                                label: t("update"),
                                onClick: () => handleUpdateTemplate?.(),
                            },
                            {
                                key: "rename",
                                label: t("rename"),
                                onClick: () => handleRenameTemplate?.(),
                            },
                            {
                                key: "duplicate",
                                label: t("duplicate"),
                                onClick: () => handleDuplicateTemplate?.(),
                            },
                            {
                                key: "delete",
                                label: t("delete"),
                                onClick: () => handleDeleteTemplate?.(),
                            }
                        ]
                            .filter((option) => {
                                if (!selected && option.key === "update") return false;
                                return true;
                            })
                    }
                />
            }
        </div>
    );
}

export default TemplateItem;