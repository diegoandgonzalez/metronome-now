import { useTranslation } from "react-i18next";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Grid, IconButton, Typography } from "@mui/material";
import { formatMsToHHMMSS } from "../../utils/format";
import TimeSlider from "./timeSlider";

type Props = {
  showOnlyClock: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  value: number;
  secondsToStop: number;
  currentMeasure: number;
  measureToStop: number;
  handleClick: () => void;
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "75px 1fr 75px",
        alignItems: "center",
        height: 50,
      }}
    >
      <Grid container justifyContent={"center"}>
        <IconButton
          onClick={handleClick}
          title={t(isPaused ? "resume" : "pause")}
          sx={{ visibility: isPlaying && !showOnlyClock ? "visible" : "hidden" }}
        >
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
      </Grid>
      {
        Boolean(secondsToStop) &&
        <div style={{ width: "250px" }}>
          <TimeSlider
            value={value}
            max={secondsToStop * 1000}
          />
        </div>
      }
      {
        !secondsToStop &&
        <Typography title={t("playedTime")} align="center" sx={{ fontSize: "1.4rem", width: "125px" }}>
          {formatMsToHHMMSS(value)}
        </Typography>
      }
      <Grid container justifyContent={"center"}>
        <Typography
          sx={{ visibility: Boolean(currentMeasure) && !showOnlyClock ? "visible" : "hidden" }}
        >
          (
          <span title={t("currentMeasure")}>{currentMeasure}</span>
          {Boolean(measureToStop) && (
            <>
              <span>/</span>
              <span title={t("timerValue")}>{measureToStop}</span>
            </>
          )}
          )
        </Typography>
      </Grid>
    </div>
  );
};

export default Clock;