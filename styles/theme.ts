import { createTheme } from '@mui/material/styles';
import type { } from '@mui/x-date-pickers/themeAugmentation';

declare module '@mui/material/styles' {
    interface Palette {
        border: {
            main: string;
        };
        beatType: {
            accent: { main: string, light: string };
            noAccent: { main: string, light: string };
            muted: { main: string, light: string };
        }
    }
    interface PaletteOptions {
        border?: {
            main?: string;
        };
        beatType?: {
            accent?: { main: string, light: string };
            noAccent?: { main: string, light: string };
            muted?: { main: string, light: string };
        }
    }
    interface ButtonPropsVariantOverrides {
        dark: true;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        dark: true;
    }
}

const appTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#d42b3c' },
        secondary: { main: '#232027' },
        text: { primary: '#ffffff' },
        background: { default: '#19171c', paper: '#232027' },
        border: {
            main: '#403946',
        },
        beatType: {
            accent: { main: '#d42b3c', light: '#66171E' },
            noAccent: { main: '#b1b1b1', light: '#6B6B6B' },
            muted: { main: '#3e3e3e', light: '#222' },
        },
    },
    typography: {
        fontFamily: 'Space Grotesk',
    },
    shape: { borderRadius: '1rem' },
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                '*::-webkit-scrollbar': {
                    width: '6px',
                },
                '*::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.border.main,
                    borderRadius: '10px',
                },
                '::selection': {
                    backgroundColor: theme.palette.primary.main,
            },
            }),
        },
        MuiInput: {
            styleOverrides: {
                input: ({ theme }) => ({
                    '&.Mui-disabled': {
                        WebkitTextFillColor: theme.palette.text.primary,
                    },
                }),
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                    '&.Mui-focused': {
                        color: theme.palette.text.primary,
                    },
                }),
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: '0.625rem 1rem',
                    cursor: 'pointer',
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.border.main}`,
                    background: theme.palette.secondary.main,
                    '&:focus-visible': {
                        outline: `3px solid ${theme.palette.primary.main}`,
                        outlineOffset: '2px',
                    },
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: ({ theme }) => ({
                    borderColor: theme.palette.border.main,
                }),
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.secondary.main,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: `3px solid ${theme.palette.primary.main}`,
                    },
                }),
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    fontFamily: 'inherit',
                    borderRadius: theme.shape.borderRadius,
                    '&.Mui-focusVisible': {
                        outline: `3px solid ${theme.palette.primary.main}`,
                        outlineOffset: '2px',
                    },
                }),
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-focusVisible': {
                        outline: 'none',
                    },
                },
            },
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.shape.borderRadius,
                    '&:has(.Mui-focusVisible)': {
                        outline: `3px solid ${theme.palette.primary.main}`,
                        outlineOffset: '2px',
                    },
                }),
                label: {
                    paddingRight: 8,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                    '&:hover': {
                        background: theme.palette.border.main,
                    },
                }),
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: { display: 'none' },
                select: ({ theme }) => ({
                    textAlign: 'center',
                    padding: '0.5rem 0.5rem !important',
                    backgroundColor: theme.palette.secondary.main,
                }),
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    overflow: 'hidden',
                },
                list: {
                    overflowY: 'auto',
                    maxHeight: '75svh',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    '&:hover': {
                        background: theme.palette.border.main,
                    },
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: theme.palette.primary.main,
                    },
                }),
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: 'dark' },
                    style: ({ theme }) => ({
                        border: `1px solid ${theme.palette.border.main}`,
                        backgroundColor: theme.palette.secondary.main,
                        color: 'white',
                        '&:hover': {
                            backgroundColor: theme.palette.border.main,
                        },
                    }),
                },
            ],
            styleOverrides: {
                root: ({ theme }) => ({
                    fontWeight: 400,
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                }),
            },
        },
        MuiTextField: {
            defaultProps: {
                autoComplete: 'off',
                inputProps: {
                    autoComplete: 'off',
                },
            },
            styleOverrides: {
                root: {
                    '& input[type=number]': { MozAppearance: 'textfield' },
                    '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                    '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: ({ theme }) => ({
                    marginTop: '-1px',
                    backgroundImage: 'none',
                    border: '1px solid',
                    borderColor: theme.palette.border.main,
                }),
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderWidth: 0,
                },
                filledError: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
                filledSuccess: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
                filledWarning: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
                filledInfo: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
                icon: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
                action: ({ theme }) => ({
                    color: theme.palette.text.primary,
                    '& .MuiIconButton-root:hover': {
                        backgroundColor: 'transparent',
                    },
                }),
            },
        },
        MuiPickersInputBase: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: theme.shape.borderRadius,
                    '& fieldset': {
                        borderColor: theme.palette.border.main,
                    },
                    '&.Mui-focused fieldset': {
                        border: `3px solid ${theme.palette.primary.main} !important`,
                    },
                }),
            },
        },
        MuiDialog: {
            defaultProps: {
                PaperProps: {
                    elevation: 0,
                },
            },
            styleOverrides: {
                paper: ({ theme }) => ({
                    border: 'none',
                    backgroundColor: theme.palette.background.default,
                }),
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: 12,
                },
            },
        },
    },
});

export default appTheme;