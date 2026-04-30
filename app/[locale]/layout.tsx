import type { Metadata } from 'next';
import { Space_Grotesk, Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { routing } from '@/i18n/routing';
import ClientProviders from '@/components/clientProviders';
import CustomSnackbar from '@/components/snackbar';
import { LOCALES } from '@/utils/constants';
import Spinner from '@/components/spinner';
import ConfirmationDialog from '@/components/confirmationDialog';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
})

const roboto = Roboto({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    variable: '--font-roboto',
})

type Props = {
    params: Promise<{ locale: string }>;
    children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    if (!LOCALES.includes(locale)) notFound();

    const t = await getTranslations({ locale });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    const ogLocale = locale === 'es' ? 'es_ES' : 'en_US'
    const altLocale = locale === 'es' ? 'en_US' : 'es_ES'

    return {
        title: t('title'),
        description: t('description'),
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `/${locale}`,
            languages: {
                'en': '/en',
                'es': '/es',
                'x-default': '/en',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}`,
            siteName: t('title'),
            locale: ogLocale,
            alternateLocale: [altLocale],
            images: [
                {
                    url: '/images/icons/android-chrome-512x512.png',
                    width: 512,
                    height: 512,
                    alt: t('title'),
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: t('title'),
            description: t('description'),
        },
    }
}

export default async function RootLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale} className={`${spaceGrotesk.variable} ${roboto.variable}`}>
            <body>
                <NextIntlClientProvider>
                    <AppRouterCacheProvider>
                        <ClientProviders>
                            {children}
                            <Spinner />
                            <CustomSnackbar />
                            <ConfirmationDialog />
                        </ClientProviders>
                    </AppRouterCacheProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
