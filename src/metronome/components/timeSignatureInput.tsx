import { TIME_SIGNATURES } from "../constants";
import type { TimeSignature } from "../types";

type Props = {
  value: TimeSignature,
  handleChange: (timeSignature: string) => void,
}

const TimeSignatureInput = (props: Props) => {

  const {
    value,
    handleChange,
  } = props;

  return (
    <label>
      Time signature:
      <select
        value={`${value.beatsPerMeasure}/${value.subdivision}`}
        onChange={(e) => handleChange(e.target.value)}
      >
        {
          TIME_SIGNATURES.map((item) => {
            return (
              <option key={item} value={item}>{item}</option>
            )
          })
        }
      </select>
    </label>
  );
};

export default TimeSignatureInput;