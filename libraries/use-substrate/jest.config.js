// jest.config.js

module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: [
    // '/libraries/use-substrate/node_modules/(?!@polkadot|@testing-library/jest-dom)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  roots: ['<rootDir>/src', '<rootDir>/__tests__']
}
