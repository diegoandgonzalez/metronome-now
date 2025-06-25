import Dialog from "../../../dialog/dialog";

type Props = {
    open: boolean,
    handleClose: () => void,
}

const AboutDialog = (props: Props) => {

    const {
        open,
        handleClose,
    } = props;

    return (
        <Dialog
            open={open}
            title={"Metronome Now"}
            handleClose={handleClose}
        >
            <p>
                {`v${__APP_VERSION__}`}
            </p>
        </Dialog>
    );
}

export default AboutDialog;