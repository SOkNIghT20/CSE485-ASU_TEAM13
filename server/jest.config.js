module.exports = {
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@routes/(.*)$': '<rootDir>/routes/$1',
    '^@views/(.*)$': '<rootDir>/views/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(pug|pug-filters|uglify-js)/)'
  ]
}; 