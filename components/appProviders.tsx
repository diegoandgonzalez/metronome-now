'use client'
import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useSnackbar from '@/components/snackbar/useSnackbar';
import SnackbarContext from '@/components/snackbar/snackbarContext';
import appTheme from '@/styles/theme';

export default function AppProviders({ children }: { children: ReactNode }) {
    const snackbarValue = useSnackbar();

    return (
        <SnackbarContext.Provider value={snackbarValue}>
            <ThemeProvider theme={appTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </SnackbarContext.Provider>
    );
}
