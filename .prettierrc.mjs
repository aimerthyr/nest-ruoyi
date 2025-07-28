/**
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  proseWrap: 'never',
  arrowParens: 'avoid',
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-prisma'],
  importOrder: ['<BUILTIN_MODULES>', '<THIRD_PARTY_MODULES>', '^[.]'],
  importOrderCaseSensitive: true,
  importOrderParserPlugins: ['typescript', 'classProperties', 'decorators-legacy'],
};

export default config;
