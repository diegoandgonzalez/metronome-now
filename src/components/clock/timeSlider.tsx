import { formatMsToHHMMSS } from "../../utils/format";
import { Grid, Slider, Typography } from "@mui/material";

type Props = {
  value: number;
  max: number;
};

const TimeSlider = (props: Props) => {
  const {
    value,
    max,
  } = props;

  return (
    <Grid container alignItems={"center"} justifyContent={"center"} size={12}>
      <Slider
        size="small"
        value={value}
        min={0}
        step={1}
        max={max}
        sx={{
          width: "100%",
          cursor: "default",
          height: "4px",
          padding: "6px",
        }}
      />
      <Grid container alignItems={"center"} justifyContent={"space-between"} size={12} spacing={1}>
        <Typography align="center" sx={{ fontSize: "1.1rem" }}>
          {formatMsToHHMMSS(value)}
        </Typography>
        <Typography align="center" sx={{ fontSize: "1.1rem" }}>
          -{formatMsToHHMMSS(max - value)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TimeSlider;