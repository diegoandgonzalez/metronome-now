import { useTranslations } from "next-intl";
import { Grid, Typography } from "@mui/material";
import DotsMenu from "@/components/dotsMenu";

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

    const t = useTranslations();

    return (
        <Grid
            role="button"
            container alignItems={"center"} justifyContent={"space-between"} spacing={2} wrap="nowrap"
            sx={{
                width: "100%",
                color: ({ palette }) => selected ? palette.primary.main : palette.text.primary,
            }}
            onClick={() => {
                if (selected) return;
                handleSelectTemplate();
            }}
        >
            <div>
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
        </Grid>
    );
}

export default TemplateItem;