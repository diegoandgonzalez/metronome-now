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
            htmlFor="countdownInput"
            className="countdownInputContainer"
        >
            {t("countdown")}:
            <select
                id="countdownInput"
                value={initialAmount}
                onChange={(e) => {
                    e.currentTarget.blur();
                    handleClick(Number(e.target.value));
                }}
            >
                {
                    METRONOME_CONSTANTS.countdownOptions.map((item) => {
                        return (
                            <option key={item} value={item}>{item}</option>
                        )
                    })
                }
            </select>
        </label>
    )
}

export default CountdownInput;