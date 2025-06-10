type Props = {
  accentedBeats: number[],
  beatsPerMeasure: number
  currentBeatInMeasure: number
  handleSetAccentedBeat: (beatIndex: number) => void,
};

const BeatDisplay = (props: Props) => {

  const {
    accentedBeats,
    beatsPerMeasure,
    currentBeatInMeasure,
    handleSetAccentedBeat,
  } = props;

  return (
    <div className="beatContainer">
      {
        [...Array(beatsPerMeasure)].map((_, beatIndex) => {

          const isCurrentBeat = currentBeatInMeasure === beatIndex;
          const isAccentedBeat = accentedBeats.includes(beatIndex);

          return (
            <button
              key={beatIndex}
              className="beat"
              data-is-accented-beat={String(isAccentedBeat)}
              data-is-current-beat={String(isCurrentBeat)}
              onClick={() => handleSetAccentedBeat(beatIndex)}
            >
              {beatIndex + 1}
            </button>
          )
        })
      }
    </div>
  );
};

export default BeatDisplay;