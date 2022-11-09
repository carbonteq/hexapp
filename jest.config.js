// https://jestjs.io/docs/configuration

/** @type {require('@jest/types').Config.InitialOptions} */
const config = {
	moduleFileExtensions: ['js', 'ts'],
	testEnvironment: 'node',
	notify: false,
	rootDir: '.',
	roots: ['src', 'tests'],
	testRegex: '.*\\.(spec|test|integration)\\.ts',
	testPathIgnorePatterns: ['/node_modules/'],
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest',
	},
	transformIgnorePatterns: ['/node_modules/'],
	moduleNameMapper: {
		'^@carbonteq/hexapp(.*)$': ['<rootDir>/lib'],
		'^oxide.ts/(.*)$': ['<rootDir>/node_modules/oxide.ts/$1'],
	},
	setupFilesAfterEnv: ['jest-extended/all'],
};

module.exports = config;
