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
import CreateTemplateDialog from "./components/dialogs/createTemplateDialog";
import ConfirmDialog from "./components/dialogs/confirmDialog";

const Metronome = () => {

    const {
        isActive: tempoProgrammingIsActive,
        addSubtractOption: tempoProgrammingAddSubtractOption,
        bpmToChange: tempoProgrammingBPMToChange,
        measuresToChangeBPM: tempoProgrammingMeasuresToChangeBPM,
        goalBPM: tempoProgrammingGoalBPM,
        handleSetTempoProgramming,
        getProgrammedBPM,
    } = useTempoProgramming();

    const {
        countdownAmount,
        isPlayingCountdown,
        isPlaying,
        isPaused,
        currentTime,
        bpm,
        beatsPerMeasure,
        subdivision,
        beatTypes,
        currentBeatInMeasure,
        currentMeasure,
        handleStartMetronome,
        handleStopMetronome,
        handleTogglePauseMetronome,
        handleSetBPM,
        handleSetBeatsPerMeasure,
        handleSetSubdivision,
        handleToggleBeatType,
        handleSetCountdownAmount,
        handleSetMetronomeSettings,
    } = useMetronome(getProgrammedBPM);

    const {
        timerSecondsIsActive,
        timerMeasuresIsActive,
        timerSecondsToStop,
        timerMeasuresToStop,
        handleSetTimer,
    } = useTimer(currentTime, currentMeasure, handleStopMetronome);

    const handleUpdateByTemplateSelection: MetronomeTimerTempoProgrammingFunction = (newMetronomeSettings, newTimerSettings, newTempoProgrammingSettings) => {
        handleStopMetronome();
        handleSetMetronomeSettings(newMetronomeSettings);
        handleSetTimer(
            newTimerSettings.timerSecondsToStop,
            newTimerSettings.timerSecondsIsActive,
            newTimerSettings.timerMeasuresToStop,
            newTimerSettings.timerMeasuresIsActive
        );
        handleSetTempoProgramming(
            newTempoProgrammingSettings.tempoProgrammingBPMToChange,
            newTempoProgrammingSettings.tempoProgrammingGoalBPM,
            newTempoProgrammingSettings.tempoProgrammingMeasuresToChangeBPM,
            newTempoProgrammingSettings.tempoProgrammingAddSubtractOption,
            newTempoProgrammingSettings.tempoProgrammingIsActive
        );
    }

    const {
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

    const handleToggleMetronome = () => {
        if (timerDialogIsOpen || bpmProgrammingDialogIsOpen || createTemplateDialogIsOpen || deleteTemplateDialogIsOpen || updateTemplateDialogIsOpen) return;

        if (isPlaying) {
            handleStopMetronome();
            return;
        }

        handleStartMetronome();
    }

    useExecuteOnKeyPressed("Space", handleToggleMetronome);

    const { t } = useTranslation();

    const metronomeSettings = {
        bpm,
        beatsPerMeasure,
        subdivision,
        beatTypes,
        countdownAmount,
    };

    const timerSettings = {
        timerSecondsIsActive,
        timerSecondsToStop,
        timerMeasuresIsActive,
        timerMeasuresToStop,
    };

    const tempoProgrammingSettings = {
        tempoProgrammingIsActive,
        tempoProgrammingBPMToChange,
        tempoProgrammingGoalBPM,
        tempoProgrammingMeasuresToChangeBPM,
        tempoProgrammingAddSubtractOption,
    };

    return (
        <>
            <header className="header">
                <Title />
                <div>
                    <LanguageInput />
                    <ThemeButton />
                </div>
            </header>
            <div className="metronomeContainer">
                <div>
                    <BPMInput
                        value={bpm}
                        handleChange={handleSetBPM}
                    />
                    <TimeSignatureInput
                        subdivision={subdivision}
                        beatsPerMeasure={beatsPerMeasure}
                        handleSetBeatsPerMeasure={handleSetBeatsPerMeasure}
                        handleSetSubdivision={handleSetSubdivision}
                    />
                </div>
                <BeatDisplay
                    beatTypes={beatTypes}
                    beatsPerMeasure={beatsPerMeasure}
                    currentBeatInMeasure={currentBeatInMeasure}
                    handleClick={handleToggleBeatType}
                />
                <div className="clockCountdownContainer">
                    <Clock
                        hidePauseButton={isPlayingCountdown}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        value={currentTime}
                        secondsToStop={timerSecondsIsActive ? timerSecondsToStop : 0}
                        handleClick={handleTogglePauseMetronome}
                    />
                    <CountdownInput
                        initialAmount={countdownAmount}
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
                            isActive={tempoProgrammingIsActive}
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
                            isActive={timerSecondsIsActive || timerMeasuresIsActive}
                            handleClick={() => {
                                handleOpenTimerDialog();
                                handleStopMetronome();
                            }}
                        >
                            {<StopperIcon />}
                        </IconButton>
                    </div>
                    <TemplatesInput
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
                        initialSecondsIsActive={timerSecondsIsActive}
                        initialMeasuresIsActive={timerMeasuresIsActive}
                        initialSecondsToStop={timerSecondsToStop}
                        initialMeasuresToStop={timerMeasuresToStop}
                        handleSetTimer={handleSetTimer}
                        handleClose={handleCloseTimerDialog}
                    />
                }
                {
                    bpmProgrammingDialogIsOpen &&
                    <TempoProgrammingDialog
                        open={bpmProgrammingDialogIsOpen}
                        initialAddSubtractOption={tempoProgrammingAddSubtractOption}
                        initialIsActive={tempoProgrammingIsActive}
                        initialBPMToChange={tempoProgrammingBPMToChange}
                        initialGoalBPM={tempoProgrammingGoalBPM}
                        initialMeasuresToChangeBPM={tempoProgrammingMeasuresToChangeBPM}
                        handleSetTempoProgramming={handleSetTempoProgramming}
                        handleClose={handleCloseBPMProgrammingDialog}
                    />
                }
                {
                    createTemplateDialogIsOpen &&
                    <CreateTemplateDialog
                        open={createTemplateDialogIsOpen}
                        handleSetTemplate={(newTemplateName) => handleCreateTemplate(newTemplateName, metronomeSettings, timerSettings, tempoProgrammingSettings)}
                        handleClose={handleCloseCreateTemplateDialog}
                    />
                }
                {
                    deleteTemplateDialogIsOpen &&
                    <ConfirmDialog
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
                    updateTemplateDialogIsOpen &&
                    <ConfirmDialog
                        open={updateTemplateDialogIsOpen}
                        title={t("updateTemplate")}
                        message={t("updateTemplateQuestion")}
                        handleSubmit={() => {
                            handleUpdateTemplate(metronomeSettings, timerSettings, tempoProgrammingSettings);
                            handleCloseUpdateTemplateDialog();
                        }}
                        handleClose={handleCloseUpdateTemplateDialog}
                    />
                }
            </div>
        </>
    );
}

export default Metronome;