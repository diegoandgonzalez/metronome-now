import { useTranslation } from "react-i18next";
import { MAX_VOLUME, MIN_VOLUME } from "../../../utils/constants";

type Props = {
  value: number,
  handleChange: (value: number) => void,
}

const VolumeInput = (props: Props) => {

  const {
    value,
    handleChange,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="volumeInputContainer">
      <button
        title={t("mute")}
        onClick={(e) => {
          handleChange(0);
          e.currentTarget.blur();
        }}
        >
        🔇
      </button>
      <input
        type="range"
        className="volumeInput"
        min={MIN_VOLUME}
        max={MAX_VOLUME}
        value={value}
        onChange={(e) => handleChange(parseFloat(e.target.value))}
        />
      <button
        title={t("setMaxVolume")}
        onClick={(e) => {
          handleChange(MAX_VOLUME);
          e.currentTarget.blur();
        }}
      >
        🔊
      </button>
    </div>
  );
};

export default VolumeInput;