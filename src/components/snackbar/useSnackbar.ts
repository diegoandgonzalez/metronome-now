import { useState } from 'react';

const useSnackbar = () => {

    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [secondsToClose, setSecondsToClose] = useState(0);

    const handleOpen = (newText: string, newSecondsToClose: number) => {
        setText(newText);
        setSecondsToClose(newSecondsToClose || 5);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setText("");
        setSecondsToClose(0);
    }

    return {
        open,
        text,
        secondsToClose,
        handleOpen,
        handleClose,
    }
}

export default useSnackbar;