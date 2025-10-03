import { useTranslation } from "react-i18next";
import type { Template } from "./types";
import { MAIN_ICON_SIZE } from "../../utils/constants";
import StopIcon from "../../assets/icons/stopIcon";
import PlayIcon from "../../assets/icons/playIcon";
import TemplateIcon from "../../assets/icons/templateIcon";
import TimeIcon from "../../assets/icons/timeIcon";
import SettingsIcon from "../../assets/icons/settingsIcon";
import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import BeatDisplay from "./components/beatDisplay";
import Clock from "./components/clock";
import IconButton from "./components/iconButton";
import TempoProgrammingTimerDialog from "./components/dialogs/tempoProgrammingTimerDialog";
import Title from "./components/title";
import CountdownInput from "./components/countdownInput";
import TemplateFormDialog from "./components/dialogs/templateFormDialog";
import ConfirmationDialog from "./components/dialogs/confirmationDialog";
import AboutDialog from "./components/dialogs/aboutDialog";
import TemplatesDialog from "./components/dialogs/templatesDialog";
import SettingsDialog from "../dialog/settingsDialog";
import useDialog from "../dialog/useDialog";
import useExecuteOnKeyPressed from "../../utils/hooks/useExecuteOnKeyPressed";
import useMetronome from "./hooks/useMetronome";
import useTemplates from "./hooks/useTemplates";
import useLanguage from "../../utils/hooks/useLanguage";
import useTheme from "../../utils/hooks/useTheme";

const Metronome = () => {

    const {
        language,
        handleChangeLanguage,
    } = useLanguage();

    const {
        theme,
        handleChangeTheme,
    } = useTheme();

    const {
        isPlayingCountdown,
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
        handleSetCountdownAmount,
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
        selectedTemplateIdToChange,
        templateFormDialogIsOpen,
        templateDeleteDialogIsOpen,
        handleSelectTemplateToPlay,
        handleOpenCreateTemplate,
        handleOpenUpdateTemplate,
        handleCloseTemplateForm,
        handleOpenDeleteTemplate,
        handleCloseDeleteTemplate,
        handleCreateTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
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

    const handleToggleMetronome = () => {
        if (someDialogIsOpen) return;

        if (isPlaying) {
            handleStopMetronome();
            return;
        }

        handleStartMetronome();
    }

    const handleSubmitCreateUpdateTemplate = (newTemplateName: string) => {
        if (selectedTemplateIdToChange) {
            handleUpdateTemplate(newTemplateName, settings);
            return;
        }

        handleCreateTemplate(newTemplateName, settings);
    }

    useExecuteOnKeyPressed("Space", handleToggleMetronome);

    const { t } = useTranslation();

    const someDialogIsOpen = (
        bpmProgrammingTimerDialogIsOpen ||
        templateDialogIsOpen ||
        templateFormDialogIsOpen ||
        templateDeleteDialogIsOpen
    );

    const settingsIsActive = (
        settings.tempoProgrammingSettings.isActive ||
        settings.timerSettings.secondsIsActive ||
        settings.timerSettings.measuresIsActive
    );

    const selectedTemplateToPlayName = templates.find((template) => template.id === selectedTemplateIdToPlay)?.name || "";
    const selectedTemplateToChangeName = templates.find((template) => template.id === selectedTemplateIdToChange)?.name || "";

    return (
        <>
            <header>
                <Title handleClick={handleOpenAboutDialog} />
                <IconButton
                    isActive
                    title={t("settings")}
                    handleClick={() => {
                        handleOpenSettingsDialog();
                    }}
                >
                    <SettingsIcon size={20} />
                </IconButton>
            </header>
            <div className="metronomeContainer">
                <p className="templateLabel" data-is-hidden={String(!selectedTemplateToPlayName)} title={t("template")}>
                    {selectedTemplateToPlayName || t("noTemplate")}
                </p>
                <div>
                    <BPMInput
                        initialBPM={settings.metronomeSettings.bpm}
                        handleChange={handleSetBPM}
                    />
                    <TimeSignatureInput
                        noteValue={settings.metronomeSettings.noteValue}
                        beatsPerMeasure={settings.metronomeSettings.beatsPerMeasure}
                        handleSetBeatsPerMeasure={handleSetBeatsPerMeasure}
                        handleSetNoteValue={handleSetNoteValue}
                    />
                </div>
                <BeatDisplay
                    isPlaying={isPlaying}
                    beatTypes={settings.metronomeSettings.beatTypes}
                    beatsPerMeasure={settings.metronomeSettings.beatsPerMeasure}
                    currentBeatInMeasure={currentBeatInMeasure}
                    handleClick={handleToggleBeatType}
                />
                <div className="clockCountdownContainer">
                    <Clock
                        isPlayingCountdown={isPlayingCountdown}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        value={currentTime}
                        secondsToStop={settings.timerSettings.secondsIsActive ? settings.timerSettings.secondsToStop : 0}
                        currentMeasure={currentMeasure < 0 ? 0 : currentMeasure + 1}
                        measureToStop={settings.timerSettings.measuresIsActive ? settings.timerSettings.measuresToStop : 0}
                        handleClick={handleTogglePauseMetronome}
                    />
                    <CountdownInput
                        initialAmount={settings.metronomeSettings.countdownAmount}
                        handleClick={(newAmount) => {
                            handleSetCountdownAmount(newAmount);
                            handleStopMetronome();
                        }}
                    />
                </div>
                <footer>
                    <div className="mainActionsContainer">
                        <IconButton
                            title={t("bpmProgrammingAndTimer")}
                            isActive={settingsIsActive}
                            handleClick={() => {
                                handleOpenBPMProgrammingTimerDialog();
                                handleStopMetronome();
                            }}
                        >
                            <TimeIcon />
                        </IconButton>
                        <IconButton
                            title={t(isPlaying ? "stop" : "play")}
                            isActive
                            handleClick={handleToggleMetronome}
                        >
                            {isPlaying ? <StopIcon size={MAIN_ICON_SIZE} /> : <PlayIcon size={MAIN_ICON_SIZE} />}
                        </IconButton>
                        <IconButton
                            title={t("templates")}
                            isActive={Boolean(selectedTemplateIdToPlay)}
                            handleClick={() => {
                                handleOpenTemplateDialog();
                                handleStopMetronome();
                            }}
                        >
                            <TemplateIcon />
                        </IconButton>
                    </div>
                </footer>
                {
                    bpmProgrammingTimerDialogIsOpen &&
                    <TempoProgrammingTimerDialog
                        open={bpmProgrammingTimerDialogIsOpen}
                        initialTempoProgrammingSettings={settings.tempoProgrammingSettings}
                        initialTimerSettings={settings.timerSettings}
                        handleSetTempoProgrammingSettings={handleSetTempoProgrammingSettings}
                        handleSetTimerSettings={handleSetTimerSettings}
                        handleClose={handleCloseBPMProgrammingTimerDialog}
                    />
                }
                {
                    templateDialogIsOpen && !templateDeleteDialogIsOpen && !templateFormDialogIsOpen &&
                    <TemplatesDialog
                        open={templateDialogIsOpen}
                        disabled={!isDBReady}
                        selectedTemplateId={selectedTemplateIdToPlay}
                        templates={templates}
                        handleSelectTemplate={(templateId) => {
                            handleSelectTemplateToPlay(templateId);
                        }}
                        handleCreateTemplate={handleOpenCreateTemplate}
                        handleUpdateTemplate={handleOpenUpdateTemplate}
                        handleDeleteTemplate={handleOpenDeleteTemplate}
                        handleClose={handleCloseTemplateDialog}
                    />
                }
                {
                    templateFormDialogIsOpen &&
                    <TemplateFormDialog
                        open={templateFormDialogIsOpen}
                        initialValue={selectedTemplateToChangeName}
                        templates={templates}
                        handleSubmit={handleSubmitCreateUpdateTemplate}
                        handleClose={handleCloseTemplateForm}
                    />
                }
                {
                    templateDeleteDialogIsOpen &&
                    <ConfirmationDialog
                        open={templateDeleteDialogIsOpen}
                        title={t("deleteTemplate")}
                        message={t("deleteTemplateQuestion", { templateName: selectedTemplateToChangeName })}
                        handleSubmit={() => {
                            handleDeleteTemplate();
                            handleCloseDeleteTemplate();
                        }}
                        handleClose={handleCloseDeleteTemplate}
                    />
                }
                {
                    settingsDialogIsOpen &&
                    <SettingsDialog
                        open={settingsDialogIsOpen}
                        language={language}
                        theme={theme}
                        handleChangeLanguage={handleChangeLanguage}
                        handleChangeTheme={handleChangeTheme}
                        handleClose={handleCloseSettingsDialog}
                    />
                }
                {
                    aboutDialogIsOpen &&
                    <AboutDialog
                        open={aboutDialogIsOpen}
                        handleClose={handleCloseAboutDialog}
                    />
                }
            </div>
        </>
    );
}

export default Metronome;