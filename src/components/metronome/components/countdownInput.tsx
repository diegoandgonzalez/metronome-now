import { useTranslation } from "react-i18next";
import { METRONOME_CONSTANTS } from "../../../utils/constants";

type Props = {
    initialAmount: number,
    handleClick: (newAmount: number) => void,
}

const CountdownInput = (props: Props) => {

    const {
        initialAmount,
        handleClick,
    } = props;

    const { t } = useTranslation();

    return (
        <label
            htmlFor="countdown"
            className="countdownInputContainer"
        >
            {t("countdown")}:
            <select
                id="countdown"
                value={initialAmount}
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