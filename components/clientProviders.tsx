'use client'
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SnackbarContext, { useSnackbarState } from '@/components/snackbar/context';
import appTheme from '@/styles/theme';
import ConfirmationDialogContext, { useConfirmationDialogState } from '@/components/confirmationDialog/context';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
    const snackbarValue = useSnackbarState();
    const confirmationDialogState = useConfirmationDialogState();

    return (
        <SessionProvider refetchOnWindowFocus={false}>
            <QueryClientProvider client={queryClient}>
                <SnackbarContext.Provider value={snackbarValue}>
                    <ConfirmationDialogContext.Provider value={confirmationDialogState}>
                        <ThemeProvider theme={appTheme}>
                            <CssBaseline />
                            {children}
                        </ThemeProvider>
                    </ConfirmationDialogContext.Provider>
                </SnackbarContext.Provider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
