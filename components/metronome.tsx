'use client'
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Button, Grid, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import UpdateIcon from '@mui/icons-material/Update';
import type { Template } from '@/utils/types';
import useToggle from '@/utils/hooks/useToggle';
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
import AboutDialog from '@/components/aboutDialog';
import Header from '@/components/header';
import { useSnackbar } from '@/components/snackbar/context';
import UserButton from '@/components/userButton';
import { useConfirmationDialog } from '@/components/confirmationDialog/context';

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
        handleStopMetronome();
        handleSetSettings(newTemplateSelected?.settings);
    }

    const {
        selectedTemplateHasUnsavedChanges,
        templates,
        selectedTemplateNameToPlay,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlayByName,
        handleDeselectTemplate,
        handleSubmitActionTemplate,
        handleOpenCreateTemplate,
        handleSaveTemplateChanges,
        handleOpenDeleteTemplate,
        handleDeleteAllTemplates,
        handleOpenRenameTemplate,
        handleOpenDuplicateTemplate,
        handleCloseTemplateForm,
    } = useTemplates(settings, onTemplateSelectionCallback);

    const { handleOpen: handleOpenSnackbar } = useSnackbar();
    const { handleOpen: handleOpenConfirmationDialog } = useConfirmationDialog();

    const {
        value: templateDialogIsOpen,
        handleToggle: handleToggleTemplateDialog,
    } = useToggle();

    const {
        value: bpmProgrammingTimerDialogIsOpen,
        handleToggle: handleToggleBPMProgrammingTimerDialog,
    } = useToggle();

    const {
        value: aboutDialogIsOpen,
        handleToggle: handleToggleAboutDialog,
    } = useToggle();

    const handleToggleMetronome = () => {
        if (isPlaying) {
            handleStopMetronome();
            return;
        }

        handleStartMetronome();
    }

    const handleValidateAndOpenTemplateDialog = () => {
        if (!Boolean(session)) {
            handleOpenSnackbar({ text: t('youMustBeLoggedIn') })
            return;
        }

        handleToggleTemplateDialog();
        handleStopMetronome();
    }

    const handleOpenBPMProgrammingTimerDialogAndStopMetronome = () => {
        handleToggleBPMProgrammingTimerDialog();
        handleStopMetronome();
    }

    const handleResetUserSettings = () => {
        handleStopMetronome();
        handleSetSettings(DEFAULT_SETTINGS);
        handleDeselectTemplate();
    }

    const settingsIsActive = (
        settings.countdownLength ||
        settings.tempoProgrammingSettings.isActive ||
        settings.timerSettings.isTimeActive ||
        settings.timerSettings.isMeasuresActive
    );

    return (
        <>
            <Header
                disableLocaleSelector={isPlaying}
                handleTitleClick={handleToggleAboutDialog}
                userButton={
                    <UserButton
                        templates={templates}
                        handleDeleteAllTemplates={() => handleOpenConfirmationDialog({
                            question: <>
                                {t('deleteAllTemplatesQuestion')}
                                <br />
                                {t('thisActionCannotBeUndone')}
                            </>,
                            handleConfirm: handleDeleteAllTemplates,
                        })}
                        handleResetUserSettings={handleResetUserSettings}
                    />
                }
            />
            <main
                style={{
                    minHeight: "100svh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Grid
                    container direction={'column'} alignItems={'center'} wrap='nowrap'
                    spacing={{ xs: 0, md: 1, xl: 2 }}
                    sx={{ padding: 2 }}
                >
                    <Grid container direction={'column'} alignItems={'center'} spacing={3}>
                        <Grid container direction={'column'} alignItems={'center'} spacing={0}>
                            <Typography sx={{ fontSize: '0.9rem' }}>
                                {selectedTemplateNameToPlay || t('defaultTemplate')}
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
                    <Grid container direction={'column'} alignItems={'center'} sx={{ marginY: 4 }}>
                        <BeatIndicator
                            isPlaying={isPlaying}
                            beatTypes={settings.metronomeSettings.beatTypes}
                            beatsPerMeasure={settings.metronomeSettings.beatsPerMeasure}
                            currentBeatInMeasure={currentBeatInMeasure}
                            handleClick={handleToggleBeatType}
                        />
                    </Grid>
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
                        sx={{ marginTop: 4 }}
                    >
                        <Button
                            title={t('bpmProgrammingAndTimer')}
                            aria-label={t('bpmProgrammingAndTimer')}
                            variant={settingsIsActive ? 'contained' : 'dark'}
                            sx={{ minWidth: 0, padding: 1, borderRadius: '100%' }}
                            onClick={handleOpenBPMProgrammingTimerDialogAndStopMetronome}
                        >
                            <UpdateIcon sx={{ fontSize: '2.5rem' }} />
                        </Button>
                        <Button
                            title={t(isPlaying ? 'stop' : 'play')}
                            aria-label={t(isPlaying ? 'stop' : 'play')}
                            variant='contained'
                            sx={{ minWidth: 0, padding: 0.5, borderRadius: '100%' }}
                            onClick={handleToggleMetronome}
                        >
                            {isPlaying ? <StopIcon sx={{ fontSize: '5rem' }} /> : <PlayArrowIcon sx={{ fontSize: '5rem' }} />}
                        </Button>
                        <Button
                            title={t('templates')}
                            aria-label={t('templates')}
                            variant={selectedTemplateNameToPlay ? 'contained' : 'dark'}
                            sx={{ minWidth: 0, padding: 1, borderRadius: '100%' }}
                            onClick={handleValidateAndOpenTemplateDialog}
                        >
                            <PlaylistAddIcon sx={{ fontSize: '2.5rem' }} />
                        </Button>
                    </Grid>
                    {
                        bpmProgrammingTimerDialogIsOpen &&
                        <TempoProgrammingTimerDialog
                            open={bpmProgrammingTimerDialogIsOpen}
                            initialCountdownLength={settings.countdownLength}
                            initialTempoProgrammingSettings={settings.tempoProgrammingSettings}
                            initialTimerSettings={settings.timerSettings}
                            handleSubmit={handleSetTempoProgrammingAndTimerSettings}
                            handleClose={handleToggleBPMProgrammingTimerDialog}
                        />
                    }
                    {
                        templateDialogIsOpen &&
                        <TemplatesDialog
                            open={templateDialogIsOpen}
                            selectedTemplateName={selectedTemplateNameToPlay}
                            templates={templates}
                            selectedTemplateHasUnsavedChanges={selectedTemplateHasUnsavedChanges}
                            handleSelectTemplate={(templateName) => handleSelectTemplateToPlayByName(templateName, handleToggleTemplateDialog)}
                            handleCreateTemplate={handleOpenCreateTemplate}
                            handleRenameTemplate={handleOpenRenameTemplate}
                            handleSaveTemplateChanges={handleSaveTemplateChanges}
                            handleDuplicateTemplate={handleOpenDuplicateTemplate}
                            handleDeleteTemplate={handleOpenDeleteTemplate}
                            handleClose={handleToggleTemplateDialog}
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
                aboutDialogIsOpen &&
                <AboutDialog
                    open={aboutDialogIsOpen}
                    handleClose={handleToggleAboutDialog}
                />
            }
        </>
    );
}

export default Metronome;