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
    <div>
      <button onClick={() => handleChange(value - 1)}>-1</button>
      <button onClick={() => handleChange(value - 5)}>-5</button>
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
      <button onClick={() => handleChange(value + 1)}>+1</button>
      <button onClick={() => handleChange(value + 5)}>+5</button>
    </div>
  );
};

export default BPMInput;