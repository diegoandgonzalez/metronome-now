import CloseIcon from "../../assets/icons/closeIcon";

type Props = {
    ref: React.Ref<HTMLDialogElement>,
    handleClose: () => void,
    title?: string,
    children?: React.ReactNode,
}

// TODO: close on click outside

const Dialog = (props: Props) => {

    const {
        ref,
        title,
        handleClose,
        children,
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
        </dialog>
    )
}

export default Dialog;