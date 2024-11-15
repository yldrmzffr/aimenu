/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  i18n: {
    locales: ['en', 'tr', 'zh', 'ja', 'ko', 'ar'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
