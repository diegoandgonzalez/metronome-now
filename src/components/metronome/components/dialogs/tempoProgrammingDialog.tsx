import { useState } from "react";
import { useTranslation } from "react-i18next";
import { METRONOME_CONSTANTS, TEMPO_PROGRAMMING_CONSTANTS } from "../../../../utils/constants";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";
import FormDialog from "../../../dialog/formDialog";
import type { TempoProgrammingSettings } from "../../types";

type Props = {
    open: boolean,
    initialAddSubtractOption: string,
    initialIsActive: boolean
    initialBPMToChange: number,
    initialGoalBPM: number,
    initialMeasuresToChangeBPM: number,
    handleSetTempoProgrammingSettings: (newSettings: TempoProgrammingSettings) => void,
    handleClose: () => void,
}

const TempoProgrammingDialog = (props: Props) => {

    const {
        open,
        initialIsActive,
        initialAddSubtractOption,
        initialBPMToChange,
        initialGoalBPM,
        initialMeasuresToChangeBPM,
        handleSetTempoProgrammingSettings,
        handleClose,
    } = props;

    const { t } = useTranslation();

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const [isActive, setIsActive] = useState(initialIsActive);
    const [bpmToChange, setBPMToChange] = useState<number | string>(initialBPMToChange);
    const [goalBPM, setGoalBPM] = useState<number | string>(initialGoalBPM);
    const [measuresToChangeBPM, setMeasuresToChangeBPM] = useState<number | string>(initialMeasuresToChangeBPM);
    const [addSubtractOption, setAddSubtractOption] = useState<string>(initialAddSubtractOption);

    const handleSubmit = () => {
        const formattedBPMToChange = Math.round(Number(bpmToChange));
        const formattedGoalBPM = Math.round(Number(goalBPM));
        const formattedMeasuresToChangeBPM = Math.round(Number(measuresToChangeBPM));

        if (formattedBPMToChange < 0 && addSubtractOption === TEMPO_PROGRAMMING_CONSTANTS.actions.add) {
            handleOpenSnackbar(t("bpmToChangeCannotBeNegative"));
            return;
        }

        if (formattedBPMToChange < (METRONOME_CONSTANTS.maxBPM * -1)) {
            handleOpenSnackbar(t("bpmToChangeCannotBeLessThan", { value: METRONOME_CONSTANTS.maxBPM * -1 }));
            return;
        }

        if (formattedBPMToChange > METRONOME_CONSTANTS.maxBPM) {
            handleOpenSnackbar(t("bpmToChangeCannotBeGreaterThan", { value: METRONOME_CONSTANTS.maxBPM }));
            return;
        }

        if (formattedMeasuresToChangeBPM < 0) {
            handleOpenSnackbar(t("measuresToChangeBPMCannotBeNegative"));
            return;
        }

        if (formattedMeasuresToChangeBPM > TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM) {
            handleOpenSnackbar(t("measuresToChangeBPMHasToBeLessThan", { value: TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM }));
            return;
        }

        if (!formattedGoalBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeEmpty"));
            return;
        }

        if (formattedGoalBPM < METRONOME_CONSTANTS.minBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeLessThan", { value: METRONOME_CONSTANTS.minBPM }));
            return;
        }

        if (formattedGoalBPM > METRONOME_CONSTANTS.maxBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeGreaterThan", { value: METRONOME_CONSTANTS.maxBPM }));
            return;
        }

        const newSettings = {
            isActive: isActive,
            bpmToChange: formattedBPMToChange,
            goalBPM: formattedGoalBPM,
            measuresToChangeBPM: formattedMeasuresToChangeBPM,
            addSubtractOption: addSubtractOption,
        }

        handleSetTempoProgrammingSettings(newSettings);
        handleClose();
    }

    return (
        <FormDialog
            open={open}
            title={t("bpmProgramming")}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <label>
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => {
                        e.currentTarget.blur();
                        setIsActive((prev) => !prev);
                    }}
                    title={t(isActive ? "clickToTurnOffProgramming" : "clickToTurnOnProgramming")}
                />
                {t("tempoProgrammingIsActive")}
            </label>
            <select
                value={addSubtractOption}
                onChange={(e) => {
                    e.currentTarget.blur();
                    setAddSubtractOption(e.target.value);
                }}
                title={t("selectHowBPMchanges")}
            >
                {
                    [TEMPO_PROGRAMMING_CONSTANTS.actions.add, TEMPO_PROGRAMMING_CONSTANTS.actions.subtract]
                        .map((item) => {
                            return (
                                <option key={item} value={item}>{t(item)}</option>
                            )
                        })
                }
            </select>
            <label>
                <input
                    className="dialogInput"
                    type="number"
                    min={0}
                    max={METRONOME_CONSTANTS.maxBPM}
                    value={bpmToChange}
                    onChange={(e) => setBPMToChange(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("bpmEvery")}
            </label>
            <label >
                <input
                    className="dialogInput"
                    type="number"
                    min={TEMPO_PROGRAMMING_CONSTANTS.minMeasuresToChangeBPM}
                    max={TEMPO_PROGRAMMING_CONSTANTS.maxMeasuresToChangeBPM}
                    value={measuresToChangeBPM}
                    onChange={(e) => setMeasuresToChangeBPM(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("measuresUntil")}
            </label>
            <label>
                <input
                    className="dialogInput"
                    type="number"
                    min={METRONOME_CONSTANTS.minBPM}
                    max={METRONOME_CONSTANTS.maxBPM}
                    value={goalBPM}
                    onChange={(e) => setGoalBPM(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("bpm")}
            </label>
        </FormDialog>
    );
}

export default TempoProgrammingDialog;