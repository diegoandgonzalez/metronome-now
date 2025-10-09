import type { ReactNode } from "react";
import styles from "./iconButton.module.css";

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
            className={styles.iconButton}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}

export default IconButton;