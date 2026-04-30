'use client'
import { createContext, useContext, useState } from 'react';

export type ConfirmationDialogState = {
    question: string | React.ReactNode;
    handleConfirm: () => void;
}
export type ConfirmationDialogContextValue = {
    open: boolean,
    state: ConfirmationDialogState,
    handleOpen: (newState: ConfirmationDialogState) => void;
    handleClose: () => void;
    resetState: () => void;
}

const initialState: ConfirmationDialogState = {
    question: '',
    handleConfirm: () => null,
};

export const useConfirmationDialogState = (): ConfirmationDialogContextValue => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<ConfirmationDialogState>(initialState);

    const handleOpen = (newState: ConfirmationDialogState) => {
        setState(newState)
        setOpen(true)
    };

    const handleClose = () => setOpen(false);
    const resetState = () => setState(initialState);

    return { open, state, handleOpen, handleClose, resetState };
};

const ConfirmationDialogContext = createContext<ConfirmationDialogContextValue | null>(null);

export const useConfirmationDialog = (): ConfirmationDialogContextValue => {
    const ctx = useContext(ConfirmationDialogContext);
    if (!ctx) throw new Error('useConfirmationDialog must be used inside ConfirmationDialogProvider');
    return ctx;
};

export default ConfirmationDialogContext;