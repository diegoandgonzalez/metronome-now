'use client'
import { useSnackbar } from '@/components/snackbar/context';
import { Alert, Snackbar } from '@mui/material';

const CustomSnackbar = () => {
    const {
        state,
        handleClose,
        resetState,
    } = useSnackbar();

    const {
        text,
        open = false,
        secondsToClose = 5,
        type = 'error',
    } = state;

    const handleSnackbarClose = (_: unknown, reason?: string) => {
        if (reason === 'clickaway') return;
        handleClose();
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={secondsToClose * 1000}
            onClose={handleSnackbarClose}
            slotProps={{
                transition: {
                    onExited: resetState,
                },
            }}
        >
            <Alert
                onClose={handleSnackbarClose}
                severity={type}
                variant='filled'
                sx={{
                    width: '100%',
                    borderRadius: (theme) => theme.shape.borderRadius,
                }}
            >
                {text}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;