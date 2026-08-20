import { useTranslations } from 'next-intl';
import { Grid, Typography } from '@mui/material';
import DotsMenu from '@/components/dotsMenu';
import HighlightedText from '@/components/highlightedText';

type BaseProps = {
    selected: boolean,
    name: string,
    description: string,
    searchQuery?: string,
    hasUnsavedChanges?: boolean,
}

type NonEditableProps = {
    editable: false,
    handleRename?: never,
    handleSaveChanges?: never,
    handleDuplicate?: never,
    handleDelete?: never,
    handleShare?: never,
}

type EditableProps = {
    editable: true,
    handleRename: () => void,
    handleSaveChanges: () => void,
    handleDuplicate: () => void,
    handleDelete: () => void,
    handleShare: () => void,
}

type Props = BaseProps & (NonEditableProps | EditableProps);

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
            container alignItems={'center'} justifyContent={'space-between'} wrap='nowrap'
            sx={{
                width: '100%',
                color: ({ palette }) => selected ? palette.primary.main : palette.text.primary,
            }}
        >
            <Grid container size={11} direction={'column'} justifyContent={'center'} spacing={0.5}>
                <Typography sx={{ paddingRight: 2 }}>
                    <HighlightedText text={name} query={searchQuery} />
                </Typography>
                <Typography variant='caption'>
                    {hasUnsavedChanges ? t('hasUnsavedChanges') : description}
                </Typography>
            </Grid>
            {
                editable &&
                <Grid container size={1} justifyContent={'center'}>
                    <DotsMenu
                        options={
                            [
                                {
                                    key: 'share',
                                    label: t('share'),
                                    onClick: () => handleShare(),
                                },
                                {
                                    key: 'update',
                                    label: t('update'),
                                    onClick: () => handleSaveChanges(),
                                },
                                {
                                    key: 'rename',
                                    label: t('rename'),
                                    onClick: () => handleRename(),
                                },
                                {
                                    key: 'duplicate',
                                    label: t('duplicate'),
                                    onClick: () => handleDuplicate(),
                                },
                                {
                                    key: 'delete',
                                    label: t('delete'),
                                    onClick: () => handleDelete(),
                                },
                            ]
                                .filter((option) => {
                                    if (hasUnsavedChanges && option.key === 'share') return false;
                                    if (!hasUnsavedChanges && option.key === 'update') return false;
                                    return true;
                                })
                        }
                    />
                </Grid>
            }
        </Grid>
    );
}

export default TemplateItem;