import { useTranslation } from "react-i18next";
import { METRONOME_CONSTANTS } from "../../utils/constants";
import styles from "./countdownInput.module.css";

type Props = {
    initialValue: number,
    handleClick: (newAmount: number) => void,
}

const CountdownInput = (props: Props) => {

    const {
        initialValue,
        handleClick,
    } = props;

    const { t } = useTranslation();

    return (
        <label
            className={styles.countdownInputContainer}
            htmlFor="countdown"
        >
            {t("countdown")}:
            <select
                id="countdown"
                value={initialValue}
                onChange={(e) => handleClick(Number(e.target.value))}
            >
                {
                    METRONOME_CONSTANTS.countdownOptions.map((countdown) => {
                        return (
                            <option key={countdown} value={countdown}>{countdown}</option>
                        )
                    })
                }
            </select>
        </label>
    )
}

export default CountdownInput;