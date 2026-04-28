import { ButtonBase, Grid, Typography } from '@mui/material';
import LocaleSelector from '@/components/localeSelector';

type Props = {
    userButton: React.ReactNode,
    disableLocaleSelector: boolean,
    handleTitleClick: () => void,
}

const Header = (props: Props) => {

    const {
        userButton,
        disableLocaleSelector,
        handleTitleClick,
    } = props;

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
                <ButtonBase
                    onClick={handleTitleClick}
                    color='inherit'
                    sx={{
                        gap: '0.5ch',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                    }}
                >
                    Metronome
                    <Typography component='span' variant='h5' color='primary' fontWeight={'inherit'}>
                        Now
                    </Typography>
                </ButtonBase>
                <Grid container spacing={1}>
                    <LocaleSelector disabled={disableLocaleSelector} />
                    {userButton}
                </Grid>
            </Grid>
        </header>
    );
}

export default Header;