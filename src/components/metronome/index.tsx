import { useTranslation } from "react-i18next";
import type { Template } from "../../utils/types";
import { MAIN_ICON_SIZE } from "../../utils/constants";
import {
    RiPlayLargeFill,
    RiStopFill,
    RiPlayList2Fill,
    RiTimerLine,
} from "react-icons/ri";
import Header from "../header";
import BPMInput from "../bpmInput";
import TimeSignatureInput from "../timeSignatureInput";
import BeatIndicator from "../beatIndicator";
import Clock from "../clock";
import IconButton from "../iconButton";
import TempoProgrammingTimerDialog from "../tempoProgrammingTimerDialog";
import CountdownInput from "../countdownInput";
import TemplateFormDialog from "../templateFormDialog";
import AboutDialog from "../aboutDialog";
import TemplatesDialog from "../templatesDialog";
import SettingsDialog from "../settingsDialog/settingsDialog";
import useDialog from "../dialog/useDialog";
import useExecuteOnShiftComboPressed from "../../utils/hooks/useExecuteOnShiftComboPressed";
import useLanguage from "../../utils/hooks/useLanguage";
import useTheme from "../../utils/hooks/useTheme";
import useMetronome from "./hooks/useMetronome";
import useTemplates from "./hooks/useTemplates";
import styles from "./metronome.module.css";

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
        templateFormDialogIsOpen,
        templateFormData,
        handleSelectTemplateToPlay,
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

    const handleToggleMetronome = () => {
        if (someDialogIsOpen) return;

        if (isPlaying) {
            handleStopMetronome();
            return;
        }

        handleStartMetronome();
    }

    useExecuteOnShiftComboPressed("p", handleToggleMetronome);

    const { t } = useTranslation();

    const someDialogIsOpen = (
        bpmProgrammingTimerDialogIsOpen ||
        templateDialogIsOpen ||
        templateFormDialogIsOpen
    );

    const settingsIsActive = (
        settings.tempoProgrammingSettings.isActive ||
        settings.timerSettings.secondsIsActive ||
        settings.timerSettings.measuresIsActive
    );

    const selectedTemplateToPlayName = templates.find((template) => template.id === selectedTemplateIdToPlay)?.name || "";

    return (
        <>
            <Header
                handleTitleClick={handleOpenAboutDialog}
                handleSettingsClick={handleOpenSettingsDialog}
            />
            <div className={styles.metronomeContainer}>
                <p
                    className={styles.templateLabel}
                    data-is-hidden={String(!selectedTemplateToPlayName)}
                    title={t("template")}
                >
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
                <BeatIndicator
                    isPlaying={isPlaying}
                    beatTypes={settings.metronomeSettings.beatTypes}
                    beatsPerMeasure={settings.metronomeSettings.beatsPerMeasure}
                    currentBeatInMeasure={currentBeatInMeasure}
                    handleClick={handleToggleBeatType}
                />
                <div className={styles.clockAndCountdownContainer}>
                    <Clock
                        showOnlyClock={isPlayingCountdown}
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
                <div className={styles.mainActionsContainer}>
                    <IconButton
                        title={t("bpmProgrammingAndTimer")}
                        color={settingsIsActive ? "main" : "secondary"}
                        onClick={() => {
                            handleOpenBPMProgrammingTimerDialog();
                            handleStopMetronome();
                        }}
                    >
                        <RiTimerLine size={35} />
                    </IconButton>
                    <IconButton
                        title={t(isPlaying ? "stop" : "play")}
                        onClick={handleToggleMetronome}
                    >
                        {isPlaying ? <RiStopFill size={MAIN_ICON_SIZE} /> : <RiPlayLargeFill size={MAIN_ICON_SIZE} />}
                    </IconButton>
                    <IconButton
                        title={t("templates")}
                        color={selectedTemplateIdToPlay ? "main" : "secondary"}
                        onClick={() => {
                            handleOpenTemplateDialog();
                            handleStopMetronome();
                        }}
                    >
                        <RiPlayList2Fill size={35} />
                    </IconButton>
                </div>
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
                    templateDialogIsOpen && !templateFormDialogIsOpen &&
                    <TemplatesDialog
                        open={templateDialogIsOpen}
                        disabled={!isDBReady}
                        selectedTemplateId={selectedTemplateIdToPlay}
                        templates={templates}
                        handleSelectTemplate={(templateId) => handleSelectTemplateToPlay(templateId)}
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