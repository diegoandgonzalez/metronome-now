import { useTranslations } from "next-intl";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import useIsMobileSize from "@/utils/hooks/useIsMobileSize";
import LocaleSelector from "@/components/localeSelector";

type Props = {
    disableLocaleSelector: boolean,
    handleTitleClick: () => void,
    handleShortcutsClick: () => void,
}

const Header = (props: Props) => {

    const {
        disableLocaleSelector,
        handleTitleClick,
        handleShortcutsClick,
    } = props;

    const t = useTranslations();
    const isMobileSize = useIsMobileSize();

    return (
        <header style={{ width: "100%", padding: 20, paddingTop: 10, paddingBottom: 0 }}>
            <Grid container justifyContent={"space-between"} alignItems={"center"} spacing={2}>
                <Button
                    onClick={handleTitleClick}
                    color="inherit"
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
                    {
                        !isMobileSize &&
                        <IconButton
                            aria-label={t("shortcuts")}
                            onClick={handleShortcutsClick}
                        >
                            <HelpIcon />
                        </IconButton>
                    }
                    <LocaleSelector disabled={disableLocaleSelector} />
                </Grid>
            </Grid>
        </header>
    );
}

export default Header;