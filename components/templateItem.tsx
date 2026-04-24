import { useTranslations } from 'next-intl';
import { Grid, Typography } from '@mui/material';
import DotsMenu from '@/components/dotsMenu';

type Props = {
    selected: boolean,
    editable: boolean,
    name: string,
    description: string,
    hasUnsavedChanges?: boolean,
    handleSelect: () => void,
    handleRename?: () => void,
    handleSaveChanges?: () => void,
    handleDuplicate?: () => void,
    handleDelete?: () => void,
}

const TemplateItem = (props: Props) => {

    const {
        selected,
        editable,
        name,
        description,
        hasUnsavedChanges = false,
        handleSelect,
        handleRename,
        handleSaveChanges,
        handleDuplicate,
        handleDelete,
    } = props;

    const t = useTranslations();

    return (
        <Grid
            role='button'
            container alignItems={'center'} justifyContent={'space-between'} spacing={2} wrap='nowrap'
            sx={{
                width: '100%',
                color: ({ palette }) => selected ? palette.primary.main : palette.text.primary,
            }}
            onClick={() => {
                if (selected) return;
                handleSelect();
            }}
        >
            <div>
                <Typography sx={{ maxWidth: '30ch', overflowWrap: 'break-word' }}>
                    {name}
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
                            }
                        ]
                            .filter((option) => {
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