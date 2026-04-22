"use client"
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

    const handleSnackbarClose = (_: unknown, reason?: string) => {
        if (reason === 'clickaway') return;
        handleClose();
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={secondsToClose * 1000}
            onClose={handleSnackbarClose}
        >
            <Alert
                onClose={handleSnackbarClose}
                severity={(type || 'error') as AlertColor}
                variant='filled'
                sx={{
                    width: "100%",
                    borderRadius: (theme) => theme.shape.borderRadius,
                }}
            >
                {text}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;