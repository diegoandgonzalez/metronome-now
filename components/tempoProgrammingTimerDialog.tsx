'use client'
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    InputAdornment,
    MenuItem,
    Switch,
    TextField,
} from '@mui/material';
import { convertMmSsToSeconds, convertSecondsToMinutesSeconds, handleIntegerKeyDown, handleIntegerPaste } from '@/utils/helpers';
import type { TempoProgrammingSettings, TimerSettings } from '@/utils/types';
import { METRONOME_CONSTANTS, TEMPO_PROGRAMMING_CONSTANTS, TIMER_CONSTANTS } from '@/utils/constants';
import useIsBelowBreakpoint from '@/utils/hooks/useIsBelowBreakpoint';
import { useSnackbar } from '@/components/snackbar/context';
import Container from '@/components/container';
import DialogTitle from '@/components/dialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers';

type Props = {
    open: boolean,
    initialCountdownLength: number,
    initialTempoProgrammingSettings: TempoProgrammingSettings,
    initialTimerSettings: TimerSettings,
    handleSubmit: (countdownLength: number, tempoProgrammingSettings: TempoProgrammingSettings, timerSettings: TimerSettings) => void,
    handleClose: () => void,
}

type FormDataType = {
    countdownLength: number,
    isTempoProgrammingActive: boolean,
    isLoop: boolean,
    bpmToChange: number,
    measuresToChangeBPM: number,
    fromBPM: number,
    toBPM: number,
    isTimeActive: boolean,
    isMeasuresActive: boolean,
    secondsToStop: number,
    measuresToStop: number,
}

type FieldNamesType = keyof FormDataType;

const TempoProgrammingTimerDialog = (props: Props) => {

    const {
        open,
        initialCountdownLength,
        initialTempoProgrammingSettings,
        initialTimerSettings,
        handleSubmit,
        handleClose,
    } = props;

    const t = useTranslations();
    const fullScreen = useIsBelowBreakpoint('xl');

    const { handleOpen: handleOpenSnackbar } = useSnackbar();

    const [isTempoProgrammingActive, setIsTempoProgrammingActive] = useState(initialTempoProgrammingSettings.isActive);
    const [isLoop, setIsLoop] = useState(initialTempoProgrammingSettings.isLoop);
    const [isTimeActive, setIsTimeActive] = useState(initialTimerSettings.isTimeActive);
    const [isMeasuresActive, setIsMeasuresActive] = useState(initialTimerSettings.isMeasuresActive);
    const [fieldsWithErrors, setFieldsWithErrors] = useState<FieldNamesType[]>([]);

    const validate = (formData: FormDataType) => {
        const {
            isTempoProgrammingActive,
            bpmToChange,
            measuresToChangeBPM,
            fromBPM,
            toBPM,
            isTimeActive,
            isMeasuresActive,
            secondsToStop,
            measuresToStop,
        } = formData;

        let dataIsValid = true;
        const newFieldsWithErrors: FieldNamesType[] = [];

        if (isTempoProgrammingActive) {
            if (!(fromBPM >= METRONOME_CONSTANTS.minBPM && fromBPM <= METRONOME_CONSTANTS.maxBPM)) {
                handleOpenSnackbar({ text: t('fromBPMMustBeInRange', { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }) });
                newFieldsWithErrors.push('fromBPM');
                dataIsValid = false;
            }

            if (!(toBPM >= METRONOME_CONSTANTS.minBPM && toBPM <= METRONOME_CONSTANTS.maxBPM)) {
                handleOpenSnackbar({ text: t('toBPMMustBeInRange', { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }) });
                newFieldsWithErrors.push('toBPM');
                dataIsValid = false;
            }

            if (fromBPM === toBPM) {
                handleOpenSnackbar({ text: t('fromBPMMustBeDifferentThanToBPM') });
                newFieldsWithErrors.push('fromBPM', 'toBPM');
                dataIsValid = false;
            }

            if (!(bpmToChange >= TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange && bpmToChange <= TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange)) {
                handleOpenSnackbar({ text: t('bpmToChangeMustBeInRange', { min: TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange, max: TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange }) });
                newFieldsWithErrors.push('bpmToChange');
                dataIsValid = false;
            }

            if (!(measuresToChangeBPM >= TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM && measuresToChangeBPM <= TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM)) {
                handleOpenSnackbar({ text: t('measuresToChangeBPMMustBeInRange', { min: TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM, max: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM }) });
                newFieldsWithErrors.push('measuresToChangeBPM');
                dataIsValid = false;
            }
        }

        if (isTimeActive) {
            if (!secondsToStop) {
                handleOpenSnackbar({ text: t('timeCannotBeEmpty') });
                newFieldsWithErrors.push('secondsToStop');
                dataIsValid = false;
            }

            if (!(secondsToStop >= 0 && secondsToStop <= TIMER_CONSTANTS.maxSecondsToStop)) {
                handleOpenSnackbar({ text: t('secondsMustBeInRange', { min: 0, max: TIMER_CONSTANTS.maxSecondsToStop }) });
                newFieldsWithErrors.push('secondsToStop');
                dataIsValid = false;
            }
        }

        if (isMeasuresActive) {
            if (!(measuresToStop >= 0 && measuresToStop <= TIMER_CONSTANTS.maxMeasuresToStop)) {
                handleOpenSnackbar({ text: t('measuresToStopMustBeInRange', { min: 0, max: TIMER_CONSTANTS.maxMeasuresToStop }) });
                newFieldsWithErrors.push('measuresToStop');
                dataIsValid = false;
            }

            if (!measuresToStop) {
                handleOpenSnackbar({ text: t('measuresToStopCannotBeEmpty') });
                newFieldsWithErrors.push('measuresToStop');
                dataIsValid = false;
            }
        }

        setFieldsWithErrors(newFieldsWithErrors);
        return dataIsValid;
    }

    const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputValues = Object.fromEntries(new FormData(e.currentTarget).entries());
        const formData: FormDataType = {
            isTempoProgrammingActive,
            isLoop,
            isTimeActive,
            isMeasuresActive,
            countdownLength: Number(inputValues.countdownLength) || initialCountdownLength,
            fromBPM: isTempoProgrammingActive ? Number(inputValues.fromBPM) : initialTempoProgrammingSettings.fromBPM,
            toBPM: isTempoProgrammingActive ? Number(inputValues.toBPM) : initialTempoProgrammingSettings.toBPM,
            bpmToChange: isTempoProgrammingActive ? Number(inputValues.bpmToChange) : initialTempoProgrammingSettings.bpmToChange,
            measuresToChangeBPM: isTempoProgrammingActive ? Number(inputValues.measuresToChangeBPM) : initialTempoProgrammingSettings.measuresToChangeBPM,
            secondsToStop: isTimeActive ? convertMmSsToSeconds(inputValues.secondsToStop as string) : initialTimerSettings.secondsToStop,
            measuresToStop: isMeasuresActive ? Number(inputValues.measuresToStop) : initialTimerSettings.measuresToStop,
        }

        if (!validate(formData)) return;

        const newTempoProgrammingSettings: TempoProgrammingSettings = {
            isActive: formData.isTempoProgrammingActive,
            bpmToChange: formData.bpmToChange || 0,
            measuresToChangeBPM: formData.measuresToChangeBPM || 0,
            fromBPM: formData.fromBPM,
            toBPM: formData.toBPM,
            isLoop: formData.isLoop,
        }

        const newTimerSettings: TimerSettings = {
            isTimeActive: formData.isTimeActive,
            secondsToStop: formData.secondsToStop || 0,
            isMeasuresActive: formData.isMeasuresActive,
            measuresToStop: formData.measuresToStop || 0,
        }

        handleSubmit(formData.countdownLength, newTempoProgrammingSettings, newTimerSettings);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'lg'}
            fullWidth={true}
            fullScreen={fullScreen}
        >
            <DialogTitle onClose={handleClose}>
                {t('settings')}
            </DialogTitle>
            <DialogContent>
                <form
                    id='formDialog'
                    onSubmit={submit}
                    noValidate
                >
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <TextField
                                name={'countdownLength'}
                                defaultValue={initialCountdownLength}
                                label={t('countdown')}
                                sx={{ minWidth: '10rem', marginTop: 2 }}
                                fullWidth
                                select
                            >
                                {
                                    METRONOME_CONSTANTS.countdownOptions.map((countdown) => {
                                        return (
                                            <MenuItem
                                                key={countdown}
                                                value={countdown}
                                            >
                                                {`${countdown} ${t('measures')}`}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Container label={t('bpmProgramming')}>
                            <Grid container size={12} columnSpacing={4} rowSpacing={1}>
                                <FormControlLabel
                                    label={t('isActive')}
                                    control={<Switch checked={isTempoProgrammingActive} />}
                                    onChange={() => {
                                        if (isTempoProgrammingActive) setIsLoop(false);
                                        setIsTempoProgrammingActive((prev) => !prev);
                                    }}
                                />
                                <FormControlLabel
                                    disabled={!isTempoProgrammingActive}
                                    label={t('playInLoop')}
                                    control={<Switch checked={isLoop} />}
                                    onChange={() => setIsLoop((prev) => !prev)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    name={'fromBPM'}
                                    defaultValue={initialTempoProgrammingSettings.fromBPM}
                                    disabled={!isTempoProgrammingActive}
                                    error={fieldsWithErrors.includes('fromBPM')}
                                    label={t('from')}
                                    type='number'
                                    variant='outlined'
                                    helperText={`${METRONOME_CONSTANTS.minBPM} ${t('to').toLowerCase()} ${METRONOME_CONSTANTS.maxBPM} ${t('bpm')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('bpm')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: METRONOME_CONSTANTS.minBPM,
                                            max: METRONOME_CONSTANTS.maxBPM,
                                            step: 1,
                                            onKeyDown: handleIntegerKeyDown,
                                            onPaste: handleIntegerPaste,
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    name={'toBPM'}
                                    defaultValue={initialTempoProgrammingSettings.toBPM}
                                    disabled={!isTempoProgrammingActive}
                                    error={fieldsWithErrors.includes('toBPM')}
                                    label={t('to')}
                                    type='number'
                                    variant='outlined'
                                    helperText={`${METRONOME_CONSTANTS.minBPM} ${t('to').toLowerCase()} ${METRONOME_CONSTANTS.maxBPM} ${t('bpm')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('bpm')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: METRONOME_CONSTANTS.minBPM,
                                            max: METRONOME_CONSTANTS.maxBPM,
                                            step: 1,
                                            onKeyDown: handleIntegerKeyDown,
                                            onPaste: handleIntegerPaste,
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    name={'bpmToChange'}
                                    defaultValue={initialTempoProgrammingSettings.bpmToChange}
                                    disabled={!isTempoProgrammingActive}
                                    error={fieldsWithErrors.includes('bpmToChange')}
                                    label={t('change')}
                                    type='number'
                                    variant='outlined'
                                    helperText={`${TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange} ${t('to').toLowerCase()} ${TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange} ${t('bpm')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('bpm')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange,
                                            max: TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange,
                                            step: 1,
                                            onKeyDown: handleIntegerKeyDown,
                                            onPaste: handleIntegerPaste,
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    name={'measuresToChangeBPM'}
                                    defaultValue={initialTempoProgrammingSettings.measuresToChangeBPM}
                                    disabled={!isTempoProgrammingActive}
                                    error={fieldsWithErrors.includes('measuresToChangeBPM')}
                                    label={t('every')}
                                    type='number'
                                    variant='outlined'
                                    helperText={`${TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM} ${t('to').toLowerCase()} ${TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM} ${t('measures')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('measures')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM,
                                            max: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM,
                                            step: 1,
                                            onKeyDown: handleIntegerKeyDown,
                                            onPaste: handleIntegerPaste,
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                        </Container>
                        <Container label={t('timer')}>
                            <Grid container size={12} direction={'column'}>
                                <Grid container size={{ sm: 12, md: 6 }} alignItems={'center'}>
                                    <Grid size={{ sm: 12, md: 6 }}>
                                        <FormControlLabel
                                            label={t('stopByTime')}
                                            control={<Switch checked={isTimeActive} />}
                                            onChange={() => setIsTimeActive((prev) => !prev)}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimeField
                                                name='secondsToStop'
                                                disabled={!isTimeActive}
                                                defaultValue={convertSecondsToMinutesSeconds(initialTimerSettings.secondsToStop)}
                                                variant='outlined'
                                                format="mm:ss"
                                                slotProps={{
                                                    textField: {
                                                        endAdornment: <InputAdornment position='end'>{'mm:ss'}</InputAdornment>,
                                                    }
                                                }}
                                                fullWidth
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                                <Grid container size={{ sm: 12, md: 6 }} alignItems={'center'}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControlLabel
                                            label={t('stopByMeasures')}
                                            control={<Switch checked={isMeasuresActive} />}
                                            onChange={() => setIsMeasuresActive((prev) => !prev)}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            name={'measuresToStop'}
                                            defaultValue={initialTimerSettings.measuresToStop}
                                            disabled={!isMeasuresActive}
                                            error={fieldsWithErrors.includes('measuresToStop')}
                                            type='number'
                                            variant='outlined'
                                            helperText={`0 ${t('to').toLowerCase()} ${TIMER_CONSTANTS.maxMeasuresToStop} ${t('measures')}`}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <InputAdornment position='end'>{t('measures')}</InputAdornment>
                                                },
                                                htmlInput: {
                                                    min: 0,
                                                    max: TIMER_CONSTANTS.maxMeasuresToStop,
                                                    step: 1,
                                                    onKeyDown: handleIntegerKeyDown,
                                                    onPaste: handleIntegerPaste,
                                                }
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Alert severity='info'>
                                    {t('timerExplanation')}
                                </Alert>
                            </Grid>
                        </Container>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    type='button'
                    variant='dark'
                    onClick={handleClose}
                >
                    {t('cancel')}
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    form='formDialog'
                >
                    {t('accept')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TempoProgrammingTimerDialog;