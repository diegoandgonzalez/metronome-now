import { createPortal } from "react-dom";
import CloseButton from "../closeButton";

type Props = {
    open: boolean,
    title?: string,
    children?: React.ReactNode,
    handleClose: () => void,
}

const Dialog = (props: Props) => {

    const {
        open,
        title,
        children,
        handleClose,
    } = props;

    if (!open) return;

    return createPortal(
        <>
            <div className="dialog">
                <div className="dialogHeader">
                    <p className="dialogTitle">
                        {title}
                    </p>
                    <CloseButton handleClose={handleClose} />
                </div>
                <div className="dialogBody">
                    {children}
                </div>
            </div>
            <div className="backdrop" onClick={handleClose} />
        </>,
        document.body
    )
}

export default Dialog;