import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { METRONOME_CONSTANTS } from "../../utils/constants";
import { useTranslation } from "react-i18next";

type Props = {
  noteValue: number,
  beatsPerMeasure: number,
  handleSetBeatsPerMeasure: (newValue: number) => void,
  handleSetNoteValue: (newValue: number) => void,
}

const TimeSignatureInput = (props: Props) => {

  const {
    noteValue,
    beatsPerMeasure,
    handleSetBeatsPerMeasure,
    handleSetNoteValue,
  } = props;

  const { t } = useTranslation();

  return (
    <Grid container alignItems={"center"} spacing={1}>
      <Select
        aria-label={t("beatsPerMeasure")}
        value={beatsPerMeasure}
        onChange={(e) => handleSetBeatsPerMeasure(Number(e.target.value))}
        sx={{ width: 40 }}
      >
        {
          METRONOME_CONSTANTS.beatsPerMeasureOptions.map((_, index) => {
            return (
              <MenuItem key={index} value={index + 1}>{index + 1}</MenuItem>
            )
          })
        }
      </Select>
      <Typography>/</Typography>
      <Select
        aria-label={t("beatValue")}
        value={noteValue}
        onChange={(e) => handleSetNoteValue(Number(e.target.value))}
        sx={{ width: 40 }}
      >
        {
          METRONOME_CONSTANTS.noteValueOptions.map((noteValue) => {
            return (
              <MenuItem key={noteValue} value={noteValue}>{noteValue}</MenuItem>
            )
          })
        }
      </Select>
    </Grid>
  );
};

export default TimeSignatureInput;