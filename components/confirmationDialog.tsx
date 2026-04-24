'use client'
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    Typography,
} from '@mui/material';
import DialogTitle from '@/components/dialogTitle';

type Props = {
    open: boolean,
    question: string,
    handleConfirm: () => void,
    handleClose: () => void,
}

const ConfirmationDialog = (props: Props) => {

    const {
        open,
        question,
        handleConfirm,
        handleClose,
    } = props;

    const t = useTranslations();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle onClose={handleClose}>
                {t('attention')}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {question}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    type='button'
                    variant='dark'
                    onClick={handleClose}
                >
                    {t('cancel')}
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    onClick={() => {
                        handleConfirm();
                        handleClose();
                    }}
                >
                    {t('accept')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;