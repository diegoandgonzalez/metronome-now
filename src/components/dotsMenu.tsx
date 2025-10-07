import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    options: {
        name: string,
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

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("scroll", closeMenu, true);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", closeMenu, true);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
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

    const handleLoopTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "Tab") return;

        const focusable = Array.from(menuRef.current!.querySelectorAll<HTMLButtonElement>("button"));
        if (focusable.length === 0) return;

        const firstItem = focusable[0];
        const lastItem = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
        }

        if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
        }
    };

    return (
        <div
            ref={containerRef}
        >
            <button
                className="dotsMenuButton"
                onClick={() => setOpen((prev) => !prev)}
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
                        onKeyDown={handleLoopTabKeyDown}
                    >
                        {
                            options.map((option, index) => (
                                <button
                                    key={index}
                                    ref={index === 0 ? firstItemToFocusRef : null}
                                    className="menuItem"
                                    onClick={(e) => {
                                        e.currentTarget.blur();
                                        option.onClick();
                                        setOpen(false);
                                    }}
                                >
                                    {option.icon}
                                    {option.name}
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