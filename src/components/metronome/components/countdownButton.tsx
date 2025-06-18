import { useTranslation } from "react-i18next";

type Props = {
    countdownIsActive: boolean,
    handleClick: () => void,
}

const CountdownButton = (props: Props) => {

    const {
        countdownIsActive,
        handleClick,
    } = props;

    const { t } = useTranslation();

    return (
        <button
            className="countdownButton"
            title={t("playExtraMeasureAtBeggining")}
            onClick={(e) => {
                e.currentTarget.blur();
                handleClick();
            }}
        >
            {t(countdownIsActive ? "disableCountdown" : "enableCountdown")}
        </button>
    );
}

export default CountdownButton;