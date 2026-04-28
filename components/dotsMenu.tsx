'use client'
import { useState, MouseEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslations } from 'next-intl';

type Props = {
    ariaLabel?: string,
    icon?: React.ReactNode,
    disabled?: boolean,
    options: {
        key: string,
        label: string,
        onClick: () => void,
    }[],
};

const DotsMenu = ({ disabled, options, icon, ariaLabel }: Props) => {

    const t = useTranslations();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                title={ariaLabel || t('options')}
                aria-label={ariaLabel || t('options')}
                onClick={handleOpen}
                disabled={disabled}
            >
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
                            sx={{ display: 'block', paddingX: 3, paddingY: 0.625 }}
                        >
                            {option.label}
                        </MenuItem>
                    ))
                }
            </Menu>
        </>
    );
}

export default DotsMenu;