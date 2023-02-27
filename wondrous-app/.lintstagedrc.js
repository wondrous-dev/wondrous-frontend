const path = require('path');

// https://nextjs.org/docs/basic-features/eslint#lint-staged=
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')} --quiet`;

module.exports = {
  '*.{ts,tsx}': [() => 'yarn tsc --noEmit', 'prettier --write'],
  '*.json': ['prettier --write'],
};
