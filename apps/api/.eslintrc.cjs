module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    // OOP rigor
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'explicit',
          methods: 'explicit',
          properties: 'explicit',
          parameterProperties: 'explicit',
        },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: false, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: false },
    ],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          // Fields
          'signature',
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-decorated-field',
          'protected-decorated-field',
          'private-decorated-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          // Constructor
          'public-constructor',
          'protected-constructor',
          'private-constructor',
          // Methods
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-decorated-method',
          'protected-decorated-method',
          'private-decorated-method',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
        ],
      },
    ],
    '@typescript-eslint/method-signature-style': ['error', 'method'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-readonly': ['error'],
    '@typescript-eslint/parameter-properties': [
      'error',
      { allows: ['private readonly', 'protected readonly', 'public readonly', 'readonly'] },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'typeLike', format: ['PascalCase'] },
      { selector: 'classMethod', format: ['camelCase'] },
      { selector: 'classProperty', format: ['camelCase'] },
      { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
      { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
      { selector: 'enumMember', format: ['PascalCase'] },
    ],
    'max-classes-per-file': ['error', 1],
    'no-empty-function': ['error', { allow: ['constructors'] }],
  },
}

