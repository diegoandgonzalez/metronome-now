import { useTranslation } from "react-i18next";
import Dialog from "./dialog";

type Props = {
    open: boolean,
    hideActions?: boolean,
    title?: string,
    children?: React.ReactNode,
    handleClose: () => void,
    handleSubmit: () => void,
}

const FormDialog = (props: Props) => {

    const {
        open,
        hideActions,
        title,
        children,
        handleClose,
        handleSubmit,
    } = props;

    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            title={title}
            children={
                <form
                    className="dialogForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    noValidate
                >
                    {children}
                    {
                        !hideActions &&
                        <div className="dialogButtonContainer">
                            <button
                                title={t("cancel")}
                                type="button"
                                onClick={handleClose}
                            >
                                {t("cancel")}
                            </button>
                            <button
                                title={t("accept")}
                                type="submit"
                            >
                                {t("accept")}
                            </button>
                        </div>
                    }
                </form>
            }
            handleClose={handleClose}
        />
    );
}

export default FormDialog;