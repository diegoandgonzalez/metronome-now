import { useTranslation } from "react-i18next";

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
                onChange={(e) => handleClick(Number(e.target.value))}
            >
                {
                    [0, 1, 2, 3, 4].map((item) => {
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