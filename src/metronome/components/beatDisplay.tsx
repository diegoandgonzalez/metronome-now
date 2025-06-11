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

  return (
    <div className="beatContainer">
      {
        [...Array(beatsPerMeasure)].map((_, beatIndex) => {

          const isCurrentBeat = currentBeatInMeasure === beatIndex;
          const beatType = beatTypes[beatIndex];

          return (
            <button
              key={beatIndex}
              className="beat"
              data-beat-type={String(beatType)}
              data-is-current-beat={String(isCurrentBeat)}
              onClick={(e) => {
                handleClick(beatIndex);
                e.currentTarget.blur();
              }}
            />
          )
        })
      }
    </div>
  );
};

export default BeatDisplay;