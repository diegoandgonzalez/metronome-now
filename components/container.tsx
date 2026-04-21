import { Grid, Typography } from '@mui/material';

type Props = {
    label?: string,
    children?: React.ReactNode,
}

const Container = (props: Props) => {

    const {
        label,
        children,
    } = props;

    return (
        <Grid
            container size={12} spacing={2}
            sx={{
                position: 'relative',
                border: '1px solid',
                borderColor: ({ palette }) => palette.border.main,
                borderRadius: 1,
                padding: 2.5,
                marginTop: 1,
            }}
        >
            {
                label &&
                <Typography
                    sx={{
                        position: 'absolute',
                        top: -13,
                        left: 10,
                        paddingLeft: 1,
                        paddingRight: 1,
                        backgroundColor: ({ palette }) => palette.background.default,
                    }}
                >
                    {label}
                </Typography>
            }
            {children}
        </Grid>
    );
}

export default Container;