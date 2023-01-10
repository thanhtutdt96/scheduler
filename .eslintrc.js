const { resolve } = require("path");

module.exports = {
  root: true,

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "prettier"
  ],

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: resolve(__dirname, "./tsconfig.json"),
    tsconfigRootDir: __dirname,
    parser: "@typescript-eslint/parser",
  },
  plugins: ["react", "@typescript-eslint", "import", "jsx-a11y", "react-hooks", "prettier"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    "prettier/prettier": [
      "warn",
      {
        "singleQuote": true,
        "jsxSingleQuote": false,
        "semi": true,
        "tabWidth": 2,
        "trailingComma": "all",
        "printWidth": 100,
        "bracketSameLine": false,
        "useTabs": false,
        "arrowParens": "always",
        "endOfLine": "auto"
      }
    ],

    "import/order": [
      "error", {
      groups: [
        "builtin", "external", "internal", "parent", "sibling", "index", "type"
      ],
      pathGroups: [
        // Types
        {
          pattern: "**/types/**",
          group: "type"
        },
        // React modules
        {
          pattern: "react**",
          group: "builtin",
        },
        // Assets
        {
          pattern: "assets/**",
          group: "internal",
          position: "before"
        },
        // Routes
        {
          pattern: "router/**",
          group: "internal",
          position: "before"
        },
        // Hooks
        {
          pattern: "hooks/**",
          group: "internal",
          position: "before"
        },
        // Helpers
        {
          pattern: "utils/**",
          group: "internal",
          position: "before"
        },
        // Components (.tsx extension)
        {
          pattern: "pages/**/*.tsx",
          group: "internal",
        },
        {
          pattern: "components/**/*.tsx",
          group: "internal",
        },
        {
          pattern: "**App**",
          group: "internal",
        },
      ],
      pathGroupsExcludedImportTypes: ["internal"],
      alphabetize: {
        order: "asc"
      },
      "newlines-between": "never"
    }],
    // To have alphabetical order on named imports
    // import { a, b, c } from "foo";
    "sort-imports": ["error",
      {
      ignoreDeclarationSort: true,
      ignoreCase: true
    }],

    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variableLike",
        format: [
          "camelCase", "UPPER_CASE", "PascalCase"
        ]
      },
      {
        selector: "typeLike",
        format: [
          "PascalCase"
        ]
      },
      {
        selector: "enumMember",
        format: [
          "UPPER_CASE", "PascalCase"
        ]
      },
      {
        selector: "variable",
        "types": [
          "boolean"
        ],
        format: [
          "PascalCase"
        ],
        prefix: [
          "is", "are", "should", "has", "have", "can", "did", "will"
        ]
      }
    ]
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}
