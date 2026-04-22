'use client'
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SnackbarContext, { useSnackbarState } from '@/components/snackbar/context';
import appTheme from '@/styles/theme';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
    const snackbarValue = useSnackbarState();

    return (
        <SessionProvider refetchOnWindowFocus={false}>
            <QueryClientProvider client={queryClient}>
                <SnackbarContext.Provider value={snackbarValue}>
                    <ThemeProvider theme={appTheme}>
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </SnackbarContext.Provider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
