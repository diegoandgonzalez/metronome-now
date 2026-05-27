'use client'
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
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
    Typography,
} from '@mui/material';
import type { TempoProgrammingSettings, TimerSettings } from '@/utils/types';
import { METRONOME_CONSTANTS, TEMPO_PROGRAMMING_CONSTANTS, TIMER_CONSTANTS } from '@/utils/constants';
import useIsMobileSize from '@/utils/hooks/useIsMobileSize';
import { useSnackbar } from '@/components/snackbar/context';
import Container from '@/components/container';
import DialogTitle from '@/components/dialogTitle';

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
    minutesToStop: number,
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
    const useFullScreen = useIsMobileSize();

    const { handleOpen: handleOpenSnackbar } = useSnackbar();

    const [formData, setFormData] = useState<FormDataType>({
        countdownLength: initialCountdownLength,
        isTempoProgrammingActive: initialTempoProgrammingSettings.isActive,
        isLoop: initialTempoProgrammingSettings.isLoop,
        bpmToChange: initialTempoProgrammingSettings.bpmToChange,
        measuresToChangeBPM: initialTempoProgrammingSettings.measuresToChangeBPM,
        fromBPM: initialTempoProgrammingSettings.fromBPM,
        toBPM: initialTempoProgrammingSettings.toBPM,
        isTimeActive: initialTimerSettings.isTimeActive,
        isMeasuresActive: initialTimerSettings.isMeasuresActive,
        secondsToStop: initialTimerSettings.secondsToStop % 60,
        minutesToStop: Math.floor(initialTimerSettings.secondsToStop / 60),
        measuresToStop: initialTimerSettings.measuresToStop,
    });

    const [fieldsWithErrors, setFieldsWithErrors] = useState<FieldNamesType[]>([]);

    const setFormValue = (value: boolean | number | string, fieldName: FieldNamesType) => {
        setFieldsWithErrors((prev) => prev.filter((name) => name !== fieldName));

        setFormData((prev) => ({
            ...prev,
            [fieldName]: (typeof value === 'string' && value) ? Math.round(Number(value)) : value,
        }));
    };

    const validate = () => {
        const {
            isTempoProgrammingActive,
            bpmToChange,
            measuresToChangeBPM,
            fromBPM,
            toBPM,
            isTimeActive,
            isMeasuresActive,
            secondsToStop,
            minutesToStop,
            measuresToStop,
        } = formData;

        let dataIsValid = true;
        const newFieldsWithErrors: FieldNamesType[] = [];

        if (!(fromBPM >= METRONOME_CONSTANTS.minBPM && fromBPM <= METRONOME_CONSTANTS.maxBPM)) {
            handleOpenSnackbar({ text: t('fromBPMMustBeInRange', { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }) });
            newFieldsWithErrors.push('fromBPM');
            dataIsValid = false;
        }

        if (!(toBPM >= METRONOME_CONSTANTS.minBPM && fromBPM <= METRONOME_CONSTANTS.maxBPM)) {
            handleOpenSnackbar({ text: t('toBPMMustBeInRange', { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }) });
            newFieldsWithErrors.push('toBPM');
            dataIsValid = false;
        }

        if (fromBPM === toBPM) {
            handleOpenSnackbar({ text: t('fromBPMMustBeDifferentThanToBPM') });
            newFieldsWithErrors.push('fromBPM', 'toBPM');
            dataIsValid = false;
        }

        if (isTempoProgrammingActive && !(bpmToChange >= TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange && bpmToChange <= TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange)) {
            handleOpenSnackbar({ text: t('bpmToChangeMustBeInRange', { min: TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange, max: TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange }) });
            newFieldsWithErrors.push('bpmToChange');
            dataIsValid = false;
        }

        if (isTempoProgrammingActive && !(measuresToChangeBPM >= TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM && measuresToChangeBPM <= TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM)) {
            handleOpenSnackbar({ text: t('measuresToChangeBPMMustBeInRange', { min: TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM, max: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM }) });
            newFieldsWithErrors.push('measuresToChangeBPM');
            dataIsValid = false;
        }

        if (isTimeActive && !secondsToStop && !minutesToStop) {
            handleOpenSnackbar({ text: t('timeCannotBeEmpty') });
            newFieldsWithErrors.push('minutesToStop', 'secondsToStop');
            dataIsValid = false;
        }

        if (!(secondsToStop >= 0 && secondsToStop <= TIMER_CONSTANTS.maxSecondsToStop)) {
            handleOpenSnackbar({ text: t('secondsMustBeInRange', { min: 0, max: TIMER_CONSTANTS.maxSecondsToStop }) });
            newFieldsWithErrors.push('secondsToStop');
            dataIsValid = false;
        }

        if (!(minutesToStop >= 0 && minutesToStop <= TIMER_CONSTANTS.maxMinutesToStop)) {
            handleOpenSnackbar({ text: t('minutesMustBeInRange', { min: 0, max: TIMER_CONSTANTS.maxMinutesToStop }) });
            newFieldsWithErrors.push('minutesToStop');
            dataIsValid = false;
        }

        if (!(measuresToStop >= 0 && measuresToStop <= TIMER_CONSTANTS.maxMeasuresToStop)) {
            handleOpenSnackbar({ text: t('measuresToStopMustBeInRange', { min: 0, max: TIMER_CONSTANTS.maxMeasuresToStop }) });
            newFieldsWithErrors.push('measuresToStop');
            dataIsValid = false;
        }

        if (isMeasuresActive && !measuresToStop) {
            handleOpenSnackbar({ text: t('measuresToStopCannotBeEmpty') });
            newFieldsWithErrors.push('measuresToStop');
            dataIsValid = false;
        }

        if (!dataIsValid) setFieldsWithErrors(newFieldsWithErrors);
        return dataIsValid;
    }

    const submit = () => {
        if (!validate()) {
            return;
        }

        const {
            isTempoProgrammingActive,
            isLoop,
            countdownLength,
            bpmToChange,
            measuresToChangeBPM,
            fromBPM,
            toBPM,
            isTimeActive,
            isMeasuresActive,
            secondsToStop,
            minutesToStop,
            measuresToStop,
        } = formData;

        const newTempoProgrammingSettings = {
            isActive: isTempoProgrammingActive,
            bpmToChange: bpmToChange || 0,
            measuresToChangeBPM: measuresToChangeBPM || 0,
            fromBPM,
            toBPM,
            isLoop,
        }

        const newTimerSettings = {
            secondsToStop: (minutesToStop || 0) * 60 + (secondsToStop || 0),
            isTimeActive,
            measuresToStop: measuresToStop || 0,
            isMeasuresActive,
        }

        handleSubmit(countdownLength, newTempoProgrammingSettings, newTimerSettings);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'lg'}
            fullWidth={true}
            fullScreen={useFullScreen}
        >
            <DialogTitle onClose={handleClose}>
                {t('settings')}
            </DialogTitle>
            <DialogContent>
                <form
                    id='formDialog'
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                    noValidate
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <TextField
                                fullWidth
                                select
                                label={t('countdown')}
                                value={formData.countdownLength}
                                onChange={(e) => setFormValue(Number(e.target.value), 'countdownLength')}
                                sx={{ minWidth: '10rem', marginTop: 2 }}
                            >
                                {
                                    METRONOME_CONSTANTS.countdownOptions.map((countdown) => {
                                        return (
                                            <MenuItem key={countdown} value={countdown}>{`${countdown} ${t('measures')}`}</MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Container label={t('bpmProgramming')}>
                            <Grid container size={12} columnSpacing={4} rowSpacing={1}>
                                <FormControlLabel
                                    label={t('isActive')}
                                    control={<Switch checked={formData.isTempoProgrammingActive} />}
                                    onChange={() => setFormValue(!formData.isTempoProgrammingActive, 'isTempoProgrammingActive')}
                                />
                                <FormControlLabel
                                    label={t('playInLoop')}
                                    control={<Switch checked={formData.isLoop} />}
                                    onChange={() => setFormValue(!formData.isLoop, 'isLoop')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    error={fieldsWithErrors.includes('fromBPM')}
                                    fullWidth
                                    label={t('from')}
                                    type='number'
                                    value={formData.fromBPM}
                                    onChange={(e) => setFormValue(e.target.value.substring(0, 3), 'fromBPM')}
                                    variant='outlined'
                                    helperText={`${METRONOME_CONSTANTS.minBPM} ${t('to').toLowerCase()} ${METRONOME_CONSTANTS.maxBPM} ${t('bpm')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('bpm')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: METRONOME_CONSTANTS.minBPM,
                                            max: METRONOME_CONSTANTS.maxBPM,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    error={fieldsWithErrors.includes('toBPM')}
                                    fullWidth
                                    label={t('to')}
                                    type='number'
                                    value={formData.toBPM}
                                    onChange={(e) => setFormValue(e.target.value.substring(0, 3), 'toBPM')}
                                    variant='outlined'
                                    helperText={`${METRONOME_CONSTANTS.minBPM} ${t('to').toLowerCase()} ${METRONOME_CONSTANTS.maxBPM} ${t('bpm')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('bpm')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: METRONOME_CONSTANTS.minBPM,
                                            max: METRONOME_CONSTANTS.maxBPM,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    error={fieldsWithErrors.includes('bpmToChange')}
                                    fullWidth
                                    label={t('change')}
                                    type='number'
                                    value={formData.bpmToChange}
                                    onChange={(e) => setFormValue(e.target.value.substring(0, 3), 'bpmToChange')}
                                    variant='outlined'
                                    helperText={`${TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange} ${t('to').toLowerCase()} ${TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange} ${t('bpm')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('bpm')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: TEMPO_PROGRAMMING_CONSTANTS.minBPMToChange,
                                            max: TEMPO_PROGRAMMING_CONSTANTS.maxBPMToChange,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    error={fieldsWithErrors.includes('measuresToChangeBPM')}
                                    fullWidth
                                    label={t('every')}
                                    type='number'
                                    value={formData.measuresToChangeBPM}
                                    onChange={(e) => setFormValue(e.target.value.substring(0, 3), 'measuresToChangeBPM')}
                                    variant='outlined'
                                    helperText={`${TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM} ${t('to').toLowerCase()} ${TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM} ${t('measures')}`}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position='end'>{t('measures')}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM,
                                            max: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM,
                                        }
                                    }}
                                />
                            </Grid>
                        </Container>
                        <Container label={t('timer')}>
                            <Grid container size={12} alignItems={'center'}>
                                <Grid size={{ sm: 12, md: 6 }}>
                                    <FormControlLabel
                                        label={t('stopByTime')}
                                        control={<Switch checked={formData.isTimeActive} />}
                                        onChange={() => setFormValue(!formData.isTimeActive, 'isTimeActive')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        error={fieldsWithErrors.includes('minutesToStop')}
                                        fullWidth
                                        type='number'
                                        value={formData.minutesToStop}
                                        onChange={(e) => setFormValue(e.target.value.substring(0, 3), 'minutesToStop')}
                                        variant='outlined'
                                        helperText={`${0} ${t('to').toLowerCase()} ${TIMER_CONSTANTS.maxMinutesToStop} ${t('minutes')}`}
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position='end'>{t('minutes')}</InputAdornment>,
                                            },
                                            htmlInput: {
                                                min: 0,
                                                max: TIMER_CONSTANTS.maxMinutesToStop,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        error={fieldsWithErrors.includes('secondsToStop')}
                                        fullWidth
                                        type='number'
                                        value={formData.secondsToStop}
                                        onChange={(e) => setFormValue(e.target.value.substring(0, 3), 'secondsToStop')}
                                        variant='outlined'
                                        helperText={`${t('from')} ${0} ${t('to').toLowerCase()} ${TIMER_CONSTANTS.maxSecondsToStop} ${t('seconds')}`}
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position='end'>{t('seconds')}</InputAdornment>
                                            },
                                            htmlInput: {
                                                min: 0,
                                                max: TIMER_CONSTANTS.maxSecondsToStop,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container size={12} alignItems={'center'}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        label={t('stopByMeasures')}
                                        control={<Switch checked={formData.isMeasuresActive} />}
                                        onChange={() => setFormValue(!formData.isMeasuresActive, 'isMeasuresActive')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        error={fieldsWithErrors.includes('measuresToStop')}
                                        fullWidth
                                        type='number'
                                        value={formData.measuresToStop}
                                        onChange={(e) => setFormValue(e.target.value.substring(0, 3), 'measuresToStop')}
                                        variant='outlined'
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position='end'>{t('measures')}</InputAdornment>
                                            },
                                            htmlInput: {
                                                min: 0,
                                                max: TIMER_CONSTANTS.maxMeasuresToStop,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Typography variant='caption'>
                                    {t('timerExplanation')}
                                </Typography>
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