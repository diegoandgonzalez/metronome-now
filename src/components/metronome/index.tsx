import { useTranslation } from "react-i18next";
import { Button, Grid, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import UpdateIcon from "@mui/icons-material/Update";
import type { Template } from "../../utils/types";
import Header from "../header";
import BPMInput from "../bpmInput";
import TimeSignatureInput from "../timeSignatureInput";
import BeatIndicator from "../beatIndicator";
import Clock from "../clock";
import TempoProgrammingTimerDialog from "../tempoProgrammingTimerDialog";
import TemplateFormDialog from "../templateFormDialog";
import AboutDialog from "../aboutDialog";
import ShortcutsDialog from "../shortcutsDialog";
import TemplatesDialog from "../templatesDialog";
import SettingsDialog from "../settingsDialog/settingsDialog";
import useDialog from "../dialog/useDialog";
import useExecuteKeyPressed from "../../utils/hooks/useExecuteKeyPressed";
import useLanguage from "../../utils/hooks/useLanguage";
import useMetronome from "./hooks/useMetronome";
import useTemplates from "./hooks/useTemplates";

const Metronome = () => {

    const {
        language,
        handleChangeLanguage,
    } = useLanguage();

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
        handleSetCountdownLength,
        handleSetMetronomeSettings,
        handleSetTempoProgrammingSettings,
        handleSetTimerSettings,
    } = useMetronome();

    const onTemplateSelectionCallback = (newTemplateSelected?: Template) => {
        document.title = `${newTemplateSelected?.name ? newTemplateSelected.name + " - " : ""} Metronome Now`;
        handleStopMetronome();
        handleSetMetronomeSettings(newTemplateSelected?.settings?.metronomeSettings);
        handleSetTimerSettings(newTemplateSelected?.settings?.timerSettings);
        handleSetTempoProgrammingSettings(newTemplateSelected?.settings?.tempoProgrammingSettings);
    }

    const {
        isDBReady,
        templates,
        selectedTemplateIdToPlay,
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlayById,
        handleSelectTemplateByPosition,
        handleOpenCreateTemplate,
        handleOpenUpdateTemplate,
        handleOpenDeleteTemplate,
        handleOpenRenameTemplate,
        handleOpenDuplicateTemplate,
        handleCloseTemplateForm,
        handleSubmitActionTemplate,
    } = useTemplates(onTemplateSelectionCallback);

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
        dialogIsOpen: settingsDialogIsOpen,
        handleOpenDialog: handleOpenSettingsDialog,
        handleCloseDialog: handleCloseSettingsDialog,
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

    const someDialogIsOpen = (
        bpmProgrammingTimerDialogIsOpen ||
        templateDialogIsOpen ||
        templateFormDialogIsOpen ||
        shortcutsDialogIsOpen
    );

    const executeIfNoDialogIsOpen = (callback: () => void) => {
        if (someDialogIsOpen) return;
        callback();
    }

    useExecuteKeyPressed("p", "keyup", handleToggleMetronome);
    useExecuteKeyPressed("?", "keyup", () => executeIfNoDialogIsOpen(handleOpenShortcutsDialog));
    useExecuteKeyPressed("s", "keyup", () => executeIfNoDialogIsOpen(handleOpenSettingsDialog));
    useExecuteKeyPressed("t", "keyup", () => executeIfNoDialogIsOpen(handleOpenTemplateDialog));
    useExecuteKeyPressed("b", "keyup", () => executeIfNoDialogIsOpen(handleOpenBPMProgrammingTimerDialog));
    useExecuteKeyPressed("0", "keyup", () => handleSelectTemplateByPosition(0));
    useExecuteKeyPressed("1", "keyup", () => handleSelectTemplateByPosition(1));
    useExecuteKeyPressed("2", "keyup", () => handleSelectTemplateByPosition(2));
    useExecuteKeyPressed("3", "keyup", () => handleSelectTemplateByPosition(3));
    useExecuteKeyPressed("4", "keyup", () => handleSelectTemplateByPosition(4));
    useExecuteKeyPressed("5", "keyup", () => handleSelectTemplateByPosition(5));
    useExecuteKeyPressed("6", "keyup", () => handleSelectTemplateByPosition(6));
    useExecuteKeyPressed("7", "keyup", () => handleSelectTemplateByPosition(7));
    useExecuteKeyPressed("8", "keyup", () => handleSelectTemplateByPosition(8));
    useExecuteKeyPressed("9", "keyup", () => handleSelectTemplateByPosition(9));
    useExecuteKeyPressed("9", "keyup", () => handleSelectTemplateByPosition(9));

    const { t } = useTranslation();

    const settingsIsActive = (
        settings.metronomeSettings.countdownLength ||
        settings.tempoProgrammingSettings.isActive ||
        settings.timerSettings.isTimeActive ||
        settings.timerSettings.isMeasuresActive
    );

    const selectedTemplateToPlayName = templates.find((template) => template.id === selectedTemplateIdToPlay)?.name || "";

    return (
        <>
            <Header
                handleTitleClick={handleOpenAboutDialog}
                handleShortcutsClick={handleOpenShortcutsDialog}
                handleSettingsClick={handleOpenSettingsDialog}
            />
            <Grid
                container direction={"column"} alignItems={"center"} justifyContent={"space-evenly"} wrap="nowrap"
                sx={{
                    padding: "20px",
                    paddingTop: "10px",
                    height: "calc(100svh - 100px)",
                }}
            >
                <Grid container direction={"column"} alignItems={"center"} spacing={3}>
                    <Grid container direction={"column"} alignItems={"center"} spacing={1}>
                        <Typography sx={{ fontSize: "0.9rem", visibility: !selectedTemplateToPlayName ? "hidden" : "visible" }}>
                            {selectedTemplateToPlayName || t("defaultTemplate")}
                        </Typography>
                        <BPMInput
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
                <Grid container direction={"column"} alignItems={"center"} spacing={1}>
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
                    container alignItems={"center"} justifyContent={"space-evenly"} spacing={2}
                    sx={{ marginTop: "30px" }}
                >
                    <Button
                        variant={settingsIsActive ? "contained" : "dark"}
                        sx={{ minWidth: 0, padding: 1, borderRadius: "100%" }}
                        onClick={() => {
                            handleOpenBPMProgrammingTimerDialog();
                            handleStopMetronome();
                        }}
                    >
                        <UpdateIcon sx={{ fontSize: 40 }} />
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ minWidth: 0, padding: 0.5, borderRadius: "100%" }}
                        onClick={handleToggleMetronome}
                    >
                        {isPlaying ? <StopIcon sx={{ fontSize: 80 }} /> : <PlayArrowIcon sx={{ fontSize: 80 }} />}
                    </Button>
                    <Button
                        variant={selectedTemplateIdToPlay ? "contained" : "dark"}
                        sx={{ minWidth: 0, padding: 1, borderRadius: "100%" }}
                        onClick={() => {
                            handleOpenTemplateDialog();
                            handleStopMetronome();
                        }}
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
                        handleSetCountdownLength={handleSetCountdownLength}
                        handleSetTempoProgrammingSettings={handleSetTempoProgrammingSettings}
                        handleSetTimerSettings={handleSetTimerSettings}
                        handleClose={handleCloseBPMProgrammingTimerDialog}
                    />
                }
                {
                    templateDialogIsOpen &&
                    <TemplatesDialog
                        open={templateDialogIsOpen}
                        disabled={!isDBReady}
                        selectedTemplateId={selectedTemplateIdToPlay}
                        templates={templates}
                        handleSelectTemplate={(templateId) => {
                            handleSelectTemplateToPlayById(templateId);
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
                {
                    settingsDialogIsOpen &&
                    <SettingsDialog
                        open={settingsDialogIsOpen}
                        language={language}
                        handleChangeLanguage={handleChangeLanguage}
                        handleClose={handleCloseSettingsDialog}
                    />
                }
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
            </Grid>
        </>
    );
}

export default Metronome;