import type { ReactNode } from "react";

type Props = {
    isActive: boolean
    handleClick: () => void,
    children: ReactNode,
}

const IconButton = (props: Props) => {

    const {
        isActive,
        children,
        handleClick,
    } = props;

    return (
        <button
            data-is-off={String(!isActive)}
            className="iconButton"
            onClick={(e) => {
                handleClick();
                e.currentTarget.blur();
            }}
        >
            {children}
        </button>
    );
}

export default IconButton;