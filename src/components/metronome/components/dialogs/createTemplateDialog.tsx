import { useState } from "react";
import Dialog from "../../../dialog/dialog";
import useSnackbarContext from "../../../snackbar/useSnackbarContext";

type Props = {
    open: boolean,
    handleSetTemplate: (newName: string) => void,
    handleClose: () => void,
}

const CreateTemplateDialog = (props: Props) => {

    const {
        open,
        handleSetTemplate,
        handleClose,
    } = props;

    const [templateName, setTemplateName] = useState("");

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const handleSubmit = () => {
        if (!templateName) { // TODO: min and max length
            handleOpenSnackbar("Name required");
            return;
        }

        handleSetTemplate(templateName);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            title={"Create template"}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
        >
            <p>
                {"A new template will be created with the current settings."}
            </p>
            <label>
                {"New template name"}:
                <input
                    // TODO: min and max length
                    // TODO: style
                    style={{ background: "transparent", outline: 0, border: 0, borderBottom: "1px solid var(--textColor)" }}
                    value={templateName}
                    onChange={(e) => {
                        setTemplateName(e.target.value);
                    }}
                />
            </label>
        </Dialog>
    );
}

export default CreateTemplateDialog;