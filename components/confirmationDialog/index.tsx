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
import { useConfirmationDialog } from '@/components/confirmationDialog/context';

const ConfirmationDialog = () => {

    const {
        open,
        state,
        handleClose,
        resetState,
    } = useConfirmationDialog();

    const {
        title,
        question,
        handleConfirm,
    } = state;

    const t = useTranslations();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                transition: {
                    onExited: resetState,
                },
            }}
        >
            <DialogTitle onClose={handleClose}>
                {title || t('attention')}
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
                        handleConfirm?.();
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