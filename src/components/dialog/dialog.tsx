import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import CloseButton from "../closeButton";

type Props = {
    open: boolean,
    title?: string,
    children?: React.ReactNode,
    handleClose: () => void,
}

const Dialog = (props: Props) => {

    const {
        open,
        title,
        children,
        handleClose,
    } = props;

    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (open && dialogRef.current) {
            previouslyFocusedElement.current = document.activeElement as HTMLElement;

            const focusable = Array
                .from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
                .filter((htmlElement) => !htmlElement.hasAttribute("disabled") && !htmlElement.getAttribute("aria-hidden"));

            if (focusable.length > 0) {
                focusable[0].focus();
            }

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    handleClose();
                    return;
                }

                if (e.key === "Tab") {
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    const active = document.activeElement as HTMLElement;

                    if (e.shiftKey) {
                        if (active === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else {
                        if (active === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
            };

            document.addEventListener("keydown", handleKeyDown);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                previouslyFocusedElement.current?.focus();
            };
        }
    }, [open, handleClose]);

    if (!open) return;

    return createPortal(
        <>
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                className="dialog"
            >
                <div className="dialogHeader">
                    <p className="dialogTitle">
                        {title}
                    </p>
                    <CloseButton handleClose={handleClose} />
                </div>
                <div className="dialogBody">
                    {children}
                </div>
            </div>
            <div className="backdrop" onClick={handleClose} />
        </>,
        document.body
    )
}

export default Dialog;