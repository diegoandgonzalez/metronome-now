import CloseIcon from "../../assets/icons/closeIcon";

type Props = {
    ref: React.Ref<HTMLDialogElement>,
    title?: string,
    children?: React.ReactNode,
    handleClose: () => void,
    handleSubmit: () => void,
}

// TODO: close on click outside

const Dialog = (props: Props) => {

    const {
        ref,
        title,
        children,
        handleClose,
        handleSubmit,
    } = props;

    return (
        <dialog
            ref={ref}
            onClose={handleClose}
        >
            <div className="dialogHeader">
                <p className="dialogTitle">
                    {title}
                </p>
                <button className="closeIcon" onClick={handleClose}>
                    {<CloseIcon />}
                </button>
            </div>
            <div>
                {children}
            </div>
            <div className="dialogButtonContainer">
                <button onClick={handleSubmit} type="submit">
                    {"Accept"}
                </button>
            </div>
        </dialog>
    )
}

export default Dialog;