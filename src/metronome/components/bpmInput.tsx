import { MAX_BPM, MIN_BPM } from "../constants";

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
      <input
        className="bpmInput"
        min={MIN_BPM}
        max={MAX_BPM}
        value={value}
        onMouseOver={(e) => e.currentTarget.focus()}
        onMouseOut={(e) => e.currentTarget.blur()}
        onChange={() => { }}
        onWheel={(e) => {
          const valueToAdd = e.deltaY * -0.01;
          handleChange(parseInt((e.target as HTMLInputElement).value) + valueToAdd)
        }}
      />
      <input
        type="range"
        className="bpmInput"
        min={MIN_BPM}
        max={MAX_BPM}
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value))}
      />
    </div>
  );
};

export default BPMInput;