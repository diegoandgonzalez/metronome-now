import { useTranslation } from "react-i18next";
import Dialog from "../dialog/dialog";
import styles from "./shortcutsDialog.module.css";

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
            title={t("shortcuts")}
            handleClose={handleClose}
        >
            <div className={styles.shortcutsContainer}>
                {
                    shortcuts.map((shortcutItem) => {
                        return (
                            <div key={shortcutItem.shortcut}>
                                <p>{t(shortcutItem.label)}</p>
                                <b>{shortcutItem.shortcut}</b>
                            </div>
                        )
                    })
                }
            </div>
        </Dialog>
    );
}

export default ShortcutsDialog;