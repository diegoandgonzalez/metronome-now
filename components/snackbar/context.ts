'use client'
import { AlertColor } from '@mui/material';
import { createContext, useContext, useState } from 'react';

export type SnackbarState = {
    text: string;
    secondsToClose?: number;
    type?: AlertColor;
}
export type SnackbarContextValue = {
    open: boolean,
    state: SnackbarState,
    handleOpen: (newState: SnackbarState) => void;
    handleClose: () => void;
    resetState: () => void;
}

const initialState: SnackbarState = {
    text: '',
    secondsToClose: 5,
    type: 'error',
};

export const useSnackbarState = (): SnackbarContextValue => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<SnackbarState>(initialState);

    const handleOpen = (newState: SnackbarState) => {
        setState(newState);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);
    const resetState = () => setState(initialState);

    return { open, state, handleOpen, handleClose, resetState };
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = (): SnackbarContextValue => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) throw new Error('useSnackbar must be used inside SnackbarProvider');
    return ctx;
};

export default SnackbarContext;