import { useEffect } from "react";
import CloseButton from "../closeButton";
import useSnackbarContext from "./useSnackbarContext";

const Snackbar = () => {

    const {
        open,
        text,
        secondsToClose,
        handleClose,
    } = useSnackbarContext();

    useEffect(() => {
        let timeout: number;
        if (open && secondsToClose) {
            timeout = setTimeout(() => {
                handleClose();
            }, secondsToClose * 1000)
        }

        return () => clearTimeout(timeout);
    }, [secondsToClose, handleClose])

    return (
        <div
            className="snackbar"
            data-is-open={String(open)}
        >
            <div className="snackbarContent">
                {text}
                <CloseButton handleClose={handleClose} />
            </div>
        </div>
    )
}

export default Snackbar;