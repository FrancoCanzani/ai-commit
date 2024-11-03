export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ESM
  globals: {
    'ts-jest': {
      useESM: true, // Enable ESM support
    },
  },
};
