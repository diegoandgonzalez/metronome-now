import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { readFileSync } from 'fs';
import withSerwistInit from '@serwist/next';

const packageJsonVersion = JSON.parse(readFileSync('./package.json', 'utf8')).version;
const nextConfig: NextConfig = {
    env: {
        APP_VERSION: packageJsonVersion,
    },
};

const withSerwist = withSerwistInit({
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',
    additionalPrecacheEntries: [
        { url: '/worklets/metronome-processor.js', revision: packageJsonVersion },
        { url: '/en', revision: packageJsonVersion },
        { url: '/es', revision: packageJsonVersion },
        { url: '/audio/clickAccent.wav', revision: packageJsonVersion },
        { url: '/audio/clickMuted.wav', revision: packageJsonVersion },
        { url: '/audio/clickNormal.wav', revision: packageJsonVersion },
    ],
});
const withNextIntl = createNextIntlPlugin();

export default withSerwist(withNextIntl(nextConfig));