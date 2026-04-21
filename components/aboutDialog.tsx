'use client'
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    Typography,
} from '@mui/material';
import DialogTitle from '@/components/dialogTitle';

type Props = {
    open: boolean,
    handleClose: () => void,
}

const AboutDialog = (props: Props) => {

    const {
        open,
        handleClose,
    } = props;

    const t = useTranslations();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle onClose={handleClose}>
                {t('title')}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {`v${process.env.APP_VERSION}`}
                </Typography>
            </DialogContent>
        </Dialog>
    );
}

export default AboutDialog;