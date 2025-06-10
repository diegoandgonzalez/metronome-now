type Props = {
    handleClick: () => void,
    mute: boolean,
}

const MuteButton = (props: Props) => {

    const {
        mute,
        handleClick,
    } = props;

    return (
        <button
            onClick={(e) => {
                handleClick();
                e.currentTarget.blur();
            }}
        >
            {mute ? "Unmute" : "Mute"}
        </button>
    );
}

export default MuteButton;