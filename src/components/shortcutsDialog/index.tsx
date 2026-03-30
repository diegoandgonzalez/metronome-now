import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    Grid,
    Typography,
} from "@mui/material";
import CustomDialogTitle from "../dialog/customDialogTitle";

type Props = {
    open: boolean,
    handleClose: () => void,
}

const shortcuts = [
    { shortcut: "P", label: "playStop" },
    { shortcut: "↑", label: "addBPM" },
    { shortcut: "↓", label: "subtractBPM" },
    { shortcut: "B", label: "bpmProgrammingAndTimer" },
    { shortcut: "T", label: "templates" },
    { shortcut: "0", label: "setDefaultTemplate" },
    { shortcut: "1 - 9", label: "setTemplate" },
    { shortcut: "←", label: "prevTemplate" },
    { shortcut: "→", label: "nextTemplate" },
    { shortcut: "S", label: "settings" },
    { shortcut: "?", label: "shortcuts" },
];

const ShortcutsDialog = (props: Props) => {

    const {
        open,
        handleClose,
    } = props;

    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <CustomDialogTitle onClose={handleClose}>
                {t("shortcuts")}
            </CustomDialogTitle>
            <DialogContent>
                <Grid container direction={"column"} spacing={1.5}>
                    {
                        shortcuts.map((shortcutItem, shortcutItemIndex) => {
                            const isLast = shortcutItemIndex === shortcuts.length - 1;
                            return (
                                <Grid
                                    key={shortcutItem.shortcut}
                                    container
                                    justifyContent={"space-between"}
                                    spacing={2}
                                    sx={{
                                        paddingBottom: 1.5,
                                        borderBottom: ({ palette }) => !isLast ? `1px solid ${palette.primary.dark}` : "none",
                                    }}
                                >
                                    <Grid size={10}>
                                        <Typography>
                                            {t(shortcutItem.label)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={2}>
                                        <Typography
                                            color="primary"
                                            sx={{
                                                width: "40px",
                                            }}
                                        >
                                            <b>{shortcutItem.shortcut}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default ShortcutsDialog;