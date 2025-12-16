/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx,js,jsx}'],

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    '^@api(.*)$': '<rootDir>/src/utils/burger-api$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3)$':
      '<rootDir>/__mocks__/fileMock.js'
  },

  moduleDirectories: ['node_modules', 'src'],

  // Игнорируем cypress папку
  testPathIgnorePatterns: ['/node_modules/', '/cypress/']
};
