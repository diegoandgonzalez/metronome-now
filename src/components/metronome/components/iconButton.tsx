import type { ReactNode } from "react";

type Props = {
    title?: string,
    isActive: boolean
    handleClick: () => void,
    children: ReactNode,
}

const IconButton = (props: Props) => {

    const {
        title,
        isActive,
        children,
        handleClick,
    } = props;

    return (
        <button
            data-is-off={String(!isActive)}
            title={title || ""}
            className="iconButton"
            onClick={(e) => {
                e.currentTarget.blur();
                handleClick();
            }}
        >
            {children}
        </button>
    );
}

export default IconButton;