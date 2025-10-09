import CloseIcon from "../../assets/icons/closeIcon";
import styles from "./closeButton.module.css";

type Props = {
    handleClose: () => void,
}

const CloseButton = (props: Props) => {

    const {
        handleClose,
    } = props;

    return (
        <button
            className={styles.closeButton}
            onClick={handleClose}
        >
            <CloseIcon />
        </button>
    )
}

export default CloseButton;