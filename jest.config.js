module.exports = {
  roots: ['<rootDir>/src'],
  // collectCoverageFrom: [],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  // preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
