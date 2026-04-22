'use client';
import { useState, MouseEvent } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Avatar, Button, Grid, IconButton, Popover, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSnackbar } from '@/components/snackbar/context';

type Props = {
    afterSignOutCallback: () => void,
}

const UserButton = ({ afterSignOutCallback }: Props) => {
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
        afterSignOutCallback();
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
                    sx={{ width: 24, height: 24 }}
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
                    spacing={2}
                    sx={{
                        width: 250,
                        padding: 2,
                    }}
                >
                    <Typography variant='caption'>
                        {session.user?.email}
                    </Typography>
                    <Grid container direction={'column'} alignItems={'center'} spacing={1}>
                        <Avatar
                            title={session.user?.name || ''}
                            src={session.user?.image || ''}
                            alt={t('userImage')}
                            sx={{ width: 60, height: 60 }}
                        />
                        <Typography variant='h5'>
                            {t('hi', { username: session.user?.name?.split(' ')[0] || '' })}
                        </Typography>
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