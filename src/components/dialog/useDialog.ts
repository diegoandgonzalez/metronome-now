import { useRef } from "react";

const useDialog = () => {

    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleOpenDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const handleCloseDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    return {
        dialogRef,
        handleOpenDialog,
        handleCloseDialog,
    }
}


export default useDialog;