import { useTranslation } from "react-i18next";
import { RiSettings5Fill } from "react-icons/ri";
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
                title={t("settings") + " (s)"}
                color="transparent"
                onClick={handleSettingsClick}
            >
                <RiSettings5Fill size={24} />
            </IconButton>
        </header>
    );
}

export default Header;