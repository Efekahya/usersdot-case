module.exports = {
  extends: [
    "mantine",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  plugins: [, "@typescript-eslint", "react-hooks", "import"],
  overrides: [
    {
      files: ["**/?(*.)+(spec|test).[jt]s?(x)"]
    }
  ],
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    radix: "off",
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unescaped-entities": "off",
    "import/extensions": "off",
    "linebreak-style": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "typeLike",
        format: ["PascalCase"]
      },
      {
        selector: "variableLike",
        format: ["camelCase", "PascalCase", "snake_case"],
        leadingUnderscore: "allow"
      },
      {
        selector: "property",
        filter: "__typename",
        format: null
      },
      {
        selector: "variable",
        filter: "__typename",
        format: null
      },
      {
        selector: ["enumMember"],
        format: ["UPPER_CASE"]
      }
    ],

    "import/no-unresolved": 0,
    "import/no-named-as-default": 0,
    "import/namespace": "off",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "sibling",
          "parent",
          "index",
          "object",
          "type"
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before"
          },
          {
            pattern: "*style*",
            patternOptions: {
              matchBase: true
            },
            group: "type",
            position: "after"
          }
        ],
        pathGroupsExcludedImportTypes: ["react"]
      }
    ]
  }
};
