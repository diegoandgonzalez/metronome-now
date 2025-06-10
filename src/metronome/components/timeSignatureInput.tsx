import { TIME_SIGNATURES } from "../../utils/constants";
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
    <select
      className="timeSignatureInput"
      value={`${value.beatsPerMeasure}/${value.subdivision}`}
      onChange={(e) => {
        handleChange(e.target.value);
        e.currentTarget.blur();
      }}
    >
      {
        TIME_SIGNATURES.map((item) => {
          return (
            <option key={item} value={item}>{item}</option>
          )
        })
      }
    </select>
  );
};

export default TimeSignatureInput;