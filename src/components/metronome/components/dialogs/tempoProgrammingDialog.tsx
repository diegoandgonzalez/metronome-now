import { useState } from "react";
import Dialog from "../../../dialog/dialog";
import { useTranslation } from "react-i18next";
import {
    ADD_OPTION,
    ADD_SUBTRACT_ARRAY,
    MAX_BPM,
    MAX_MEASURES_TO_CHANGE_BPM,
    MIN_BPM,
    MIN_MEASURES_TO_CHANGE_BPM,
} from "../../../../utils/constants";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";

type Props = {
    open: boolean,
    initialAddSubtractOption: string,
    initialIsActive: boolean
    initialBPMToChange: number,
    initialGoalBPM: number,
    initialMeasuresToChangeBPM: number,
    handleSetTempoProgramming: (bpmToChange: number, maxBPM: number, measuresToChangeBPM: number, addSubtractOption: string, isActive: boolean) => void,
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
        handleSetTempoProgramming,
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

        if (formattedBPMToChange < 0 && addSubtractOption === ADD_OPTION) {
            handleOpenSnackbar(t("bpmToChangeCannotBeNegative"));
            return;
        }

        if (formattedBPMToChange < (MAX_BPM * -1)) {
            handleOpenSnackbar(t("bpmToChangeCannotBeLessThan", { value: MAX_BPM * -1 }));
            return;
        }

        if (formattedBPMToChange > MAX_BPM) {
            handleOpenSnackbar(t("bpmToChangeCannotBeGreaterThan", { value: MAX_BPM }));
            return;
        }

        if (!formattedGoalBPM) {
            handleOpenSnackbar(t("goalBPMCannotBeEmpty"));
            return;
        }

        if (formattedGoalBPM < 0) {
            handleOpenSnackbar(t("goalBPMCannotBeNegative"));
            return;
        }

        if (formattedMeasuresToChangeBPM < 0) {
            handleOpenSnackbar(t("measuresToChangeBPMCannotBeNegative"));
            return;
        }

        if (formattedMeasuresToChangeBPM > MAX_MEASURES_TO_CHANGE_BPM) {
            handleOpenSnackbar(t("measuresToChangeBPMHasToBeLessThan", { value: MAX_MEASURES_TO_CHANGE_BPM }));
            return;
        }

        handleSetTempoProgramming(formattedBPMToChange, formattedGoalBPM, formattedMeasuresToChangeBPM, addSubtractOption, isActive);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            title={t("bpmProgramming")}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <div className="checkboxContainer">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => {
                        e.currentTarget.blur();
                        setIsActive((prev) => !prev);
                    }}
                    title={t(isActive ? "clickToTurnOffProgramming" : "clickToTurnOnProgramming")}
                />
                <select
                    value={addSubtractOption}
                    onChange={(e) => setAddSubtractOption(e.target.value)}
                    title={t("selectHowBPMchanges")}
                >
                    {
                        ADD_SUBTRACT_ARRAY
                            .map((item) => {
                                return (
                                    <option key={item} value={item}>{t(item)}</option>
                                )
                            })
                    }
                </select>
                <input
                    className="dialogInput"
                    type="number"
                    min={0}
                    max={MAX_BPM}
                    value={bpmToChange}
                    onChange={(e) => setBPMToChange(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("bpmEvery")}
                <input
                    className="dialogInput"
                    type="number"
                    min={MIN_MEASURES_TO_CHANGE_BPM}
                    max={MAX_MEASURES_TO_CHANGE_BPM}
                    value={measuresToChangeBPM}
                    onChange={(e) => setMeasuresToChangeBPM(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("measuresUntil")}
                <input
                    className="dialogInput"
                    type="number"
                    min={MIN_BPM}
                    max={MAX_BPM}
                    value={goalBPM}
                    onChange={(e) => setGoalBPM(e.target.value.substring(0, 3))}
                    autoComplete="off"
                />
                {t("bpm")}
            </div>
        </Dialog>
    );
}

export default TempoProgrammingDialog;