import { useTranslations } from 'next-intl';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import useIsMobileSize from '@/utils/hooks/useIsMobileSize';
import LocaleSelector from '@/components/localeSelector';

type Props = {
    userButton: React.ReactNode,
    disableLocaleSelector: boolean,
    handleTitleClick: () => void,
    handleShortcutsClick: () => void,
}

const Header = (props: Props) => {

    const {
        userButton,
        disableLocaleSelector,
        handleTitleClick,
        handleShortcutsClick,
    } = props;

    const t = useTranslations();
    const isMobileSize = useIsMobileSize();

    return (
        <header>
            <Grid
                container justifyContent={'space-between'} alignItems={'center'} spacing={2}
                sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    paddingTop: 1,
                    paddingBottom: 0,
                    paddingX: 2,
                }}
            >
                <Button
                    onClick={handleTitleClick}
                    color='inherit'
                    sx={{
                        padding: 0,
                        display: 'flex',
                        gap: '0.5ch',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    Metronome
                    <Typography component='span' variant='h5' color='primary' fontWeight={'inherit'}>
                        Now
                    </Typography>
                </Button>
                <Grid container spacing={1}>
                    {
                        !isMobileSize &&
                        <IconButton
                            title={t('shortcuts')}
                            aria-label={t('shortcuts')}
                            onClick={handleShortcutsClick}
                        >
                            <HelpIcon />
                        </IconButton>
                    }
                    <LocaleSelector disabled={disableLocaleSelector} />
                    {userButton}
                </Grid>
            </Grid>
        </header>
    );
}

export default Header;