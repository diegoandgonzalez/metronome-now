import { useTranslation } from "react-i18next";
import Dialog from "./dialog";

type Props = {
    open: boolean,
    title?: string,
    children?: React.ReactNode,
    handleClose: () => void,
    handleSubmit: () => void,
}

const FormDialog = (props: Props) => {

    const {
        open,
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
                    <div className="dialogButtonContainer">
                        <button type="submit">
                            {t("accept") // TODO: poner boton cancelar?
                            }
                        </button>
                    </div>
                </form>
            }
            handleClose={handleClose}
        />
    );
}

export default FormDialog;