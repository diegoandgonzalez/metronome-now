import { useState } from "react";

const useDialog = () => {

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogIsOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogIsOpen(false);
    };

    return {
        dialogIsOpen,
        handleOpenDialog,
        handleCloseDialog,
    }
}


export default useDialog;