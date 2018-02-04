module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": true
    },
    "extends": "airbnb",
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "rules": {
        "arrow-body-style": [0, "as-needed"],
        "react/prop-types": [0, { "ignore": [], "customValidators": [] }],
        "import/prefer-default-export": 0,
        "arrow-parens": ["off"],
        "compat/compat": "error",
        "consistent-return": "off",
        "comma-dangle": [2, "only-multiline"],
        "generator-star-spacing": "off",
        "import/no-unresolved": "error",
        "import/no-extraneous-dependencies": "off",
        "no-console": "off",
        "no-use-before-define": "off",
        "no-multi-assign": "off",
        "promise/param-names": "error",
        "promise/always-return": "error",
        "promise/catch-or-return": "error",
        "promise/no-native": "off",
        "react/jsx-no-bind": "off",
        "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
        "react/prefer-stateless-function": "off",
        "no-plusplus": "off"
    },
    "plugins": [
        "import",
        "promise",
        "compat",
        "react"
    ],
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": "webpack.config.eslint.js"
            }
        }
    }
};