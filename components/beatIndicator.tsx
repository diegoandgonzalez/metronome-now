'use client'
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
  const t = useTranslations();

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
      container direction={'column'} alignItems={'center'} justifyContent={'center'} spacing={0.75}
      sx={{ minHeight: '5rem' }}
    >
      {
        splitBeatArray.map((beatArray, beatArrayIndex) => {
          return (
            <Grid key={beatArrayIndex} container alignItems={'center'} justifyContent={'center'} spacing={0.75}>
              {
                beatArray.map((beatIndex) => {
                  const isCurrentBeat = currentBeatInMeasure === beatIndex;
                  const beatType = beatTypes[beatIndex];

                  return (
                    <Button
                      title={`${t('beat')} ${beatIndex + 1}`}
                      aria-label={`${t('beat')} ${beatIndex + 1}`}
                      key={beatIndex}
                      onClick={() => handleClick(beatIndex)}
                      sx={{
                        minWidth: '2rem',
                        width: '2rem',
                        height: '2rem',
                        filter: (!isPlaying || isCurrentBeat) ? 'brightness(130%)' : '',
                        scale: isCurrentBeat ? 1.15 : 1,
                        transition: "scale 0.15s cubic-bezier(0.35, 1.55, 0.65, 1)",
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