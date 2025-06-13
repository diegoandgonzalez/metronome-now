import { useEffect, useState } from "react";
import { MAX_BPM, MIN_BPM } from "../../../utils/constants";
import useSnackbarContext from "../../snackbar/useSnackbarContext";
import { useTranslation } from "react-i18next";
import useTapToBPM from "../hooks/useTapToBPM";

type Props = {
  value: number,
  handleChange: (value: number) => void,
}

const BPMInput = (props: Props) => {

  const {
    value,
    handleChange,
  } = props;

  const [localBPM, setLocalBPM] = useState(String(value));
  const { tap } = useTapToBPM();

  // so that when the BPM changes from outside, input fields update with that value
  useEffect(() => {
    setLocalBPM(String(value));
  }, [value])

  const { t } = useTranslation();
  const { handleOpen: handleOpenSnackbar } = useSnackbarContext();

  const handleSubmit = (newValue = localBPM) => {
    let valueToSubmit = parseInt(newValue);
    if (isNaN(valueToSubmit) || valueToSubmit < MIN_BPM || valueToSubmit > MAX_BPM) {
      handleOpenSnackbar(t("bpmMustBeInRange", { min: MIN_BPM, max: MAX_BPM }));
      setLocalBPM(String(value));
      return;
    }

    setLocalBPM(String(valueToSubmit));
    handleChange(valueToSubmit);
  }

  return (
    <div className="bpmInputContainer">
      <div className="bpmInputButtonContainer">
        <button
          className="bpmInputButton"
          onClick={(e) => {
            e.currentTarget.blur();
            handleSubmit(String(Number(localBPM) - 5));
          }}
        >
          - 5
        </button>
        <input
          type="number"
          className="bpmInput"
          min={MIN_BPM}
          max={MAX_BPM}
          value={localBPM}
          onChange={(e) => setLocalBPM(e.target.value.substring(0, 3))}
          onMouseEnter={(e) => e.currentTarget.focus()}
          onMouseLeave={(e) => e.currentTarget.blur()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
              handleSubmit();
            }
          }}
          onBlur={() => handleSubmit()}
          autoComplete="off"
        />
        <button
          className="bpmInputButton"
          onClick={(e) => {
            e.currentTarget.blur();
            handleSubmit(String(Number(localBPM) + 5));
          }}
        >
          + 5
        </button>
      </div>
      <button
        className="bpmTapButton"
        onClick={(e) => {
          e.currentTarget.blur();
          const tappedBPM = tap();
          if (!tappedBPM) return;
          handleSubmit(String(tappedBPM))
        }}
      >
        👆 {t("tapToGetBPM")}
      </button>
      <input
        type="range"
        className="bpmInput"
        min={MIN_BPM}
        max={MAX_BPM}
        value={value}
        onChange={(e) => handleSubmit(e.target.value)}
      />
    </div>
  );
};

export default BPMInput;