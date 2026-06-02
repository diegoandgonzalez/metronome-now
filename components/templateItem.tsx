import { useTranslations } from 'next-intl';
import { Grid, Typography } from '@mui/material';
import DotsMenu from '@/components/dotsMenu';
import HighlightedText from '@/components/highlightedText';

type Props = {
    selected: boolean,
    editable: boolean,
    name: string,
    description: string,
    searchQuery?: string,
    hasUnsavedChanges?: boolean,
    handleRename?: () => void,
    handleSaveChanges?: () => void,
    handleDuplicate?: () => void,
    handleDelete?: () => void,
    handleShare?: () => void,
}

const TemplateItem = (props: Props) => {

    const {
        selected,
        editable,
        name,
        description,
        searchQuery,
        hasUnsavedChanges = false,
        handleRename,
        handleSaveChanges,
        handleDuplicate,
        handleDelete,
        handleShare,
    } = props;

    const t = useTranslations();

    return (
        <Grid
            container alignItems={'center'} justifyContent={'space-between'} spacing={2} wrap='nowrap'
            sx={{
                width: '100%',
                color: ({ palette }) => selected ? palette.primary.main : palette.text.primary,
            }}
        >
            <div>
                <Typography sx={{ maxWidth: '50ch', overflowWrap: 'break-word' }}>
                    <HighlightedText text={name} query={searchQuery} />
                </Typography>
                <Typography variant='caption'>
                    {hasUnsavedChanges ? t('hasUnsavedChanges') : description}
                </Typography>
            </div>
            {
                editable &&
                <DotsMenu
                    options={
                        [
                            {
                                key: 'share',
                                label: t('share'),
                                onClick: () => handleShare?.(),
                            },
                            {
                                key: 'update',
                                label: t('update'),
                                onClick: () => handleSaveChanges?.(),
                            },
                            {
                                key: 'rename',
                                label: t('rename'),
                                onClick: () => handleRename?.(),
                            },
                            {
                                key: 'duplicate',
                                label: t('duplicate'),
                                onClick: () => handleDuplicate?.(),
                            },
                            {
                                key: 'delete',
                                label: t('delete'),
                                onClick: () => handleDelete?.(),
                            },
                        ]
                            .filter((option) => {
                                if (hasUnsavedChanges && option.key === 'share') return false;
                                if (!hasUnsavedChanges && option.key === 'update') return false;
                                return true;
                            })
                    }
                />
            }
        </Grid>
    );
}

export default TemplateItem;