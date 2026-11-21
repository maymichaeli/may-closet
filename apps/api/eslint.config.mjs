import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import shared from '../../eslint.shared.cjs';

export default defineConfig([
  {
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.recommended, ...shared],
  },
]);
