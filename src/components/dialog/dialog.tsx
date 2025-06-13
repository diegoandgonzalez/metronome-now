import { useTranslation } from "react-i18next";
import CloseButton from "../closeButton";

type Props = {
    open: boolean,
    title?: string,
    children?: React.ReactNode,
    handleClose: () => void,
    handleSubmit: () => void,
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

    if (!open) return;

    return (
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
                <div className="dialogButtonContainer">
                    <button onClick={handleSubmit} type="submit">
                        {t("accept")}
                    </button>
                </div>
            </div>
            <div className="backdrop" />
        </>
    )
}

export default Dialog;