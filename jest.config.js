// https://jestjs.io/docs/configuration

/** @type {require('@jest/types').Config.InitialOptions} */
const config = {
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  notify: false,
  roots: ['src', 'tests'],
  testRegex: '.*\\.(spec|test|integration)\\.ts',
  // testRunner: 'jest-jasmine2',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@carbonteq/app-result(.*)$': '<rootDir>/lib/$1',
  },
};

module.exports = config;
