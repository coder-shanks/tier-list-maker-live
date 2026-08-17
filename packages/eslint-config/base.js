import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export const baseConfig = tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.turbo/**', 'build/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)

export default baseConfig
