import { useMemo } from "react";
import { Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

type Props = {
  isPlaying: boolean,
  beatTypes: number[],
  beatsPerMeasure: number
  currentBeatInMeasure: number
  handleClick: (beatIndex: number) => void,
};

const BeatIndicator = (props: Props) => {

  const {
    isPlaying,
    beatTypes,
    beatsPerMeasure,
    currentBeatInMeasure,
    handleClick,
  } = props;

  const { palette } = useTheme();
  const { t } = useTranslation();

  const beatColors = [palette.beatType.accent, palette.beatType.noAccent, palette.beatType.muted];

  const splitBeatArray = useMemo(() => {
    const spliceIndex = beatsPerMeasure <= 4 ? beatsPerMeasure : Math.floor(beatsPerMeasure / 2);

    const beatArray = Array.from(Array(beatsPerMeasure).keys());
    const firstHalfArray = beatArray.splice(0, spliceIndex);
    const secondHalfArray = beatArray;

    return [firstHalfArray, secondHalfArray];
  }, [beatsPerMeasure]);

  return (
    <Grid
      container direction={"column"} alignItems={"center"} justifyContent={"center"} spacing={1}
      sx={{
        minHeight: "80px",
        margin: "30px 0px",
      }}
    >
      {
        splitBeatArray.map((beatArray, beatArrayIndex) => {
          return (
            <Grid key={beatArrayIndex} container alignItems={"center"} justifyContent={"center"} spacing={1}>
              {
                beatArray.map((beatIndex) => {
                  const isCurrentBeat = currentBeatInMeasure === beatIndex;
                  const beatType = beatTypes[beatIndex];

                  return (
                    <Button
                      aria-label={`${t("beat")} ${beatIndex + 1}`}
                      key={beatIndex}
                      onClick={() => handleClick(beatIndex)}
                      sx={{
                        minWidth: "30px",
                        width: "30px",
                        height: "30px",
                        filter: (!isPlaying || isCurrentBeat) ? "brightness(130%)" : "",
                        scale: isCurrentBeat ? 1.15 : 1,
                        backgroundColor: beatColors[beatType].main,
                        background: `radial-gradient(${beatColors[beatType].main}, ${beatColors[beatType].light})`,
                      }}
                    />
                  )
                })
              }
            </Grid>
          )
        })
      }
    </Grid>
  );
};

export default BeatIndicator;