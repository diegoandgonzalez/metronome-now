'use client'
import { AlertColor } from '@mui/material';
import { createContext, useContext, useState } from 'react';

export type SnackbarState = {
    text: string;
    open?: boolean;
    secondsToClose?: number;
    type?: AlertColor;
}
export type SnackbarContextValue = {
    state: SnackbarState,
    handleOpen: (newState: SnackbarState) => void;
    handleClose: () => void;
}

const initialState: SnackbarState = {
    open: false,
    text: '',
    secondsToClose: 5,
    type: 'error',
};

export const useSnackbarState = (): SnackbarContextValue => {
    const [state, setState] = useState<SnackbarState>(initialState);

    const handleOpen = (newState: SnackbarState) => setState({ ...newState, open: true });
    const handleClose = () => setState(initialState);

    return { state, handleOpen, handleClose };
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = (): SnackbarContextValue => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) throw new Error('useSnackbar must be used inside SnackbarProvider');
    return ctx;
};

export default SnackbarContext;