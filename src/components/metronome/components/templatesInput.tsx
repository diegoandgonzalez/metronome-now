import CreateIcon from "../../../assets/icons/createIcon";
import DeleteIcon from "../../../assets/icons/deleteIcon";
import EditIcon from "../../../assets/icons/editIcon";
import type {
    Template,
} from "../types";

type Props = {
    value: string
    templates: Template[],
    handleSelectTemplate: (newTemplateID: string) => void,
    handleCreateTemplate: () => void,
    handleUpdateTemplate: () => void,
    handleDeleteTemplate: () => void,
}

const TemplatesInput = (props: Props) => {

    const {
        value,
        templates,
        handleSelectTemplate,
        handleCreateTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
    } = props;

    return (
        <div className="templatesInputContainer">
            <select
                className="templatesInput"
                value={value}
                onChange={(e) => {
                    e.currentTarget.blur();
                    handleSelectTemplate(e.target.value);
                }}
            >
                {
                    templates.map((template) => {
                        return (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        )
                    })
                }
            </select>
            <button
                className="templatesButton"
                title={"Create template"} // TODO: translate
                onClick={(e) => {
                    e.currentTarget.blur();
                    handleCreateTemplate();
                }}
            >
                {<CreateIcon size={20} />}
            </button>
            {
                Boolean(value) &&
                <>
                    <button
                        className="templatesButton"
                        title={"Update template"} // TODO: translate
                        onClick={(e) => {
                            e.currentTarget.blur();
                            handleUpdateTemplate();
                        }}
                    >
                        {<EditIcon size={16} />}
                    </button>
                    <button
                        className="templatesButton"
                        title={"Delete template"} // TODO: translate
                        onClick={(e) => {
                            e.currentTarget.blur();
                            handleDeleteTemplate();
                        }}
                    >
                        {<DeleteIcon size={16} />}
                    </button>
                </>
            }
        </div>
    );
}

export default TemplatesInput;