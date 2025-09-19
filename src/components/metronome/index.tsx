import { useTranslation } from "react-i18next";
import type { SettingsFunction } from "./types";
import { MAIN_ICON_SIZE } from "../../utils/constants";
import StopIcon from "../../assets/icons/stopIcon";
import PlayIcon from "../../assets/icons/playIcon";
import SettingsIcon from "../../assets/icons/settingsIcon";
import TemplateIcon from "../../assets/icons/templateIcon";
import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import BeatDisplay from "./components/beatDisplay";
import Clock from "./components/clock";
import IconButton from "./components/iconButton";
import TempoProgrammingTimerDialog from "./components/dialogs/tempoProgrammingTimerDialog";
import Title from "./components/title";
import CountdownInput from "./components/countdownInput";
import TemplatesInput from "./components/templatesInput";
import CreateUpdateTemplateDialog from "./components/dialogs/createUpdateTemplateDialog";
import ConfirmationDialog from "./components/dialogs/confirmationDialog";
import AboutDialog from "./components/dialogs/aboutDialog";
import useDialog from "../dialog/useDialog";
import LanguageInput from "../languageInput";
import ThemeButton from "../themeButton";
import useExecuteOnKeyPressed from "../../utils/hooks/useExecuteOnKeyPressed";
import useMetronome from "./hooks/useMetronome";
import useTemplates from "./hooks/useTemplates";

const Metronome = () => {

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

    const handleUpdateByTemplateSelection: SettingsFunction = (newSettings) => {
        handleStopMetronome();
        handleSetMetronomeSettings(newSettings?.metronomeSettings);
        handleSetTimerSettings(newSettings?.timerSettings);
        handleSetTempoProgrammingSettings(newSettings?.tempoProgrammingSettings);
    }

    const {
        isDBReady,
        templates,
        selectedTemplateID,
        handleSelectTemplate,
        handleCreateTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
    } = useTemplates(handleUpdateByTemplateSelection);

    const {
        dialogIsOpen: createTemplateDialogIsOpen,
        handleOpenDialog: handleOpenCreateTemplateDialog,
        handleCloseDialog: handleCloseCreateTemplateDialog,
    } = useDialog();

    const {
        dialogIsOpen: updateTemplateDialogIsOpen,
        handleOpenDialog: handleOpenUpdateTemplateDialog,
        handleCloseDialog: handleCloseUpdateTemplateDialog,
    } = useDialog();

    const {
        dialogIsOpen: deleteTemplateDialogIsOpen,
        handleOpenDialog: handleOpenDeleteTemplateDialog,
        handleCloseDialog: handleCloseDeleteTemplateDialog,
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

    const someDialogIsOpen = (
        bpmProgrammingTimerDialogIsOpen ||
        createTemplateDialogIsOpen ||
        deleteTemplateDialogIsOpen ||
        updateTemplateDialogIsOpen
    );

    const handleToggleMetronome = () => {
        if (someDialogIsOpen) return;

        if (isPlaying) {
            handleStopMetronome();
            return;
        }

        handleStartMetronome();
    }

    useExecuteOnKeyPressed("Space", handleToggleMetronome);

    const { t } = useTranslation();

    return (
        <>
            <header>
                <Title handleClick={handleOpenAboutDialog} />
                <div>
                    <LanguageInput />
                    <ThemeButton />
                </div>
            </header>
            <div className="metronomeContainer">
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
                            isActive={settings.tempoProgrammingSettings.isActive || settings.timerSettings.secondsIsActive || settings.timerSettings.measuresIsActive}
                            handleClick={() => {
                                handleOpenBPMProgrammingTimerDialog();
                                handleStopMetronome();
                            }}
                        >
                            <SettingsIcon />
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
                            isActive={Boolean(selectedTemplateID)}
                            handleClick={() => {
                                handleStopMetronome();
                            }}
                        >
                            <TemplateIcon />
                        </IconButton>
                    </div>
                    <TemplatesInput
                        disabled={!isDBReady}
                        value={selectedTemplateID}
                        templates={templates}
                        handleSelectTemplate={handleSelectTemplate}
                        handleCreateTemplate={handleOpenCreateTemplateDialog}
                        handleUpdateTemplate={handleOpenUpdateTemplateDialog}
                        handleDeleteTemplate={handleOpenDeleteTemplateDialog}
                    />
                </footer>
                {
                    bpmProgrammingTimerDialogIsOpen &&
                    <TempoProgrammingTimerDialog
                        open={bpmProgrammingTimerDialogIsOpen}
                        initialAddSubtractOption={settings.tempoProgrammingSettings.addSubtractOption}
                        initialIsActive={settings.tempoProgrammingSettings.isActive}
                        initialBPMToChange={settings.tempoProgrammingSettings.bpmToChange}
                        initialGoalBPM={settings.tempoProgrammingSettings.goalBPM}
                        initialMeasuresToChangeBPM={settings.tempoProgrammingSettings.measuresToChangeBPM}
                        handleSetTempoProgrammingSettings={handleSetTempoProgrammingSettings}
                        initialSecondsIsActive={settings.timerSettings.secondsIsActive}
                        initialMeasuresIsActive={settings.timerSettings.measuresIsActive}
                        initialSecondsToStop={settings.timerSettings.secondsToStop}
                        initialMeasuresToStop={settings.timerSettings.measuresToStop}
                        handleSetTimerSettings={handleSetTimerSettings}
                        handleClose={handleCloseBPMProgrammingTimerDialog}
                    />
                }
                {
                    createTemplateDialogIsOpen &&
                    <CreateUpdateTemplateDialog
                        open={createTemplateDialogIsOpen}
                        initialValue={""}
                        templateNames={templates.map((item) => item.name)}
                        handleSetTemplate={(newTemplateName) => handleCreateTemplate(newTemplateName, settings)}
                        handleClose={handleCloseCreateTemplateDialog}
                    />
                }
                {
                    updateTemplateDialogIsOpen &&
                    <CreateUpdateTemplateDialog
                        open={updateTemplateDialogIsOpen}
                        initialValue={templates.find((item) => item.id === selectedTemplateID)?.name || ""}
                        templateNames={templates.map((item) => item.name)}
                        handleSetTemplate={(newTemplateName) => handleUpdateTemplate(newTemplateName, settings)}
                        handleClose={handleCloseUpdateTemplateDialog}
                    />
                }
                {
                    deleteTemplateDialogIsOpen &&
                    <ConfirmationDialog
                        open={deleteTemplateDialogIsOpen}
                        title={t("deleteTemplate")}
                        message={t("deleteTemplateQuestion")}
                        handleSubmit={() => {
                            handleDeleteTemplate();
                            handleCloseDeleteTemplateDialog();
                        }}
                        handleClose={handleCloseDeleteTemplateDialog}
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