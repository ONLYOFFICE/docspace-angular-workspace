// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'coverage/**', 'out-tsc/**', '.angular/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    // Both components in this repo hold their template inline, so without this
    // the template rules below would have nothing to run against.
    processor: angular.processInlineTemplates,
    rules: {
      // The published component is used as <docspace>, the way the sibling
      // library is used as <document-editor> and the React one as <DocSpace>.
      // These rules cannot express that: they go quiet without a 'prefix', and
      // with one they demand a selector after it, which a bare <docspace> has
      // not got. The selector is part of the public API and settled in the
      // README, so the rules give way rather than the name.
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
      // Angular's inline templates are always template literals, and they carry
      // the double quotes of the markup, so backticks stay allowed.
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ['error', 'always'],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
