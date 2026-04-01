import { Alert, Snackbar, type AlertColor } from "@mui/material";
import useSnackbarContext from "./useSnackbarContext";

const CustomSnackbar = () => {
    const {
        open,
        text,
        type,
        secondsToClose,
        handleClose,
    } = useSnackbarContext();

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={secondsToClose * 1000}
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity={(type || "error") as AlertColor}
                variant="filled"
                sx={{
                    width: "100%",
                    borderRadius: (theme) => theme.shape.borderRadius,
                }}
            >
                {text}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackbar;