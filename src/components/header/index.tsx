import { useTranslation } from "react-i18next";
import SettingsIcon from "../../assets/icons/settingsIcon";
import styles from "./header.module.css";

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
            <button
                title={t("settings")}
                onClick={handleSettingsClick}
            >
                <SettingsIcon size={25} />
            </button>
        </header>
    );
}

export default Header;