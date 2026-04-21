import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const nextConfig: NextConfig = {
    env: {
        APP_VERSION: packageJson.version,
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);