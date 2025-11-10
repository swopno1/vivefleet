import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  /* config options here */
}

const withNextIntl = createNextIntlPlugin()

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
}

export default withPWA(pwaConfig)(withNextIntl(nextConfig))
