import { ICON_SIZE } from "../../utils/constants";

const CreateIcon = ({ size = ICON_SIZE }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z"
            />
        </svg>
    );
}

export default CreateIcon;