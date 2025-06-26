import CloseIcon from "../assets/icons/closeIcon";

type Props = {
    handleClose: () => void,
}

const CloseButton = (props: Props) => {

    const {
        handleClose,
    } = props;

    return (
        <button className="closeButton" onClick={handleClose}>
            {<CloseIcon />}
        </button>
    )
}

export default CloseButton;