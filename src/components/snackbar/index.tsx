import { useEffect } from "react";
import useSnackbarContext from "./useSnackbarContext";
import IconButton from "../iconButton";
import styles from "./snackbar.module.css";
import { MdClose } from "react-icons/md";

const Snackbar = () => {

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
                    color="transparent"
                    onClick={handleClose}
                >
                    <MdClose />
                </IconButton>
            </div>
        </div>
    )
}

export default Snackbar;