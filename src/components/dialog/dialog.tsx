import { useTranslation } from "react-i18next";
import CloseButton from "../closeButton";
import useExecuteOnKeyPressed from "../../utils/hooks/useExecuteOnKeyPressed";
import { createPortal } from "react-dom";

type Props = {
    open: boolean,
    title?: string,
    children?: React.ReactNode,
    handleClose: () => void,
    handleSubmit?: () => void,
}

const Dialog = (props: Props) => {

    const {
        open,
        title,
        children,
        handleClose,
        handleSubmit,
    } = props;

    const { t } = useTranslation();

    useExecuteOnKeyPressed("Escape", handleClose);

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
                {
                    Boolean(handleSubmit) &&
                    <div className="dialogButtonContainer">
                        <button onClick={handleSubmit}>
                            {t("accept")}
                        </button>
                    </div>
                }
            </div>
            <div className="backdrop" onClick={handleClose} />
        </>,
        document.body
    )
}

export default Dialog;