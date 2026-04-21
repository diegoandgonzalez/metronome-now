import { useTranslations } from 'next-intl';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle as MuiDialogTitle, Grid, IconButton } from '@mui/material';

type Props = {
    children: string,
    onClose: () => void,
}

const DialogTitle = (props: Props) => {

    const {
        children,
        onClose,
    } = props;

    const t = useTranslations();

    return (
        <MuiDialogTitle>
            <Grid container alignItems={'center'} justifyContent={'space-between'} wrap='nowrap' spacing={5}>
                {children}
                <IconButton
                    title={t('close')}
                    aria-label={t('close')}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </Grid>
        </MuiDialogTitle>
    )
}

export default DialogTitle;