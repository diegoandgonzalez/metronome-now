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
      <button
        onClick={(e) => {
          handleChange(value - 1);
          e.currentTarget.blur();
        }}
      >
        -1
      </button>
      <button
        onClick={(e) => {
          handleChange(value - 5);
          e.currentTarget.blur();
        }}
      >
        -5
      </button>
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
      <button
        onClick={(e) => {
          handleChange(value + 1);
          e.currentTarget.blur();
        }}
      >
        +1
      </button>
      <button
        onClick={(e) => {
          handleChange(value + 5);
          e.currentTarget.blur();
        }}
      >
        +5
      </button>
    </div>
  );
};

export default BPMInput;