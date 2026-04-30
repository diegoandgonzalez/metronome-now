import { useTranslations } from 'next-intl';
import { Grid, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { formatMsToHHMMSS } from '@/utils/helpers';

type Props = {
  isInCountdown: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  value: number;
  secondsToStop: number;
  currentMeasure: number;
  measureToStop: number;
  countdownLength: number;
  handleClick: () => void;
  handleToggleMetronome: () => void;
};

const Clock = (props: Props) => {
  const {
    isInCountdown,
    isPlaying,
    isPaused,
    value,
    secondsToStop,
    currentMeasure,
    measureToStop,
    countdownLength,
    handleClick,
  } = props;

  const t = useTranslations();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2.5rem 1fr 2.5rem',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <Grid container justifyContent={'center'}>
        <IconButton
          title={t('pause')}
          aria-label={t('pause')}
          onClick={handleClick}
          sx={{ visibility: isPlaying && !isInCountdown ? 'visible' : 'hidden' }}
        >
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
      </Grid>
      <Grid container direction={'column'} alignItems={'center'}>
        <Typography align='center' sx={{ fontSize: '1.4rem', width: '8rem' }}>
          {secondsToStop ? `-${formatMsToHHMMSS(secondsToStop * 1000 - value)}` : formatMsToHHMMSS(value)}
        </Typography>
        <Typography variant='caption' sx={{ visibility: isPlaying ? 'visible' : 'hidden' }}>

          {
            !isInCountdown ?
              `${currentMeasure}${measureToStop ? ` ${t('of')} ${measureToStop}` : ''} ${t('measures')}`
              : `${currentMeasure || 1}${` ${t('of')} ${countdownLength}`} ${t('measures')} (${t('countdown')})`
          }
        </Typography>
      </Grid>
    </div>
  );
};

export default Clock;