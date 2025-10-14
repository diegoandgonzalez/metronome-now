import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiSubtractLine, RiAddFill } from "react-icons/ri";
import { METRONOME_CONSTANTS } from "../../utils/constants";
import useSnackbarContext from "../snackbar/useSnackbarContext";
import useTapTempo from "../metronome/hooks/useTapTempo";
import styles from "./bpmInput.module.css";
import IconButton from "../iconButton";
import useExecuteKeyPressed from "../../utils/hooks/useExecuteKeyPressed";

type Props = {
  initialBPM: number,
  handleChange: (value: number) => void,
}

const BPMInput = (props: Props) => {

  const {
    initialBPM,
    handleChange,
  } = props;

  const [bpm, setBPM] = useState(String(initialBPM));
  const { tap } = useTapTempo();

  // so that when the BPM changes from outside, input fields update with that value
  useEffect(() => {
    setBPM(String(initialBPM));
  }, [initialBPM])

  const { t } = useTranslation();
  const { handleOpen: handleOpenSnackbar } = useSnackbarContext();

  const handleSubmit = (newValue = bpm) => {
    const valueToSubmit = parseInt(newValue);
    if (isNaN(valueToSubmit) || valueToSubmit < METRONOME_CONSTANTS.minBPM || valueToSubmit > METRONOME_CONSTANTS.maxBPM) {
      handleOpenSnackbar(t("bpmMustBeInRange", { min: METRONOME_CONSTANTS.minBPM, max: METRONOME_CONSTANTS.maxBPM }));
      setBPM(String(initialBPM));
      return;
    }

    setBPM(String(valueToSubmit));
    handleChange(valueToSubmit);
  }

  const subtractOneBPM = () => {
    const newBPM = Number(bpm) - 1;
    if (newBPM < METRONOME_CONSTANTS.minBPM) return;
    handleSubmit(String(newBPM));
  }

  const addOneBPM = () => {
    const newBPM = Number(bpm) + 1;
    if (newBPM > METRONOME_CONSTANTS.maxBPM) return;
    handleSubmit(String(newBPM));
  }

  useExecuteKeyPressed("ArrowUp", "keydown", addOneBPM);
  useExecuteKeyPressed("ArrowDown", "keydown", subtractOneBPM);

  return (
    <div className={styles.bpmInputContainer}>
      <input
        id="bpm"
        type="number"
        title={t("clickToEditBPM")}
        min={METRONOME_CONSTANTS.minBPM}
        max={METRONOME_CONSTANTS.maxBPM}
        value={bpm}
        onChange={(e) => setBPM(e.target.value.substring(0, 3))}
        onMouseEnter={(e) => e.currentTarget.focus()}
        onMouseLeave={(e) => e.currentTarget.blur()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        onBlur={() => handleSubmit()}
        autoComplete="off"
      />
      <div className={styles.bpmInputButtonContainer}>
        <IconButton
          variant="square"
          title={t("subtractBPM") + " (↓)"}
          onClick={subtractOneBPM}
        >
          <RiSubtractLine size={20} />
        </IconButton>
        <IconButton
          variant="square"
          title={t("tapTempoToCalculateBPM")}
          onClick={() => {
            const tappedBPM = tap();
            if (!tappedBPM) return;
            handleSubmit(String(tappedBPM))
          }}
        >
          {t("tapToGetBPM")}
        </IconButton>
        <IconButton
          variant="square"
          title={t("addBPM") + " (↑)"}
          onClick={addOneBPM}
        >
          <RiAddFill size={20} />
        </IconButton>
      </div>
    </div>
  );
};

export default BPMInput;