/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/**/*.test.ts'],
  moduleNameMapper: {
    '^@ludo/(.*)$': '<rootDir>/packages/$1',
  },

  collectCoverageFrom: ['packages/game/**/*.ts', '!packages/game/**/*.test.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
