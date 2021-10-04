require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
    extends: [
        'plugin:jest/recommended',
        'semistandard',
        'plugin:@typescript-eslint/recommended'
    ],
    plugins: [
        '@typescript-eslint/eslint-plugin',
        '@dxos'
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        'no-void': [
            'error',
            {
                allowAsStatement: true
            }
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': ['error'],
        '@typescript-eslint/ban-types': 'off',
        '@dxos/header': 'error',
        'import/order': ['error', {
            pathGroups: [
                {
                    pattern: '@material-ui/**',
                    group: 'external',
                    position: 'after'
                },
                {
                    pattern: '@{dxos,wirelineio}/**',
                    group: 'internal',
                    position: 'before'
                }
            ],
            pathGroupsExcludedImportTypes: ['@{dxos,wirelineio}/**', '@material-ui/**'],
            'newlines-between': 'always',
            groups: [
                ['builtin', 'external'],
                'internal'
            ],
            alphabetize: {
                order: 'asc'
            }
        }],
        '@typescript-eslint/no-unused-vars': 'error',
        'curly': ['error', 'all'],
        'brace-style': ['error', '1tbs']
    }
};
