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
    "rules": {
        // required as 'off' since typescript-eslint has own versions
        "indent": "off",
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/no-duplicate-imports": ["error"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "no-redeclare": "off",
        "no-unused-vars": "error",
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
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }]
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

