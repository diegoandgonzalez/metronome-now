import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import useSnackbarContext from "./useSnackbarContext";
import styles from "./snackbar.module.css";

const Snackbar = () => {
 // TODO
    const {
        open,
        text,
        type,
        secondsToClose,
        handleClose,
    } = useSnackbarContext();

    useEffect(() => {
        let timeout: number;
        if (open && secondsToClose) {
            timeout = window.setTimeout(() => {
                handleClose();
            }, secondsToClose * 1000)
        }

        return () => clearTimeout(timeout);
    }, [open, secondsToClose, handleClose])

    return (
        <div
            className={styles.snackbar}
            data-is-open={String(open)}
        >
            <div data-type={type}>
                {text}
                <IconButton
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Snackbar;