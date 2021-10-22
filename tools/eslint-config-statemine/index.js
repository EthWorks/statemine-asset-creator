module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true,
        "browser": true,
        "jest": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "eslint:recommended"
    ],
    "globals": {
        "JSX": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "simple-import-sort"
    ],
    "rules": {
        "indent": "off",
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/no-duplicate-imports": ["error"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "no-redeclare": "off",
        // note you must disable the base rule as it can report incorrect errors
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "quotes": ["error", "single"],
        "prefer-const": ["error", {"destructuring": "all"}],
        "semi": ["error", "never"],
        "no-extra-semi": "off",
        "@typescript-eslint/no-extra-semi": "off",
        "padding-line-between-statements": [
            "error",
            { "blankLine": "always", "prev": "import", "next": "*" },
            { "blankLine": "any", "prev": "import", "next": "import" },
            { "blankLine": "always", "prev": "*", "next": "return" },
            { "blankLine": "always", "prev": "*", "next": "function" },
        ],
        "object-curly-spacing": ["error", "always"],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/explicit-function-return-type": ["error", {
            "allowExpressions": true
        }],
        "eol-last": ["error", "always"],
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
        'simple-import-sort/imports': [2, {
            groups: [
                ['^\u0000'], // all side-effects (0 at start)
                ['\u0000$', '^@polkadot.*\u0000$','^use-substrate.*\u0000$','^\\..*\u0000$'], // types (0 at end)
                ['^[^/\\.]'], // non-use-substrate
                ['^use-substrate'], // use-substrate
                ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'] // local (. last)
            ]
        }],
    },
    "overrides": [
        {
            "files": [
                "__tests__/**/*.{js,ts,tsx}"
            ],
            "rules": {
                "@typescript-eslint/no-non-null-assertion": "off",
                "no-unused-expressions": "off",
                "@typescript-eslint/explicit-function-return-type": "off"
            }
        }
    ]
}

