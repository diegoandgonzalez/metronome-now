import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
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
        round: true;
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        round: true;
    }
}

const appTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#d42b3c" },
        secondary: { main: "#232027" },
        success: { main: "#1c8d42" },
        text: { primary: "#ffffff" },
        background: { default: "#19171c", paper: "#232027" },
        border: {
            main: "#403946",
        },
        beatType: {
            accent: { main: "#d42b3c", light: "#66171E" },
            noAccent: { main: "#b1b1b1", light: "#6B6B6B" },
            muted: { main: "#3e3e3e", light: "#222" },
        },
    },
    typography: {
        fontFamily: "Space Grotesk",
    },
    shape: { borderRadius: 10 },
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                "*::-webkit-scrollbar": {
                    width: "6px",
                },
                "*::-webkit-scrollbar-track": {
                    background: "transparent",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.palette.border.main,
                    borderRadius: "10px",
                },
            }),
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: ({ theme }) => ({
                    borderColor: theme.palette.border.main,
                }),
                root: ({ theme }) => ({
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid",
                        borderColor: theme.palette.border.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid",
                        borderColor: theme.palette.border.main,
                    },
                }),
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: { display: "none" },
                select: ({ theme }) => ({
                    textAlign: "center",
                    padding: "8px 10px !important",
                    backgroundColor: theme.palette.secondary.main,
                }),
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    display: "flex",
                    justifyContent: "center",
                    "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: theme.palette.primary.main,
                    },
                }),
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: "round", color: "primary" },
                    style: ({ theme }) => ({
                        borderRadius: "100%",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        aspectRatio: 1,
                        padding: 0,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }),
                },
                {
                    props: { variant: "round", color: "secondary" },
                    style: ({ theme }) => ({
                        borderRadius: "100%",
                        border: "1px solid",
                        borderColor: theme.palette.border.main,
                        backgroundColor: theme.palette.secondary.main,
                        color: "white",
                        aspectRatio: 1,
                        padding: 0,
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.dark,
                        },
                    }),
                },
            ],
            styleOverrides: {
                root: {
                    fontWeight: 400,
                    textTransform: "none",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& input[type=number]": { MozAppearance: "textfield" },
                    "& input[type=number]::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
                    "& input[type=number]::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: ({ theme }) => ({
                    marginTop: "-1px",
                    backgroundImage: "none",
                    border: "1px solid",
                    borderColor: theme.palette.border.main,
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
                    border: "none",
                    backgroundColor: theme.palette.background.default,
                }),
            },
        },
    },
});

export default appTheme;