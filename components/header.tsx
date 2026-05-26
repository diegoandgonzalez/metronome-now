import { ButtonBase, Grid, Typography } from '@mui/material';
import LocaleSelector from '@/components/localeSelector';

type Props = {
    disableLocaleSelector: boolean,
    handleTitleClick: () => void,
}

const Header = (props: Props) => {

    const {
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
                    paddingTop: 1.5,
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
                <LocaleSelector disabled={disableLocaleSelector} />
            </Grid>
        </header>
    );
}

export default Header;