export default {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  settings: {
    react: {
      version: "18.2",
    },
  },
  rules: {
    "@typescript-eslint/no-unused-expressions": "warn",
    "no-prototype-builtins": "warn",
    "no-useless-escape": "warn",
  },
  ignores: ["**/node_modules/", "**/temp.js", "config/*"],
};
