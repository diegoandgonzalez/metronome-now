import { formatMsToHHMMSS } from "../../../utils/format";

type Props = {
  value: number,
  secondsToStop?: number,
};

const Clock = (props: Props) => {

  const {
    value,
    secondsToStop,
  } = props;

  return (
    <div className="clockContainer">
      <p className="clock">
        {formatMsToHHMMSS(value)}
      </p>
      {
        Boolean(secondsToStop) &&
        <>
          <p>/</p>
          <p className="clock">
            {formatMsToHHMMSS(secondsToStop as number * 1000)}
          </p>
        </>
      }
    </div>
  );
};

export default Clock;