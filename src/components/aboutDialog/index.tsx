import {
    Dialog,
    DialogContent,
    Typography,
} from "@mui/material";
import CustomDialogTitle from "../dialog/customDialogTitle";

type Props = {
    open: boolean,
    handleClose: () => void,
}

const AboutDialog = (props: Props) => {

    const {
        open,
        handleClose,
    } = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <CustomDialogTitle onClose={handleClose}>
                {"Metronome Now"}
            </CustomDialogTitle>
            <DialogContent>
                <Typography>
                    {`v${__APP_VERSION__}`}
                </Typography>
            </DialogContent>
        </Dialog>
    );
}

export default AboutDialog;