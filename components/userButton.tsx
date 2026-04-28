'use client';
import { useState, MouseEvent } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Avatar, Button, Grid, IconButton, Popover, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useSnackbar } from '@/components/snackbar/context';
import { URLS } from '@/utils/constants';
import { Template } from '@/utils/types';

type Props = {
    templates: Template[],
    handleDeleteAllTemplates: () => void,
    handleResetUserSettings: () => void,
}

const UserButton = (props: Props) => {
    const {
        templates,
        handleDeleteAllTemplates,
        handleResetUserSettings,
    } = props;

    const { data: session, status } = useSession();
    const t = useTranslations();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { handleOpen: handleOpenSnackbar } = useSnackbar();

    const handleOpenPopover = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        handleOpenSnackbar({ text: t('userLoggedOut'), type: 'success' });
        handleResetUserSettings();
    }

    const isLoading = status === 'loading';
    const popoverIsOpen = Boolean(anchorEl);
    const popoverId = popoverIsOpen ? 'profile-popover' : undefined;

    if (!session) {
        return (
            <IconButton
                disabled={isLoading}
                title={t('login')}
                aria-label={t('login')}
                onClick={() => signIn('google')}
            >
                <LoginIcon />
            </IconButton>
        )
    }

    return (
        <>
            <IconButton
                aria-describedby={popoverId}
                disabled={isLoading}
                title={t('profile')}
                aria-label={t('profile')}
                onClick={handleOpenPopover}
            >
                <Avatar
                    src={session.user?.image || ''}
                    alt={t('userImage')}
                    sx={{ width: '1.5rem', height: '1.5rem' }}
                />
            </IconButton>
            <Popover
                id={popoverId}
                open={popoverIsOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Grid
                    container
                    direction={'column'}
                    alignItems={'center'}
                    spacing={4}
                    sx={{
                        padding: 3,
                    }}
                >
                    <Grid container direction={'column'} alignItems={'center'} spacing={1}>
                        <Typography variant='caption'>
                            {session.user?.email}
                        </Typography>
                        <IconButton onClick={() => window.open(URLS.google.account, '_blank')}>
                            <Avatar
                                title={t('viewAccount')}
                                src={session.user?.image || ''}
                                alt={t('userImage')}
                                sx={{ width: '3.5rem', height: '3.5rem' }}
                            />
                        </IconButton>
                        <Typography variant='h5'>
                            {t('hi', { username: session.user?.name?.split(' ')[0] || '' })}
                        </Typography>
                    </Grid>
                    <Grid container direction={'column'} alignItems={'center'} spacing={1}>
                        <Typography variant='caption'>
                            {t('youHaveTemplates', { amount: templates.length })}
                        </Typography>
                        {
                            Boolean(templates.length) &&
                            <Button
                                onClick={handleDeleteAllTemplates}
                                variant='dark'
                                startIcon={<DeleteForeverIcon />}
                            >
                                {t('deleteAllTemplates')}
                            </Button>
                        }
                    </Grid>
                    <Button
                        onClick={handleSignOut}
                        variant='contained'
                        startIcon={<LogoutIcon />}
                    >
                        {t('logout')}
                    </Button>
                </Grid>
            </Popover>
        </>
    );
}

export default UserButton;