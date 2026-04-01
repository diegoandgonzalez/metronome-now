import { useTranslation } from "react-i18next";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Grid, IconButton, Typography } from "@mui/material";
import { formatMsToHHMMSS } from "../../utils/format";

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
        gridTemplateColumns: "40px 1fr 40px",
        alignItems: "center",
        gap: 10,
        height: 70,
      }}
    >
      <Grid container justifyContent={"center"}>
        <IconButton
          onClick={handleClick}
          sx={{ visibility: isPlaying && !showOnlyClock ? "visible" : "hidden" }}
        >
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
      </Grid>
      <div>
        <Typography align="center" sx={{ fontSize: "1.4rem", width: "125px" }}>
          {secondsToStop ? `-${formatMsToHHMMSS(secondsToStop * 1000 - value)}` : formatMsToHHMMSS(value)}
        </Typography>
        <Grid container justifyContent={"center"}>
          <Typography
            variant="caption"
            sx={{ visibility: Boolean(currentMeasure) && !showOnlyClock ? "visible" : "hidden" }}
          >
            {`${currentMeasure}${measureToStop ? ` ${t("of")} ${measureToStop}` : ""} ${t("measures")}`}
          </Typography>
        </Grid>
      </div>
    </div>
  );
};

export default Clock;