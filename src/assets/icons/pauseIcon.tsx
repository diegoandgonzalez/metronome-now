import { ICON_SIZE } from "../../utils/constants";

const PauseIcon = ({ size = ICON_SIZE }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 26 26"
            width={size}
            height={size}
        >
            <path
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                d="M7 5c-.551 0-1 .449-1 1v14c0 .551.449 1 1 1h3c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1H7zm9 0c-.551 0-1 .449-1 1v14c0 .551.449 1 1 1h3c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1h-3z"
            />
        </svg>
    );
}

export default PauseIcon;