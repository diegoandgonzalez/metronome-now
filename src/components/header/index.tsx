import { useTranslation } from "react-i18next";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

type Props = {
    handleTitleClick: () => void,
    handleShortcutsClick: () => void,
    handleSettingsClick: () => void,
}

const Header = (props: Props) => {

    const {
        handleTitleClick,
        handleShortcutsClick,
        handleSettingsClick,
    } = props;

    const { t } = useTranslation();

    return (
        <header style={{ width: "100%", padding: 20, paddingTop: 10, paddingBottom: 0 }}>
            <Grid container justifyContent={"space-between"} alignItems={"center"} spacing={2}>
                <Button
                    onClick={handleTitleClick}
                    color="inherit"
                    title={`v${__APP_VERSION__}`}
                    sx={{
                        padding: 0,
                        display: "flex",
                        gap: "5px",
                        fontSize: "24px",
                        fontWeight: 600,
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    Metronome
                    <Typography component="span" variant="h5" color="primary" fontWeight={"inherit"}>
                        Now
                    </Typography>
                </Button>
                <Grid container spacing={1}>
                    <IconButton
                        title={t("shortcuts") + " (?)"}
                        onClick={handleShortcutsClick}
                    >
                        <HelpIcon />
                    </IconButton>
                    <IconButton
                        title={t("settings") + " (s)"}
                        onClick={handleSettingsClick}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </header>
    );
}

export default Header;