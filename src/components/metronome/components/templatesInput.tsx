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
        <div className="templatesInput">
            <select
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
                title={"Create template"} // TODO: translate
                onClick={handleCreateTemplate}
            >
                {"➕"}
            </button>
            {
                Boolean(value) &&
                <>
                    <button
                        title={"Update template"} // TODO: translate
                        onClick={handleUpdateTemplate}
                    >
                        {"✏️"}
                    </button>
                    <button
                        title={"Delete template"} // TODO: translate
                        onClick={handleDeleteTemplate}
                    >
                        {"❌"}
                    </button>
                </>
            }
        </div>
    );
}

export default TemplatesInput;