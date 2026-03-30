import { useTranslation } from "react-i18next";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { formatMsToHHMMSS } from "../../utils/format";
import { Grid, IconButton, Typography } from "@mui/material";

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
    <Grid container alignItems={"center"} justifyContent={"center"} spacing={1} wrap="wrap">
      <IconButton
        onClick={handleClick}
        title={t(isPaused ? "resume" : "pause")}
        sx={{
          visibility: (isPlaying && !showOnlyClock) ? "visible" : "hidden",
        }}
      >
        {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
      <Typography
        title={t("playedTime")}
        align="center"
        sx={{
          fontSize: "1.4rem",
          width: "100px",
        }}
      >
        {formatMsToHHMMSS(value)}
      </Typography>
      {
        Boolean(secondsToStop) &&
        <>
          <span>/</span>
          <Typography
            title={t("timerValue")}
            align="center"
            sx={{
              fontSize: "1.4rem",
              width: "100px",
            }}
          >
            {formatMsToHHMMSS(secondsToStop as number * 1000)}
          </Typography>
        </>
      }
      <Typography
        sx={{
          visibility: (Boolean(currentMeasure) && !showOnlyClock) ? "visible" : "hidden",
        }}
      >
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
      </Typography>
    </Grid>
  );
};

export default Clock;