import { useTranslation } from "react-i18next";
import BPMInput from "./components/bpmInput";
import TimeSignatureInput from "./components/timeSignatureInput";
import BeatDisplay from "./components/beatDisplay";
import Clock from "./components/clock";
import useMetronome from "./hooks/useMetronome";
import IconButton from "./components/iconButton";
import StopIcon from "../../assets/icons/stopIcon";
import PlayIcon from "../../assets/icons/playIcon";
import AddSubtractIcon from "../../assets/icons/addSubtractIcon";
import StopperIcon from "../../assets/icons/stopperIcon";
import TempoProgrammingDialog from "./components/dialogs/tempoProgrammingDialog";
import TimerDialog from "./components/dialogs/timerDialog";
import useDialog from "../dialog/useDialog";
import useExecuteOnKeyPressed from "../../utils/hooks/useExecuteOnKeyPressed";
import { MAIN_ICON_SIZE } from "../../utils/constants";
import useTimer from "./hooks/useTimer";
import useTempoProgramming from "./hooks/useTempoProgramming";
import Title from "./components/title";
import LanguageInput from "../languageInput";
import ThemeButton from "../themeButton";
import CountdownInput from "./components/countdownInput";
import TemplatesInput from "./components/templatesInput";
import type { MetronomeTimerTempoProgrammingFunction } from "./types";
import useTemplates from "./hooks/useTemplates";
import CreateUpdateTemplateDialog from "./components/dialogs/createUpdateTemplateDialog";
import ConfirmationDialog from "./components/dialogs/confirmationDialog";
import AboutDialog from "./components/dialogs/aboutDialog";

const Metronome = () => {

    const {
        settings: tempoProgrammingSettings,
        handleSetTempoProgrammingSettings,
        getProgrammedBPM,
    } = useTempoProgramming();

    const {
        settings: timerSettings,
        handleSetTimerSettings,
    } = useTimer();

    const {
        isPlayingCountdown,
        isPlaying,
        isPaused,
        currentTime,
        currentBeatInMeasure,
        currentMeasure,
        settings: metronomeSettings,
        handleStartMetronome,
        handleStopMetronome,
        handleTogglePauseMetronome,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetNoteValue,
        handleToggleBeatType,
        handleSetCountdownAmount,
        handleSetMetronomeSettings,
    } = useMetronome(getProgrammedBPM, timerSettings);

    const handleUpdateByTemplateSelection: MetronomeTimerTempoProgrammingFunction = (newMetronomeSettings, newTimerSettings, newTempoProgrammingSettings) => {
        handleStopMetronome();
        handleSetMetronomeSettings(newMetronomeSettings);
        handleSetTimerSettings(newTimerSettings);
        handleSetTempoProgrammingSettings(newTempoProgrammingSettings);
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
        dialogIsOpen: createTemplateDialogIsOpen,
        handleOpenDialog: handleOpenCreateTemplateDialog,
        handleCloseDialog: handleCloseCreateTemplateDialog,
    } = useDialog();

    const {
        dialogIsOpen: timerDialogIsOpen,
        handleOpenDialog: handleOpenTimerDialog,
        handleCloseDialog: handleCloseTimerDialog,
    } = useDialog();

    const {
        dialogIsOpen: bpmProgrammingDialogIsOpen,
        handleOpenDialog: handleOpenBPMProgrammingDialog,
        handleCloseDialog: handleCloseBPMProgrammingDialog,
    } = useDialog();

    const {
        dialogIsOpen: aboutDialogIsOpen,
        handleOpenDialog: handleOpenAboutDialog,
        handleCloseDialog: handleCloseAboutDialog,
    } = useDialog();

    const someDialogIsOpen = (
        timerDialogIsOpen
        || bpmProgrammingDialogIsOpen
        || createTemplateDialogIsOpen
        || deleteTemplateDialogIsOpen
        || updateTemplateDialogIsOpen
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
                        value={metronomeSettings.bpm}
                        handleChange={handleSetBPM}
                    />
                    <TimeSignatureInput
                        noteValue={metronomeSettings.noteValue}
                        beatsPerMeasure={metronomeSettings.beatsPerMeasure}
                        handleSetBeatsPerMeasure={handleSetBeatsPerMeasure}
                        handleSetNoteValue={handleSetNoteValue}
                    />
                </div>
                <BeatDisplay
                    beatTypes={metronomeSettings.beatTypes}
                    beatsPerMeasure={metronomeSettings.beatsPerMeasure}
                    currentBeatInMeasure={currentBeatInMeasure}
                    handleClick={handleToggleBeatType}
                />
                <div className="clockCountdownContainer">
                    <Clock
                        hidePauseButton={isPlayingCountdown}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        value={currentTime}
                        secondsToStop={timerSettings.secondsIsActive ? timerSettings.secondsToStop : 0}
                        handleClick={handleTogglePauseMetronome}
                    />
                    <CountdownInput
                        initialAmount={metronomeSettings.countdownAmount}
                        handleClick={(newAmount) => {
                            handleSetCountdownAmount(newAmount);
                            handleStopMetronome();
                        }}
                    />
                </div>
                <footer>
                    <div className="mainActionsContainer">
                        <IconButton
                            title={t("bpmProgramming")}
                            isActive={tempoProgrammingSettings.isActive}
                            handleClick={() => {
                                handleOpenBPMProgrammingDialog();
                                handleStopMetronome();
                            }}
                        >
                            {<AddSubtractIcon />}
                        </IconButton>
                        <IconButton
                            title={t(isPlaying ? "stop" : "play")}
                            isActive
                            handleClick={handleToggleMetronome}
                        >
                            {isPlaying ? <StopIcon size={MAIN_ICON_SIZE} /> : <PlayIcon size={MAIN_ICON_SIZE} />}
                        </IconButton>
                        <IconButton
                            title={t("timer")}
                            isActive={timerSettings.secondsIsActive || timerSettings.measuresIsActive}
                            handleClick={() => {
                                handleOpenTimerDialog();
                                handleStopMetronome();
                            }}
                        >
                            {<StopperIcon />}
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
                    timerDialogIsOpen &&
                    <TimerDialog
                        open={timerDialogIsOpen}
                        initialSecondsIsActive={timerSettings.secondsIsActive}
                        initialMeasuresIsActive={timerSettings.measuresIsActive}
                        initialSecondsToStop={timerSettings.secondsToStop}
                        initialMeasuresToStop={timerSettings.measuresToStop}
                        handleSetTimerSettings={handleSetTimerSettings}
                        handleClose={handleCloseTimerDialog}
                    />
                }
                {
                    bpmProgrammingDialogIsOpen &&
                    <TempoProgrammingDialog
                        open={bpmProgrammingDialogIsOpen}
                        initialAddSubtractOption={tempoProgrammingSettings.addSubtractOption}
                        initialIsActive={tempoProgrammingSettings.isActive}
                        initialBPMToChange={tempoProgrammingSettings.bpmToChange}
                        initialGoalBPM={tempoProgrammingSettings.goalBPM}
                        initialMeasuresToChangeBPM={tempoProgrammingSettings.measuresToChangeBPM}
                        handleSetTempoProgrammingSettings={handleSetTempoProgrammingSettings}
                        handleClose={handleCloseBPMProgrammingDialog}
                    />
                }
                {
                    createTemplateDialogIsOpen &&
                    <CreateUpdateTemplateDialog
                        open={createTemplateDialogIsOpen}
                        initialValue={""}
                        templateNames={templates.map((item) => item.name)}
                        handleSetTemplate={(newTemplateName) => handleCreateTemplate(newTemplateName, metronomeSettings, timerSettings, tempoProgrammingSettings)}
                        handleClose={handleCloseCreateTemplateDialog}
                    />
                }
                {
                    updateTemplateDialogIsOpen &&
                    <CreateUpdateTemplateDialog
                        open={updateTemplateDialogIsOpen}
                        initialValue={templates.find((item) => item.id === selectedTemplateID)?.name || ""}
                        templateNames={templates.map((item) => item.name)}
                        handleSetTemplate={(newTemplateName) => handleUpdateTemplate(newTemplateName, metronomeSettings, timerSettings, tempoProgrammingSettings)}
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