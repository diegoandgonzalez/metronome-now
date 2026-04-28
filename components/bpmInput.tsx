'use client'
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { METRONOME_CONSTANTS } from '@/utils/constants';
import { useSnackbar } from '@/components/snackbar/context';
import useTapTempo from '@/utils/hooks/useTapTempo';

type Props = {
  disabled?: boolean,
  initialBPM: number,
  handleChange: (value: number) => void,
}

const scaleEffect = {
  transition: "scale 0.3s cubic-bezier(0.35, 1.55, 0.65, 1)",
  "&:active": {
    scale: 1.1,
  },
}

const BPMInput = (props: Props) => {

  const {
    disabled = false,
    initialBPM,
    handleChange,
  } = props;

  const t = useTranslations();

  const [bpm, setBPM] = useState(String(initialBPM));
  const { tap } = useTapTempo();

  // so that when the BPM changes from outside, input fields update with that value
  useEffect(() => {
    setBPM(String(initialBPM));
  }, [initialBPM])

  const { handleOpen: handleOpenSnackbar } = useSnackbar();

  const handleSubmit = (newValue = bpm) => {
    if (disabled) return;
    const valueToSubmit = parseInt(newValue);
    if (isNaN(valueToSubmit) || valueToSubmit < METRONOME_CONSTANTS.minBPM || valueToSubmit > METRONOME_CONSTANTS.maxBPM) {
      handleOpenSnackbar({ text: t('bpmMustBeInRange', { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }) });
      setBPM(String(initialBPM));
      return;
    }

    setBPM(String(valueToSubmit));
    handleChange(valueToSubmit);
  }

  const subtractOneBPM = () => {
    if (disabled) return;
    const newBPM = Number(bpm) - 1;
    if (newBPM < METRONOME_CONSTANTS.minBPM) return;
    handleSubmit(String(newBPM));
  }

  const addOneBPM = () => {
    if (disabled) return;
    const newBPM = Number(bpm) + 1;
    if (newBPM > METRONOME_CONSTANTS.maxBPM) return;
    handleSubmit(String(newBPM));
  }

  return (
    <Tooltip title={disabled ? t('tempoProgrammingActive') : ''}>
      <Grid container direction={'column'}>
        <TextField
          disabled={disabled}
          title={t('bpm')}
          type='number'
          id='bpmInput'
          value={bpm}
          onChange={(e) => setBPM(e.target.value.substring(0, 3))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
              handleSubmit();
            }
          }}
          onBlur={() => handleSubmit()}
          variant='standard'
          sx={{
            '& input': {
              fontSize: '5rem',
              textAlign: 'center',
              marginLeft: '2.5rem',
            },
          }}
          slotProps={{
            input: {
              disableUnderline: true,
              endAdornment: <InputAdornment position='end'>{t('bpm')}</InputAdornment>,
            },
            htmlInput: {
              'aria-label': t('bpm'),
              min: METRONOME_CONSTANTS.minBPM,
              max: METRONOME_CONSTANTS.maxBPM,
            }
          }}
        />
        <Grid container justifyContent={'center'} spacing={1}>
          <Button
            disabled={disabled}
            title={t('subtractBPM')}
            aria-label={t('subtractBPM')}
            variant='contained'
            sx={{ ...scaleEffect, minWidth: 0, padding: 1 }}
            onClick={subtractOneBPM}
          >
            <RemoveIcon sx={{ fontSize: '1.25rem' }} />
          </Button>
          <Button
            disabled={disabled}
            title={t('tapToGetBPM')}
            variant='contained'
            sx={{ ...scaleEffect }}
            onClick={() => {
              const tappedBPM = tap();
              if (!tappedBPM) return;
              handleSubmit(String(tappedBPM))
            }}
            >
            <TouchAppIcon sx={{ fontSize: '1.25rem' }} />
          </Button>
          <Button
            disabled={disabled}
            title={t('addBPM')}
            aria-label={t('addBPM')}
            variant='contained'
            sx={{ ...scaleEffect, minWidth: 0, padding: 1 }}
            onClick={addOneBPM}
          >
            <AddIcon sx={{ fontSize: '1.25rem' }} />
          </Button>
        </Grid>
      </Grid>
    </Tooltip>
  );
};

export default BPMInput;