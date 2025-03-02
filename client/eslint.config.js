import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config({
    ignores: ['dist'],
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked
    ],
    files: ['**/*.{ts,tsx}'],
    plugins: ['react-hooks', 'react-refresh'],
    languageOptions: {
        ecmaVersion: 2022,
        globals: globals.browser,
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
});
