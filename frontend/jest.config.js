module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 55,
      lines: 80,
      statements: 80
    }
  }
};
