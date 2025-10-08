import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    options: {
        label: string,
        icon?: React.ReactNode,
        onClick: () => void,
    }[],
};

const DotsMenu = ({ options }: Props) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const firstItemToFocusRef = useRef<HTMLButtonElement>(null);
    const triggerButtonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        const closeMenu = () => setOpen(false);

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current && !containerRef.current.contains(event.target as Node) &&
                menuRef.current && !menuRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopImmediatePropagation();
                event.preventDefault();
                closeMenu();
                triggerButtonRef.current?.focus();
                return;
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape, true);
            window.addEventListener("scroll", closeMenu, true);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape, true);
            window.removeEventListener("scroll", closeMenu, true);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape, true);
            window.removeEventListener("scroll", closeMenu, true);
        };
    }, [open]);

    useLayoutEffect(() => {
        if (!open) return;

        const containerRect = containerRef.current!.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight || 0;
        const menuWidth = menuRef.current?.offsetWidth || 0;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const fitsBelow = (containerRect.bottom + menuHeight) <= viewportHeight;
        const top = fitsBelow ? (containerRect.bottom + window.scrollY) : (containerRect.top + window.scrollY - menuHeight);

        const fitsRight = (containerRect.left + menuWidth) <= viewportWidth;
        const left = fitsRight ? (containerRect.left + window.scrollX) : (containerRect.right + window.scrollX - menuWidth);

        setPosition({ top, left });
        firstItemToFocusRef.current?.focus();
    }, [open]);

    const handleNavigationKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const focusable = Array.from(menuRef.current!.querySelectorAll<HTMLButtonElement>("button"));
        if (focusable.length === 0) return;

        const currentIndex = focusable.indexOf(document.activeElement as HTMLButtonElement);

        const focusNext = () => focusable[(currentIndex + 1) % focusable.length].focus();
        const focusPrevious = () => focusable[(currentIndex - 1 + focusable.length) % focusable.length].focus();
        const focusFirst = () => focusable[0].focus();
        const focusLast = () => focusable[focusable.length - 1].focus();

        switch (event.key) {
            case "Tab":
                event.preventDefault();
                if (event.shiftKey) {
                    focusPrevious();
                    break;
                }
                focusNext();
                break;
            case "ArrowDown":
                event.preventDefault();
                focusNext();
                break;
            case "ArrowUp":
                focusPrevious();
                break;
            case "Home":
                event.preventDefault();
                focusFirst();
                break;
            case "End":
                event.preventDefault();
                focusLast();
                break;
            default: break;
        }
    };

    return (
        <div ref={containerRef}>
            <button
                ref={triggerButtonRef}
                className="dotsMenuButton"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen((prev) => !prev);
                    }
                }}
            >
                {"⋮"}
            </button>
            {
                open &&
                createPortal(
                    <div
                        ref={menuRef}
                        className="menu"
                        style={{
                            top: position.top,
                            left: position.left,
                        }}
                        onKeyDown={handleNavigationKeys}
                    >
                        {
                            options.map((option, index) => (
                                <button
                                    key={index}
                                    ref={index === 0 ? firstItemToFocusRef : null}
                                    title={option.label}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        option.onClick();
                                        setOpen(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            option.onClick();
                                            setOpen(false);
                                        }
                                    }}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            ))
                        }
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default DotsMenu;