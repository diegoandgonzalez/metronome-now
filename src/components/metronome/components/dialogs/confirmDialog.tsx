import Dialog from "../../../dialog/dialog";

type Props = {
    open: boolean,
    title: string,
    message: string,
    handleSubmit: () => void,
    handleClose: () => void,
}

const ConfirmDialog = (props: Props) => {

    const {
        open,
        title,
        message,
        handleSubmit,
        handleClose,
    } = props;

    return (
        <Dialog
            open={open}
            title={title}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <p>
                {message}
            </p>
        </Dialog>
    );
}

export default ConfirmDialog;