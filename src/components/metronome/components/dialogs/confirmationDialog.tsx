import FormDialog from "../../../dialog/formDialog";

type Props = {
    open: boolean,
    title: string,
    message: string,
    handleSubmit: () => void,
    handleClose: () => void,
}

const ConfirmationDialog = (props: Props) => {

    const {
        open,
        title,
        message,
        handleSubmit,
        handleClose,
    } = props;

    return (
        <FormDialog
            open={open}
            title={title}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <p>
                {message}
            </p>
        </FormDialog>
    );
}

export default ConfirmationDialog;