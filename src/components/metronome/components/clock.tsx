import { useTranslation } from "react-i18next";
import { formatMsToHHMMSS } from "../../../utils/format";
import PauseIcon from "../../../assets/icons/pauseIcon";
import PlayIcon from "../../../assets/icons/playIcon";

type Props = {
  hidePauseButton: boolean,
  isPlaying: boolean,
  isPaused: boolean,
  value: number,
  secondsToStop?: number,
  handleClick: () => void,
};

const Clock = (props: Props) => {

  const {
    hidePauseButton,
    isPlaying,
    isPaused,
    value,
    secondsToStop,
    handleClick,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="clockContainer">
      {
        isPlaying && !hidePauseButton &&
        <button
          className="pauseButton"
          title={t(isPaused ? "resume" : "pause")}
          onClick={handleClick}
        >
          {
            isPaused ? <PlayIcon size={20} /> : <PauseIcon size={20} />
          }
        </button>
      }
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