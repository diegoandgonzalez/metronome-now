import type { ReactNode } from "react";
import styles from "./iconButton.module.css";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: "transparent" | "primary" | "secondary";
    variant?: "round" | "square",
    children: ReactNode,
};

const IconButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {

    const {
        color = "primary",
        variant = "round",
        children,
        ...htmlButtonElementProps
    } = props;

    return (
        <button
            {...htmlButtonElementProps}
            ref={ref}
            data-variant={variant}
            data-color={color}
            className={styles.iconButton}
        >
            {children}
        </button>
    );
})

export default IconButton;