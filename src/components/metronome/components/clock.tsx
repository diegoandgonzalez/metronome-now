import { useTranslation } from "react-i18next";
import { formatMsToHHMMSS } from "../../../utils/format";
import PauseIcon from "../../../assets/icons/pauseIcon";
import PlayIcon from "../../../assets/icons/playIcon";

type Props = {
  isPlayingCountdown: boolean,
  isPlaying: boolean,
  isPaused: boolean,
  value: number,
  secondsToStop: number,
  currentMeasure: number,
  measureToStop: number,
  handleClick: () => void,
};

const Clock = (props: Props) => {

  const {
    isPlayingCountdown,
    isPlaying,
    isPaused,
    value,
    secondsToStop,
    currentMeasure,
    measureToStop,
    handleClick,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="clockContainer">
      {
        isPlaying && !isPlayingCountdown &&
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
      {
        Boolean(currentMeasure) && !isPlayingCountdown &&
        <p>
          (
          <span title={t("currentMeasure")}>
            {currentMeasure}
          </span>
          {
            Boolean(measureToStop) &&
            <>
              <span>/</span>
              <span title={t("timerValue")}>
                {measureToStop}
              </span>
            </>
          }
          )
        </p>
      }
    </div>
  );
};

export default Clock;