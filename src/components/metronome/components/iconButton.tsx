import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation();

    return (
        <button
            data-is-off={String(!isActive)}
            title={title ? t(title) : ""}
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