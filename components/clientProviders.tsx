'use client'
import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SnackbarContext, { useSnackbarState } from '@/components/snackbar/context';
import appTheme from '@/styles/theme';
import ConfirmationDialogContext, { useConfirmationDialogState } from '@/components/confirmationDialog/context';

export default function ClientProviders({ children }: { children: ReactNode }) {
    const snackbarValue = useSnackbarState();
    const confirmationDialogState = useConfirmationDialogState();

    return (
        <SnackbarContext.Provider value={snackbarValue}>
            <ConfirmationDialogContext.Provider value={confirmationDialogState}>
                <ThemeProvider theme={appTheme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ConfirmationDialogContext.Provider>
        </SnackbarContext.Provider>
    );
}
