const recomended = require('./recomended');

module.exports = {
    ...recomended,
    extends: [
        ...recomended.extends,
        'plugin:react/recommended'
    ],
    rules: {
        ...recomended.rules,
        "react/prop-types": "off",
        "no-use-before-define": "off",
        "jsx-quotes": [
            "error",
            "prefer-double"
        ],
        "@typescript-eslint/no-use-before-define": "error"
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    env: {
        browser: true
    }
}
