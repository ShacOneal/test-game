/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/**/*.test.ts'],
  moduleNameMapper: {
    '^@ludo/(.*)$': '<rootDir>/packages/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/packages/game/tsconfig.json', // Itt találja meg az esModuleInterop beállítást!
    },
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
