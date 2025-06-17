import { useTranslation } from "react-i18next";
import { formatMsToHHMMSS } from "../../../utils/format";

type Props = {
  value: number,
  secondsToStop?: number,
};

const Clock = (props: Props) => {

  const {
    value,
    secondsToStop,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="clockContainer">
      <p className="clock" title={t("playedTime")}>
        {formatMsToHHMMSS(value)}
      </p>
      {
        Boolean(secondsToStop) &&
        <>
          <p>/</p>
          <p className="clock" title={t("timerValue")}>
            {formatMsToHHMMSS(secondsToStop as number * 1000)}
          </p>
        </>
      }
    </div>
  );
};

export default Clock;