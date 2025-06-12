import { useState } from "react";
import Dialog from "../../dialog/dialog";
import { useTranslation } from "react-i18next";
import { ADD_OPTION, ADD_SUBTRACT_ARRAY, MAX_BPM, MAX_MEASURES_TO_CHANGE_BPM, MIN_BPM } from "../../../utils/constants";

type Props = {
    ref: React.RefObject<HTMLDialogElement | null>,
    initialIsActive: boolean
    initialBPMToChange: number,
    initialGoalBPM: number,
    initialMeasuresToChangeBPM: number,
    currentBPM: number,
    handleSetBPMProgramming: (bpmToChange: number, maxBPM: number, measuresToChangeBPM: number, isActive: boolean) => void,
    handleClose: () => void,
}

const BPMProgrammingDialog = (props: Props) => {

    const {
        ref,
        initialIsActive,
        initialBPMToChange,
        initialGoalBPM,
        initialMeasuresToChangeBPM,
        currentBPM,
        handleSetBPMProgramming,
        handleClose,
    } = props;

    const { t } = useTranslation();

    const [isActive, setIsActive] = useState(initialIsActive);
    const [bpmToChange, setBPMToChange] = useState<number | string>(initialBPMToChange);
    const [goalBPM, setGoalBPM] = useState<number | string>(initialGoalBPM);
    const [measuresToChangeBPM, setMeasuresToChangeBPM] = useState<number | string>(initialMeasuresToChangeBPM);
    const [addSubtractOption, setAddSubtractOption] = useState<string>(ADD_OPTION);

    const handleCloseAndReset = () => {
        handleClose();
        setIsActive(initialIsActive);
        setBPMToChange(initialBPMToChange);
        setGoalBPM(initialGoalBPM);
    }

    const handleSubmit = () => {
        const formattedBPMToChange = Math.round(Number(bpmToChange) * (addSubtractOption === ADD_OPTION ? 1 : -1));
        const formattedGoalBPM = Math.round(Number(goalBPM));
        const formattedMeasuresToChangeBPM = Math.round(Number(measuresToChangeBPM));

        const bpmToChangeIsValid = (() => {
            if (!formattedBPMToChange) return false;
            if (formattedBPMToChange < (MAX_BPM * -1)) return false;
            if (formattedBPMToChange > MAX_BPM) return false;
            return true;
        })();

        if (!bpmToChangeIsValid) {
            console.error("NO bpmToChangeIsValid")
            // TODO: show message
            return;
        }

        const goalBPMIsValid = (() => {
            if (!formattedGoalBPM) return;
            if (formattedBPMToChange > 0 && formattedGoalBPM <= currentBPM) return false; // goalBPM has to be higher than current BPM 
            if (formattedBPMToChange < 0 && formattedGoalBPM >= currentBPM) return false; // goalBPM has to be lower than current BPM 
            return true;
        })();

        if (!goalBPMIsValid) {
            console.error("NO goalBPMIsValid")
            // TODO: show message
            return;
        }

        const measuresToChangeBPMIsValid = formattedMeasuresToChangeBPM > 0;

        if (!measuresToChangeBPMIsValid) {
            console.error("NO measuresToChangeBPMIsValid")
            // TODO: show message
            return;
        }

        handleSetBPMProgramming(formattedBPMToChange, formattedGoalBPM, formattedMeasuresToChangeBPM, isActive);
        handleCloseAndReset();
    }

    return (
        <Dialog
            ref={ref}
            title={t("bpmProgramming")}
            handleClose={handleCloseAndReset}
            handleSubmit={handleSubmit}
        >
            <div className="checkboxContainer">
                <input
                    id="bpmProgrammingIsActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive((prev) => !prev)}
                />
                <label htmlFor="bpmProgrammingIsActive">
                    {t("bpmProgrammingIsActive")}
                </label>
            </div>
            <div>
                <label htmlFor="bpmToChange">
                    {t("bpmToChange")}
                    <select
                        value={addSubtractOption}
                        onChange={(e) => setAddSubtractOption(e.target.value)}
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
                        id="bpmToChange"
                        className="dialogInput"
                        type="number"
                        min={0}
                        max={MAX_BPM}
                        value={bpmToChange}
                        onChange={(e) => setBPMToChange(e.target.value.substring(0, 3))}
                    />
                </label>
            </div>
            <div>
                <label htmlFor="measuresToChangeBPM">
                    {t("changeBPMevery")}
                    <input
                        id="measuresToChangeBPM"
                        className="dialogInput"
                        type="number"
                        min={0}
                        max={MAX_MEASURES_TO_CHANGE_BPM}
                        value={measuresToChangeBPM}
                        onChange={(e) => setMeasuresToChangeBPM(e.target.value.substring(0, 3))}
                    />
                    {t("measures")}
                </label>
            </div>
            <div>
                <label htmlFor="goalBPM">
                    {t("goalBPM")}
                    <input
                        id="goalBPM"
                        className="dialogInput"
                        type="number"
                        min={MIN_BPM}
                        max={MAX_BPM}
                        value={goalBPM}
                        onChange={(e) => setGoalBPM(e.target.value.substring(0, 3))}
                    />
                </label>
            </div>
        </Dialog>
    );
}

export default BPMProgrammingDialog;