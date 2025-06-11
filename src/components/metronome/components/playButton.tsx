import PlayIcon from "../../../assets/icons/playIcon";
import StopIcon from "../../../assets/icons/stopIcon";

type Props = {
    handleClick: () => void,
    isPlaying: boolean,
}

const PlayButton = (props: Props) => {

    const {
        isPlaying,
        handleClick
    } = props;

    return (
        <button
            className="playButton"
            onClick={(e) => {
                handleClick();
                e.currentTarget.blur();
            }}
        >
            {isPlaying ? <StopIcon /> : <PlayIcon />}
        </button>
    );
}

export default PlayButton;