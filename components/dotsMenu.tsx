'use client'
import { useState, MouseEvent, KeyboardEvent } from 'react';
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

    const handleOpenOnClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleOpenOnKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.stopPropagation();
        }
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
                onClick={handleOpenOnClick}
                onKeyDown={handleOpenOnKeyDown}
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
                            sx={{ display: 'block', paddingX: 3, paddingY: 0.625, minHeight: 'auto' }}
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