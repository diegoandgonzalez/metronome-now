import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, Grid, IconButton } from "@mui/material";

type Props = {
    children: string,
    onClose: () => void,
}

const CustomDialogTitle = (props: Props) => {

    const {
        children,
        onClose,
    } = props;

    return (
        <DialogTitle>
            <Grid container alignItems={"center"} justifyContent={"space-between"} wrap="nowrap" spacing={5}>
                {children}
                <IconButton
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </Grid>
        </DialogTitle>
    )
}

export default CustomDialogTitle;