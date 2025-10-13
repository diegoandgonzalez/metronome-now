import type { ReactNode } from "react";
import styles from "./iconButton.module.css";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: "transparent" | "main" | "secondary";
    variant?: "round" | "square",
    children: ReactNode,
};

const IconButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {

    const {
        color = "main",
        variant = "round",
        children,
        ...rest
    } = props;

    return (
        <button
            ref={ref}
            {...rest}
            data-variant={variant}
            data-color={color}
            className={styles.iconButton}
        >
            {children}
        </button>
    );
})

export default IconButton;