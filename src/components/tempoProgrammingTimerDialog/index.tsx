import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TempoProgrammingSettings, TimerSettings } from "../../utils/types";
import { METRONOME_CONSTANTS, TEMPO_PROGRAMMING_CONSTANTS, TIMER_CONSTANTS } from "../../utils/constants";
import useSnackbarContext from "../snackbar/useSnackbarContext";
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
} from "@mui/material";
import Container from "../container";
import CustomDialogTitle from "../dialog/customDialogTitle";

type Props = {
    open: boolean,
    initialCountdownLength: number,
    initialTempoProgrammingSettings: TempoProgrammingSettings,
    initialTimerSettings: TimerSettings,
    handleSetCountdownLength: (newSettings: number) => void,
    handleSetTempoProgrammingSettings: (newSettings: TempoProgrammingSettings) => void,
    handleSetTimerSettings: (newSettings: TimerSettings) => void,
    handleClose: () => void,
}

const TempoProgrammingTimerDialog = (props: Props) => {

    const {
        open,
        initialCountdownLength,
        initialTempoProgrammingSettings,
        initialTimerSettings,
        handleSetCountdownLength,
        handleSetTempoProgrammingSettings,
        handleSetTimerSettings,
        handleClose,
    } = props;

    const { t } = useTranslation();

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const [countdownLength, setCountdownLength] = useState<number>(initialCountdownLength);

    const [isTempoProgrammingActive, setIsTempoProgrammingActive] = useState<boolean>(initialTempoProgrammingSettings.isActive);
    const [isLoop, setIsLoop] = useState<boolean>(initialTempoProgrammingSettings.isLoop);
    const [bpmToChange, setBPMToChange] = useState<number | string>(initialTempoProgrammingSettings.bpmToChange);
    const [measuresToChangeBPM, setMeasuresToChangeBPM] = useState<number | string>(initialTempoProgrammingSettings.measuresToChangeBPM);
    const [fromBPM, setFromBPM] = useState<number | string>(initialTempoProgrammingSettings.fromBPM);
    const [toBPM, setToBPM] = useState<number | string>(initialTempoProgrammingSettings.toBPM);

    const [isSecondsActive, setIsSecondsActive] = useState(initialTimerSettings.secondsIsActive);
    const [isMeasuresActive, setIsMeasuresActive] = useState(initialTimerSettings.measuresIsActive);
    const [secondsToStop, setSecondsToStop] = useState<number | string>(initialTimerSettings.secondsToStop % 60);
    const [minutesToStop, setMinutesToStop] = useState<number | string>(Math.floor(initialTimerSettings.secondsToStop / 60));
    const [measuresToStop, setMeasuresToStop] = useState<number | string>(initialTimerSettings.measuresToStop);

    const handleSubmit = () => {
        const formattedBPMToChange = Math.round(Number(bpmToChange));
        const formattedFromBPM = Math.round(Number(fromBPM));
        const formattedToBPM = Math.round(Number(toBPM));
        const formattedMeasuresToChangeBPM = Math.round(Number(measuresToChangeBPM));

        const formattedSeconds = Math.round(Number(secondsToStop));
        const formattedMinutes = Math.round(Number(minutesToStop));
        const formattedMeasures = Math.round(Number(measuresToStop));
        const totalSeconds = formattedMinutes * 60 + formattedSeconds;

        if (!(formattedFromBPM >= METRONOME_CONSTANTS.minBPM && formattedFromBPM <= METRONOME_CONSTANTS.maxBPM)) {
            handleOpenSnackbar(t("fromBPMMustBeInRange", { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }));
            return;
        }

        if (!(formattedToBPM >= METRONOME_CONSTANTS.minBPM && formattedFromBPM <= METRONOME_CONSTANTS.maxBPM)) {
            handleOpenSnackbar(t("toBPMMustBeInRange", { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }));
            return;
        }

        if (formattedFromBPM === formattedToBPM) {
            handleOpenSnackbar(t("fromBPMMustBeDifferentThanToBPM"));
            return;
        }

        if (!(formattedBPMToChange >= 0 && formattedBPMToChange <= METRONOME_CONSTANTS.maxBPM)) {
            handleOpenSnackbar(t("bpmToChangeMustBeInRange", { min: 0, max: METRONOME_CONSTANTS.maxBPM }));
            return;
        }

        if (!(formattedMeasuresToChangeBPM >= TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM && formattedMeasuresToChangeBPM <= TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM)) {
            handleOpenSnackbar(t("measuresToChangeBPMMustBeInRange", { min: TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM, max: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM }));
            return;
        }

        if (isSecondsActive && !formattedSeconds && !formattedMinutes) {
            handleOpenSnackbar(t("timeCannotBeEmpty"));
            return;
        }

        if (!(formattedSeconds >= 0 && formattedSeconds <= TIMER_CONSTANTS.maxSecondsToStop)) {
            handleOpenSnackbar(t("secondsMustBeInRange", { min: 0, max: TIMER_CONSTANTS.maxSecondsToStop }));
            return;
        }

        if (!(formattedMinutes >= 0 && formattedMinutes <= TIMER_CONSTANTS.maxMinutesToStop)) {
            handleOpenSnackbar(t("minutesMustBeInRange", { min: 0, max: TIMER_CONSTANTS.maxMinutesToStop }));
            return;
        }

        if (!(formattedMeasures >= 0 && formattedMeasures <= TIMER_CONSTANTS.maxMeasuresToStop)) {
            handleOpenSnackbar(t("measuresToStopMustBeInRange", { min: 0, max: TIMER_CONSTANTS.maxMeasuresToStop }));
            return;
        }

        if (isMeasuresActive && !formattedMeasures) {
            handleOpenSnackbar(t("measuresToStopCannotBeEmpty"));
            return;
        }

        const newTempoProgrammingSettings = {
            isActive: isTempoProgrammingActive,
            bpmToChange: formattedBPMToChange,
            measuresToChangeBPM: formattedMeasuresToChangeBPM,
            fromBPM: formattedFromBPM,
            toBPM: formattedToBPM,
            isLoop: isLoop,
        }

        const newTimerSettings = {
            secondsIsActive: isSecondsActive,
            secondsToStop: totalSeconds,
            measuresIsActive: isMeasuresActive,
            measuresToStop: formattedMeasures,
        }

        handleSetTimerSettings(newTimerSettings);
        handleSetTempoProgrammingSettings(newTempoProgrammingSettings);
        handleSetCountdownLength(countdownLength);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <CustomDialogTitle onClose={handleClose}>
                {t("settings")}
            </CustomDialogTitle>
            <DialogContent>
                <form
                    id="formDialog"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    noValidate
                >
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                select
                                label={t("countdown")}
                                value={countdownLength}
                                onChange={(e) => setCountdownLength(Number(e.target.value))}
                                sx={{ minWidth: "175px", marginTop: "15px" }}
                            >
                                {
                                    METRONOME_CONSTANTS.countdownOptions.map((countdown) => {
                                        return (
                                            <MenuItem key={countdown} value={countdown}>{`${countdown} ${t("measures")}`}</MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Container label={t("bpmProgramming")}>
                            <Grid container size={12} spacing={3}>
                                <FormControlLabel
                                    label={t("isActive")}
                                    control={<Switch checked={isTempoProgrammingActive} />}
                                    onChange={() => setIsTempoProgrammingActive((prev) => !prev)}
                                />
                                <FormControlLabel
                                    label={t("playInLoop")}
                                    control={<Switch checked={isLoop} />}
                                    onChange={() => setIsLoop((prev) => !prev)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t("from")}
                                    type="number"
                                    value={fromBPM}
                                    onChange={(e) => setFromBPM(e.target.value.substring(0, 3))}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">{t("bpm")}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: METRONOME_CONSTANTS.minBPM,
                                            max: METRONOME_CONSTANTS.maxBPM,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t("to")}
                                    type="number"
                                    value={toBPM}
                                    onChange={(e) => setToBPM(e.target.value.substring(0, 3))}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">{t("bpm")}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: METRONOME_CONSTANTS.minBPM,
                                            max: METRONOME_CONSTANTS.maxBPM,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t("change")}
                                    type="number"
                                    value={bpmToChange}
                                    onChange={(e) => setBPMToChange(e.target.value.substring(0, 3))}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">{t("bpm")}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: 0,
                                            max: METRONOME_CONSTANTS.maxBPM,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t("every")}
                                    type="number"
                                    value={measuresToChangeBPM}
                                    onChange={(e) => setMeasuresToChangeBPM(e.target.value.substring(0, 3))}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">{t("measures")}</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM,
                                            max: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM,
                                        }
                                    }}
                                />
                            </Grid>
                        </Container>
                        <Container label={t("timer")}>
                            <Grid container size={12} alignItems={"center"} sx={{ marginBottom: { xs: 2, md: 0 } }}>
                                <Grid size={{ sm: 12, md: 6 }}>
                                    <FormControlLabel
                                        label={t("stopByTime")}
                                        control={<Switch checked={isSecondsActive} />}
                                        onChange={() => {
                                            setIsSecondsActive((prev) => !prev);
                                            setIsMeasuresActive(false);
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={minutesToStop}
                                        onChange={(e) => setMinutesToStop(e.target.value.substring(0, 3))}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">{t("minutes")}</InputAdornment>,
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
                                        fullWidth
                                        type="number"
                                        value={secondsToStop}
                                        onChange={(e) => setSecondsToStop(e.target.value.substring(0, 3))}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">{t("seconds")}</InputAdornment>
                                            },
                                            htmlInput: {
                                                min: 0,
                                                max: TIMER_CONSTANTS.maxSecondsToStop,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container size={12} alignItems={"center"}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        label={t("stopByMeasures")}
                                        control={<Switch checked={isMeasuresActive} />}
                                        onChange={() => {
                                            setIsMeasuresActive((prev) => !prev);
                                            setIsSecondsActive(false);
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={measuresToStop}
                                        onChange={(e) => setMeasuresToStop(e.target.value.substring(0, 3))}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">{t("measures")}</InputAdornment>
                                            },
                                            htmlInput: {
                                                min: 0,
                                                max: TIMER_CONSTANTS.maxMeasuresToStop,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    variant="contained"
                    onClick={handleClose}
                >
                    {t("cancel")}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    form="formDialog"
                >
                    {t("accept")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TempoProgrammingTimerDialog;