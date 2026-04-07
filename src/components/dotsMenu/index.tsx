import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Props = {
    icon?: React.ReactNode,
    options: {
        key: string,
        label: string,
        onClick: () => void,
    }[],
};

const DotsMenu = ({ options, icon }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleOpen}>
                {icon || <MoreVertIcon />}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    options.map((option) => (
                        <MenuItem
                            key={option.key}
                            onClick={(e) => {
                                option.onClick();
                                handleClose(e);
                            }}
                            sx={{ display: "block", padding: "6px 24px" }}
                        >
                            {option.label}
                        </MenuItem>
                    ))
                }
            </Menu>
        </div>
    );
}

export default DotsMenu;