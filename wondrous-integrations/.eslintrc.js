module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-typescript/base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["prettier", "import"],
  rules: {
    "prettier/prettier": "error",
  },
};
