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
        <button onClick={handleClick}>
            {isPlaying ? "Stop" : "Start"}
        </button>
    );
}

export default PlayButton;