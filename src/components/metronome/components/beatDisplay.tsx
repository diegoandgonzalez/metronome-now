import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  beatTypes: number[],
  beatsPerMeasure: number
  currentBeatInMeasure: number
  handleClick: (beatIndex: number) => void,
};

const BeatDisplay = (props: Props) => {

  const {
    beatTypes,
    beatsPerMeasure,
    currentBeatInMeasure,
    handleClick,
  } = props;

  const { t } = useTranslation();

  const splitBeatArray = useMemo(() => {
    const spliceIndex = beatsPerMeasure <= 4 ? beatsPerMeasure : Math.floor(beatsPerMeasure / 2);

    const beatArray = Array.from(Array(beatsPerMeasure).keys());
    const firstHalfArray = beatArray.splice(0, spliceIndex);
    const secondHalfArray = beatArray;

    return [firstHalfArray, secondHalfArray];
  }, [beatsPerMeasure]);

  return (
    <div className="beatContainer">
      {
        splitBeatArray.map((beatArray, beatArrayIndex) => {
          return (
            <div key={beatArrayIndex}>
              {
                beatArray.map((beatIndex) => {

                  const isCurrentBeat = currentBeatInMeasure === beatIndex;
                  const beatType = beatTypes[beatIndex];

                  return (
                    <button
                      key={beatIndex}
                      className="beat"
                      data-beat-type={String(beatType)}
                      data-is-current-beat={String(isCurrentBeat)}
                      title={t("clickToToggleBeatType")}
                      onClick={(e) => {
                        handleClick(beatIndex);
                        e.currentTarget.blur();
                      }}
                    />
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  );
};

export default BeatDisplay;