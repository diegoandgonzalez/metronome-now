import { useEffect, useRef, useState } from "react";

type Props = {
    options: {
        name: string,
        icon?: React.ReactNode,
        onClick: () => void,
    }[];
};

const DotsMenu = (props: Props) => {

    const {
        options,
    } = props;

    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="dotsMenuContainer" ref={ref}>
            <button
                onClick={() => setOpen((prev) => !prev)}
            >
                ⋮
            </button>
            {
                open &&
                <div className="menu">
                    {
                        options.map((option, index) => {
                            return (
                                <button
                                    key={index}
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
                            )
                        })
                    }
                </div>
            }
        </div>
    );
};

export default DotsMenu;