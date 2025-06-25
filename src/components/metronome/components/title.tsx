type Props = {
    handleClick: () => void,
}

const Title = (props: Props) => {

    const {
        handleClick,
    } = props;

    return (
        <h1
            title={`v${__APP_VERSION__}`}
            onClick={handleClick}
        >
            Metronome <b>Now</b>
        </h1>
    );
}

export default Title;