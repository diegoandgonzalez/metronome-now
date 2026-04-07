import { Button, Grid, IconButton, Typography } from "@mui/material";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import useIsMobileSize from "../../utils/hooks/useIsMobileSize";
import DotsMenu from "../dotsMenu";
import HelpIcon from "@mui/icons-material/Help";
import TranslateIcon from "@mui/icons-material/Translate";

type Props = {
    handleTitleClick: () => void,
    handleShortcutsClick: () => void,
    handleChangeLanguage: (arg: string) => void,
}

const Header = (props: Props) => {

    const {
        handleTitleClick,
        handleShortcutsClick,
        handleChangeLanguage,
    } = props;

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
                            onClick={handleShortcutsClick}
                        >
                            <HelpIcon />
                        </IconButton>
                    }
                    <DotsMenu
                        icon={<TranslateIcon />}
                        options={LANGUAGE_OPTIONS.map((language) => {
                            return ({
                                key: language.value,
                                label: language.name,
                                onClick: () => handleChangeLanguage(language.value),
                            })
                        })
                        }
                    />
                </Grid>
            </Grid>
        </header>
    );
}

export default Header;