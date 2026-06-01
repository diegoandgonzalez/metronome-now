'use client'
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    Link,
} from '@mui/material';
import DialogTitle from '@/components/dialogTitle';
import QRCode from 'react-qr-code';
import { TEMPLATE_PARAM_NAME } from '@/utils/constants';
import { Template } from '@/utils/types';
import { encode } from '@/utils/helpers';

type Props = {
    open: boolean,
    template: Template,
    handleClose: () => void,
}

const ShareTemplateDialog = (props: Props) => {

    const {
        open,
        template,
        handleClose,
    } = props;

    const t = useTranslations();

    const handleShare = async (templateName: string, url: string) => {
        try {
            await navigator.share({
                title: `${templateName} | Metronome Now`,
                url: url,
            });
        } catch {}
    }

    const urlString = useMemo(() => {
        const encodedTemplate = encode(template);
        const url = new URL('/', window.location.origin);
        url.searchParams.set(TEMPLATE_PARAM_NAME, encodedTemplate);
        return url.toString();
    }, [template])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle onClose={handleClose}>
                {t('share')}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {t('scanQRorOpenURL')}
                </Typography>
                <Link href={urlString} target="_blank" rel="noreferrer" noWrap>
                    {urlString.substring(0, 45)}...
                </Link>
                <div style={{ marginTop: 20, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 10, background: 'white' }}>
                        <QRCode value={urlString} />
                    </div>
                </div>
                <Typography align='center' sx={{ fontSize: '0.8rem' }}>
                    {template.name}
                </Typography>
                {
                    Boolean(navigator.share) &&
                    <Button
                        style={{ marginTop: 20 }}
                        variant='contained'
                        onClick={() => handleShare(template.name, urlString)}
                        fullWidth
                    >
                        {t("shareUrl")}
                    </Button>
                }
            </DialogContent>
        </Dialog>
    );
}

export default ShareTemplateDialog;