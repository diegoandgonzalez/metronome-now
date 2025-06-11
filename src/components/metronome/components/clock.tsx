import { formatMsToHHMMSS } from "../../../utils/format";

type Props = {
  value: number,
};

const Clock = (props: Props) => {

  const {
    value,
  } = props;

  return (
    <p className="clock">
      {formatMsToHHMMSS(value)}
    </p>
  );
};

export default Clock;