import { useTranslation } from "react-i18next";
import SettingsIcon from "../../assets/icons/settingsIcon";
import styles from "./header.module.css";
import IconButton from "../iconButton";

type Props = {
    handleTitleClick: () => void,
    handleSettingsClick: () => void,
}

const Header = (props: Props) => {

    const {
        handleTitleClick,
        handleSettingsClick,
    } = props;

    const { t } = useTranslation();

    return (
        <header className={styles.header}>
            <h1
                title={`v${__APP_VERSION__}`}
                onClick={handleTitleClick}
            >
                Metronome <b>Now</b>
            </h1>
            <IconButton
                title={t("settings")}
                color="transparent"
                onClick={handleSettingsClick}
            >
                <SettingsIcon size={22} />
            </IconButton>
        </header>
    );
}

export default Header;