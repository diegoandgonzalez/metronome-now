import { formatMsToHHMMSS } from "../../../utils/format";

type Props = {
  value: number,
};

const Timer = (props: Props) => {

  const {
    value,
  } = props;

  return (
    <p className="timer">
      {formatMsToHHMMSS(value)}
    </p>
  );
};

export default Timer;