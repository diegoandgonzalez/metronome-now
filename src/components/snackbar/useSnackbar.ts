import { useState } from "react";

const useSnackbar = () => {

    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [secondsToClose, setSecondsToClose] = useState(0);
    const [type, setType] = useState("");

    const handleOpen = (newText: string, newSecondsToClose?: number, newType?: string) => {
        setText(newText);
        setSecondsToClose(newSecondsToClose || 5);
        setType(newType || "");
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setText("");
        setType("");
        setSecondsToClose(0);
    }

    return {
        open,
        text,
        type,
        secondsToClose,
        handleOpen,
        handleClose,
    }
}

export default useSnackbar;