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
      <input
        type="number"
        min={MIN_BPM}
        max={MAX_BPM}
        value={value}
        onMouseOver={(e) => e.currentTarget.focus()}
        onMouseOut={(e) => e.currentTarget.blur()}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        />
      <input
        type="range"
        min={MIN_BPM}
        max={MAX_BPM}
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value))}
      />
    </div>
  );
};

export default BPMInput;