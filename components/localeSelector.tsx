'use client';
import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import TranslateIcon from '@mui/icons-material/Translate';
import { usePathname, useRouter } from '@/i18n/routing';
import { LOCALES } from '@/utils/constants';
import DotsMenu from '@/components/dotsMenu';

const LocaleSelector = ({ disabled }: { disabled: boolean }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const t = useTranslations();
    const locale = useLocale();

    const handleChangeLanguage = (nextLocale: string) => {
        if (locale === nextLocale) return;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <DotsMenu
            ariaLabel={t('language')}
            disabled={isPending || disabled}
            icon={<TranslateIcon />}
            options={LOCALES.map((language) => ({ key: language, label: t(language), onClick: () => handleChangeLanguage(language) }))}
        />
    )
}

export default LocaleSelector;