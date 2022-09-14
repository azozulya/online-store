/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    resetMocks: false,
    setupFiles: ['jest-localstorage-mock'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    },
};
