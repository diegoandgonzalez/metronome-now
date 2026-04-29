'use client'
import Link from 'next/link';
import { Grid, Typography, Link as MuiLink } from '@mui/material';
import { useTranslations } from 'next-intl';

const NotFound = () => {

    const t = useTranslations();

    return (
        <Grid
            container direction={'column'} alignItems={'center'} justifyContent={'center'} spacing={2}
            sx={{ minHeight: '100svh', paddingBottom: 4 }}
        >
            <Typography variant='h1' sx={{ fontSize: '4rem' }}>
                ⚠️ {t('pageNotFound')}
            </Typography>
            <MuiLink component={Link} href="/" sx={{ fontSize: '2rem' }}>
                {t('goToMainPage')}
            </MuiLink>
        </Grid>
    )
}

export default NotFound;