import { useTranslation } from "react-i18next";
import { formatMsToHHMMSS } from "../../utils/format";
import PauseIcon from "../../assets/icons/pauseIcon";
import PlayIcon from "../../assets/icons/playIcon";
import styles from "./clock.module.css";
import IconButton from "../iconButton";

type Props = {
  showOnlyClock: boolean,
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
    showOnlyClock,
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
    <div className={styles.clockContainer}>
      {
        isPlaying && !showOnlyClock &&
        <IconButton
          color="transparent"
          onClick={handleClick}
          title={t(isPaused ? "resume" : "pause")}
        >
          {isPaused ? <PlayIcon size={20} /> : <PauseIcon size={20} />}
        </IconButton>
      }
      <p className={styles.clock} title={t("playedTime")}>
        {formatMsToHHMMSS(value)}
      </p>
      {
        Boolean(secondsToStop) &&
        <>
          <span>/</span>
          <p className={styles.clock} title={t("timerValue")}>
            {formatMsToHHMMSS(secondsToStop as number * 1000)}
          </p>
        </>
      }
      {
        Boolean(currentMeasure) && !showOnlyClock &&
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