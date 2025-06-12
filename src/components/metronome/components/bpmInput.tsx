import { useEffect, useState } from "react";
import { MAX_BPM, MIN_BPM } from "../../../utils/constants";

type Props = {
  value: number,
  handleChange: (value: number) => void,
}

const BPMInput = (props: Props) => {

  const {
    value,
    handleChange,
  } = props;

  const [auxBPM, setAuxBPM] = useState(String(value));

  // so that when the BPM changes from outside, input fields update with that value
  useEffect(() => {
    setAuxBPM(String(value));
  }, [value])

  const handleSubmit = (newValue = auxBPM) => {
    let valueToSubmit = parseInt(newValue);
    if (!valueToSubmit || isNaN(valueToSubmit) || valueToSubmit < MIN_BPM || valueToSubmit > MAX_BPM) {
      setAuxBPM(String(value));
      return;
    }

    setAuxBPM(String(valueToSubmit));
    handleChange(valueToSubmit);
  }

  return (
    <div className="bpmInputContainer">
      <input
        type="number"
        className="bpmInput"
        min={MIN_BPM}
        max={MAX_BPM}
        value={auxBPM}
        onChange={(e) => setAuxBPM(e.target.value.substring(0, 3))}
        onMouseEnter={(e) => e.currentTarget.focus()}
        onMouseLeave={(e) => e.currentTarget.blur()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        onBlur={() => handleSubmit()}
      />
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