'use client'
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Button, Grid, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import UpdateIcon from '@mui/icons-material/Update';
import type { Template } from '@/utils/types';
import useDialog from '@/utils/hooks/useDialog';
import useExecuteKeyPressed from '@/utils/hooks/useExecuteKeyPressed';
import useMetronome from '@/utils/hooks/useMetronome';
import useTemplates from '@/utils/hooks/useTemplates';
import { DEFAULT_SETTINGS } from '@/utils/constants';
import BPMInput from '@/components/bpmInput';
import TimeSignatureInput from '@/components/timeSignatureInput';
import BeatIndicator from '@/components/beatIndicator';
import Clock from '@/components/clock';
import TempoProgrammingTimerDialog from '@/components/tempoProgrammingTimerDialog';
import TemplateFormDialog from '@/components/templateFormDialog';
import TemplatesDialog from '@/components/templatesDialog';
import ShortcutsDialog from '@/components/shortcutsDialog';
import AboutDialog from '@/components/aboutDialog';
import Header from '@/components/header';
import useSnackbarContext from '@/components/snackbar/useSnackbarContext';

const Metronome = () => {

    const { data: session } = useSession();

    const t = useTranslations();

    const {
        isInCountdown,
        isPlaying,
        isPaused,
        currentTime,
        currentBeatInMeasure,
        currentMeasure,
        settings,
        handleStartMetronome,
        handleStopMetronome,
        handleTogglePauseMetronome,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetNoteValue,
        handleToggleBeatType,
        handleSetSettings,
        handleSetTempoProgrammingAndTimerSettings,
    } = useMetronome();

    const onTemplateSelectionCallback = (newTemplateSelected?: Template) => {
        document.title = `${newTemplateSelected?.name ? newTemplateSelected.name + ' - ' : ''} Metronome Now`;
        handleStopMetronome();
        handleSetSettings(newTemplateSelected?.settings);
    }

    const {
        templates,
        selectedTemplateNameToPlay,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlayByName,
        handleSelectTemplateByPosition,
        handleSubmitActionTemplate,
        handleOpenCreateTemplate,
        handleOpenUpdateTemplate,
        handleOpenDeleteTemplate,
        handleOpenRenameTemplate,
        handleOpenDuplicateTemplate,
        handleCloseTemplateForm,
    } = useTemplates(onTemplateSelectionCallback);

    const { handleOpen: handleOpenSnackbar } = useSnackbarContext();

    const {
        dialogIsOpen: templateDialogIsOpen,
        handleOpenDialog: handleOpenTemplateDialog,
        handleCloseDialog: handleCloseTemplateDialog,
    } = useDialog();

    const {
        dialogIsOpen: bpmProgrammingTimerDialogIsOpen,
        handleOpenDialog: handleOpenBPMProgrammingTimerDialog,
        handleCloseDialog: handleCloseBPMProgrammingTimerDialog,
    } = useDialog();

    const {
        dialogIsOpen: aboutDialogIsOpen,
        handleOpenDialog: handleOpenAboutDialog,
        handleCloseDialog: handleCloseAboutDialog,
    } = useDialog();

    const {
        dialogIsOpen: shortcutsDialogIsOpen,
        handleOpenDialog: handleOpenShortcutsDialog,
        handleCloseDialog: handleCloseShortcutsDialog,
    } = useDialog();


    const handleToggleMetronome = () => {
        if (isPlaying) {
            handleStopMetronome();
            return;
        }

        handleStartMetronome();
    }

    const handleValidateAndOpenTemplateDialog = () => {
        if (!Boolean(session)) {
            handleOpenSnackbar(t('youMustBeLoggedIn'))
            return;
        }

        handleOpenTemplateDialog();
        handleStopMetronome();
    }

    const handleOpenBPMProgrammingTimerDialogAndStopMetronome = () => {
        handleOpenBPMProgrammingTimerDialog();
        handleStopMetronome();
    }

    const handleResetUserSettings = () => {
        handleStopMetronome();
        handleSetSettings(DEFAULT_SETTINGS);
        // TODO: limpiar template seleccionado
    }

    useExecuteKeyPressed('?', 'keyup', handleOpenShortcutsDialog);
    useExecuteKeyPressed('p', 'keyup', handleToggleMetronome);
    useExecuteKeyPressed('t', 'keyup', handleValidateAndOpenTemplateDialog);
    useExecuteKeyPressed('s', 'keyup', handleOpenBPMProgrammingTimerDialogAndStopMetronome);
    useExecuteKeyPressed('0', 'keyup', () => handleSelectTemplateByPosition(0));
    useExecuteKeyPressed('1', 'keyup', () => handleSelectTemplateByPosition(1));
    useExecuteKeyPressed('2', 'keyup', () => handleSelectTemplateByPosition(2));
    useExecuteKeyPressed('3', 'keyup', () => handleSelectTemplateByPosition(3));
    useExecuteKeyPressed('4', 'keyup', () => handleSelectTemplateByPosition(4));
    useExecuteKeyPressed('5', 'keyup', () => handleSelectTemplateByPosition(5));
    useExecuteKeyPressed('6', 'keyup', () => handleSelectTemplateByPosition(6));
    useExecuteKeyPressed('7', 'keyup', () => handleSelectTemplateByPosition(7));
    useExecuteKeyPressed('8', 'keyup', () => handleSelectTemplateByPosition(8));
    useExecuteKeyPressed('9', 'keyup', () => handleSelectTemplateByPosition(9));
    useExecuteKeyPressed('9', 'keyup', () => handleSelectTemplateByPosition(9));

    const settingsIsActive = (
        settings.metronomeSettings.countdownLength ||
        settings.tempoProgrammingSettings.isActive ||
        settings.timerSettings.isTimeActive ||
        settings.timerSettings.isMeasuresActive
    );

    return (
        <>
            <Header
                disableLocaleSelector={isPlaying}
                handleTitleClick={handleOpenAboutDialog}
                handleShortcutsClick={handleOpenShortcutsDialog}
                resetMetronomeSettings={handleResetUserSettings}
            />
            <main>
                <Grid
                    container direction={'column'} alignItems={'center'} justifyContent={'space-evenly'} wrap='nowrap'
                    sx={{
                        padding: '20px',
                        paddingTop: '10px',
                        height: 'calc(100svh - 100px)',
                    }}
                >
                    <Grid container direction={'column'} alignItems={'center'} spacing={3}>
                        <Grid container direction={'column'} alignItems={'center'} spacing={1}>
                            <Typography sx={{ fontSize: '0.9rem', visibility: !selectedTemplateNameToPlay ? 'hidden' : 'visible' }}>
                                {selectedTemplateNameToPlay || 'defaultTemplate'}
                            </Typography>
                            <BPMInput
                                disabled={settings.tempoProgrammingSettings.isActive}
                                initialBPM={settings.metronomeSettings.bpm}
                                handleChange={handleSetBPM}
                            />
                        </Grid>
                        <TimeSignatureInput
                            noteValue={settings.metronomeSettings.noteValue}
                            beatsPerMeasure={settings.metronomeSettings.beatsPerMeasure}
                            handleSetBeatsPerMeasure={handleSetBeatsPerMeasure}
                            handleSetNoteValue={handleSetNoteValue}
                        />
                    </Grid>
                    <BeatIndicator
                        isPlaying={isPlaying}
                        beatTypes={settings.metronomeSettings.beatTypes}
                        beatsPerMeasure={settings.metronomeSettings.beatsPerMeasure}
                        currentBeatInMeasure={currentBeatInMeasure}
                        handleClick={handleToggleBeatType}
                    />
                    <Grid container direction={'column'} alignItems={'center'} spacing={1}>
                        <Clock
                            showOnlyClock={isInCountdown}
                            isPlaying={isPlaying}
                            isPaused={isPaused}
                            value={currentTime}
                            secondsToStop={settings.timerSettings.isTimeActive ? settings.timerSettings.secondsToStop : 0}
                            currentMeasure={currentMeasure < 0 ? 0 : currentMeasure + 1}
                            measureToStop={settings.timerSettings.isMeasuresActive ? settings.timerSettings.measuresToStop : 0}
                            handleClick={handleTogglePauseMetronome}
                            handleToggleMetronome={handleToggleMetronome}
                        />
                    </Grid>
                    <Grid
                        container alignItems={'center'} justifyContent={'space-evenly'} spacing={2}
                        sx={{ marginTop: '30px' }}
                    >
                        <Button
                            title={t('bpmProgrammingAndTimer')}
                            aria-label={t('bpmProgrammingAndTimer')}
                            variant={settingsIsActive ? 'contained' : 'dark'}
                            sx={{ minWidth: 0, padding: 1, borderRadius: '100%' }}
                            onClick={handleOpenBPMProgrammingTimerDialogAndStopMetronome}
                        >
                            <UpdateIcon sx={{ fontSize: 40 }} />
                        </Button>
                        <Button
                            title={t(isPlaying ? 'stop' : 'play')}
                            aria-label={t(isPlaying ? 'stop' : 'play')}
                            variant='contained'
                            sx={{ minWidth: 0, padding: 0.5, borderRadius: '100%' }}
                            onClick={handleToggleMetronome}
                        >
                            {isPlaying ? <StopIcon sx={{ fontSize: 80 }} /> : <PlayArrowIcon sx={{ fontSize: 80 }} />}
                        </Button>
                        <Button
                            title={t('templates')}
                            aria-label={t('templates')}
                            variant={selectedTemplateNameToPlay ? 'contained' : 'dark'}
                            sx={{ minWidth: 0, padding: 1, borderRadius: '100%' }}
                            onClick={handleValidateAndOpenTemplateDialog}
                        >
                            <PlaylistAddIcon sx={{ fontSize: 40 }} />
                        </Button>
                    </Grid>
                    {
                        bpmProgrammingTimerDialogIsOpen &&
                        <TempoProgrammingTimerDialog
                            open={bpmProgrammingTimerDialogIsOpen}
                            initialCountdownLength={settings.metronomeSettings.countdownLength}
                            initialTempoProgrammingSettings={settings.tempoProgrammingSettings}
                            initialTimerSettings={settings.timerSettings}
                            handleSubmit={handleSetTempoProgrammingAndTimerSettings}
                            handleClose={handleCloseBPMProgrammingTimerDialog}
                        />
                    }
                    {
                        templateDialogIsOpen &&
                        <TemplatesDialog
                            open={templateDialogIsOpen}
                            selectedTemplateName={selectedTemplateNameToPlay}
                            templates={templates}
                            handleSelectTemplate={(templateName) => {
                                handleSelectTemplateToPlayByName(templateName);
                                handleCloseTemplateDialog();
                            }}
                            handleCreateTemplate={handleOpenCreateTemplate}
                            handleRenameTemplate={handleOpenRenameTemplate}
                            handleUpdateTemplate={handleOpenUpdateTemplate}
                            handleDuplicateTemplate={handleOpenDuplicateTemplate}
                            handleDeleteTemplate={handleOpenDeleteTemplate}
                            handleClose={handleCloseTemplateDialog}
                        />
                    }
                    {
                        templateFormDialogIsOpen &&
                        <TemplateFormDialog
                            open={templateFormDialogIsOpen}
                            data={templateFormData!}
                            templates={templates}
                            handleSubmit={(newName) => handleSubmitActionTemplate(newName, settings)}
                            handleClose={handleCloseTemplateForm}
                        />
                    }
                </Grid>
            </main>
            {
                shortcutsDialogIsOpen &&
                <ShortcutsDialog
                    open={shortcutsDialogIsOpen}
                    handleClose={handleCloseShortcutsDialog}
                />
            }
            {
                aboutDialogIsOpen &&
                <AboutDialog
                    open={aboutDialogIsOpen}
                    handleClose={handleCloseAboutDialog}
                />
            }
        </>
    );
}

export default Metronome;