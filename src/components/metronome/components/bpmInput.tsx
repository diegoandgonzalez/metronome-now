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

  return (
    <div className="bpmInputContainer">
      <p
        className="bpmInput"
        onWheel={(e) => {
          const valueToAdd = e.deltaY * -0.01;
          handleChange(value + valueToAdd)
        }}
      >
        {value}
        </p>
      <input
        type="range"
        className="bpmInputRange"
        min={MIN_BPM}
        max={MAX_BPM}
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value))}
      />
    </div>
  );
};

export default BPMInput;