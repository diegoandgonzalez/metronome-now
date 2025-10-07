import { useTranslation } from "react-i18next";
import { METRONOME_CONSTANTS } from "../../../utils/constants";

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
        id="beatsPerMeasure"
        title={t("beatsPerMeasure")}
        value={beatsPerMeasure}
        onChange={(e) => handleSetBeatsPerMeasure(Number(e.target.value))}
      >
        {
          METRONOME_CONSTANTS.beatsPerMeasureOptions.map((_, index) => {
            return (
              <option key={index} value={index + 1}>{index + 1}</option>
            )
          })
        }
      </select>
      <p>/</p>
      <select
        id="noteValue"
        title={t("beatValue")}
        value={noteValue}
        onChange={(e) => handleSetNoteValue(Number(e.target.value))}
      >
        {
          METRONOME_CONSTANTS.noteValueOptions.map((noteValue) => {
            return (
              <option key={noteValue} value={noteValue}>{noteValue}</option>
            )
          })
        }
      </select>
    </div>
  );
};

export default TimeSignatureInput;