import { useTranslation } from "react-i18next";
import { BEATS_PER_MEASURE, NOTE_VALUES } from "../../../utils/constants";

type Props = {
  noteValue: number,
  beatsPerMeasure: number,
  handleSetBeatsPerMeasure: (newValue: number) => void,
  handleSetNoteValue: (newValue: number) => void,
}

const TimeSignatureInput = (props: Props) => {

  const {
    noteValue,
    beatsPerMeasure,
    handleSetBeatsPerMeasure,
    handleSetNoteValue,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="timeSignatureInputContainer">
      <select
        className="timeSignatureInput"
        title={t("beatsPerMeasure")}
        value={beatsPerMeasure}
        onChange={(e) => {
          handleSetBeatsPerMeasure(Number(e.target.value));
          e.currentTarget.blur();
        }}
      >
        {
          BEATS_PER_MEASURE.map((_, index) => {
            return (
              <option key={index} value={index + 1}>{index + 1}</option>
            )
          })
        }
      </select>
      <p>/</p>
      <select
        className="timeSignatureInput"
        title={t("beatValue")}
        value={noteValue}
        onChange={(e) => {
          e.currentTarget.blur();
          handleSetNoteValue(Number(e.target.value));
        }}
      >
        {
          NOTE_VALUES.map((item) => {
            return (
              <option key={item} value={item}>{item}</option>
            )
          })
        }
      </select>

    </div>
  );
};

export default TimeSignatureInput;