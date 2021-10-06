module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/securityrules/**/?*.(spec|test).[jt]s?(x)'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  moduleNameMapper: {
    "^@firetasks/(.*)$": "<rootDir>/libs/$1"
  },
};
