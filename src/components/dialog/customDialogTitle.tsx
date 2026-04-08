import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, Grid, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
    children: string,
    onClose: () => void,
}

const CustomDialogTitle = (props: Props) => {

    const {
        children,
        onClose,
    } = props;

    const { t } = useTranslation();

    return (
        <DialogTitle>
            <Grid container alignItems={"center"} justifyContent={"space-between"} wrap="nowrap" spacing={5}>
                {children}
                <IconButton
                    title={t("close")}
                    aria-label={t("close")}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </Grid>
        </DialogTitle>
    )
}

export default CustomDialogTitle;