import { useTranslation } from "react-i18next";
import { BEATS_PER_MEASURE, SUBDIVISIONS } from "../../../utils/constants";

type Props = {
  subdivision: number,
  beatsPerMeasure: number,
  handleSetBeatsPerMeasure: (newValue: number) => void,
  handleSetSubdivision: (newValue: number) => void,
}

const TimeSignatureInput = (props: Props) => {

  const {
    subdivision,
    beatsPerMeasure,
    handleSetBeatsPerMeasure,
    handleSetSubdivision,
  } = props;

const { t} = useTranslation();

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
        value={subdivision}
        onChange={(e) => {
          handleSetSubdivision(Number(e.target.value));
          e.currentTarget.blur();
        }}
      >
        {
          SUBDIVISIONS.map((item) => {
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