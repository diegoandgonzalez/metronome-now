import { formatMsToHHMMSS } from "../../utils/format";

type Props = {
  value: number,
};

const Timer = (props: Props) => {

  const {
    value,
  } = props;

  return (
    <p>
      {formatMsToHHMMSS(value)}
    </p>
  );
};

export default Timer;