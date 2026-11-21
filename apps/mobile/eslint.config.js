const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const shared = require('../../eslint.shared.cjs');

module.exports = defineConfig([
  { ignores: ['dist/**', '.expo/**', 'expo-env.d.ts'] },
  expoConfig,
  ...shared,
]);
