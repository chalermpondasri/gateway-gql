module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "apps/**/tsconfig.app.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint",
    "@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier"

  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: [".eslintrc.js", "dist", "node_modules"],
  rules: {
    "no-extra-semi": "off",
    "no-throw-literal": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-extra-semi": "error",
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/method-signature-style": ["error", "method"],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "memberLike",
        "modifiers": ["private"],
        "format": ["camelCase"],
        "leadingUnderscore": "require"
      },
      {
        "selector": "enum",
        "format": ["PascalCase"]
      },
      {
        "selector": "enumMember",
        "format": ["UPPER_CASE"]
      }
    ],
    "@typescript-eslint/prefer-enum-initializers": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-literal-enum-member": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/no-throw-literal": "error"
  }
};
