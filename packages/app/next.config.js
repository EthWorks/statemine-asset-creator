/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    dirs: ['components', 'pages', '__mocks__/next', '__tests__', 'globalTypes', 'storybookHelpers', 'utils', 'styles']
  },
}
