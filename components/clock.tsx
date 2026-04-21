import { useTranslations } from 'next-intl';
import { Grid, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { formatMsToHHMMSS } from '@/utils/format';

type Props = {
  showOnlyClock: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  value: number;
  secondsToStop: number;
  currentMeasure: number;
  measureToStop: number;
  handleClick: () => void;
  handleToggleMetronome: () => void;
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

  const t = useTranslations();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 40px',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <Grid container justifyContent={'center'}>
        <IconButton
          title={t('pause')}
          aria-label={t('pause')}
          onClick={handleClick}
          sx={{ visibility: isPlaying && !showOnlyClock ? 'visible' : 'hidden' }}
        >
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
      </Grid>
      <Grid container direction={'column'} alignItems={'center'}>
        <Typography align='center' sx={{ fontSize: '1.4rem', width: '125px' }}>
          {secondsToStop ? `-${formatMsToHHMMSS(secondsToStop * 1000 - value)}` : formatMsToHHMMSS(value)}
        </Typography>
        <Typography variant='caption'>
          {`${currentMeasure}${measureToStop ? ` ${t('of')} ${measureToStop}` : ''} ${t('measures')}`}
        </Typography>
      </Grid>
    </div>
  );
};

export default Clock;