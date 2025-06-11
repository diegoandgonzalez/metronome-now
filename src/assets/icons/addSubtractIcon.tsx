import { ICON_SIZE } from "../../utils/constants";

const AddSubtractIcon = ({ size = ICON_SIZE }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 12h3m3 0H7m0 0V9m0 3v3m7-3h6"
            />
        </svg>
    );
}

export default AddSubtractIcon;