import AddSubtractIcon from "../../../assets/icons/addSubtractIcon";

type Props = {
    handleClick: () => void,
}

const BPMProgrammer = (props: Props) => {

    const {
        handleClick
    } = props;

    return (
        <button
            data-is-off="true" 
            className="iconButton"
            onClick={(e) => {
                handleClick();
                e.currentTarget.blur();
            }}
        >
            {<AddSubtractIcon />}
        </button>
    );
}

export default BPMProgrammer;