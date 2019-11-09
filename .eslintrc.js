module.exports = {
    "parserOptions": {
        // 支持新语法特性（不包括新版本带来的新全局变量，如Set，新全局变量需要通过设置env.es6这些属性来支持）
        "ecmaVersion": 2018,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jquery": true
    },
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "rules": {
        "max-len": ["error", { "code": 300 }],
        "max-lines": ["error", {
            "max": 1000,
            "skipBlankLines": true,
            "skipComments": true,
        }],
        "quotes": ["error", "single"],
    },
    "plugins": [
        "babel",
        "react",
        "standard",
        "promise",
        "import",
        "node"
    ],
    "globals": {
        $: true,
        utils: true,
        navigator: true,
    },
    "settings": {
        "react": {
            // Regex for Component Factory to use, default to "createReactClass"
            "createClass": "createReactClass",
            // Pragma to use, default to "React"
            "pragma": "React",
            // React version, default to the latest React stable release
            "version": "16.3.1"
        }
    }
}
