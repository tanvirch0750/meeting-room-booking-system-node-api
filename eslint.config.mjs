import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['node_modules/', 'dist/'], // Add your ignore patterns here
    },
    {
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-unused-expressions': 'error',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
);

// import globals from 'globals';
// import pluginJs from '@eslint/js';
// import tseslint from 'typescript-eslint';

// export default [
//     {
//         ignores: ['node_modules/', 'dist/'], // Add your ignore patterns here
//     },
//     {
//         files: ['/*.ts'], // Specify file extensions to lint
//         languageOptions: {
//             ecmaVersion: 'latest',
//             sourceType: 'module',
//         },

//         rules: {
//             '@typescript-eslint/no-unused-vars': ['error'],
//             // to enforce using type for object type definitions, can be type or interface
//             '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
//             '@typescript-eslint/no-unused-expressions': 'error',
//             '@typescript-eslint/prefer-const': 'error',
//             '@typescript-eslint/no-console': 'error',
//             '@typescript-eslint/no-undef': 'error',
//         },
//         globals: {
//             process: 'readonly',
//         },
//         extends: [
//             'eslint:recommended',
//             'plugin:@typescript-eslint/recommended',
//             'prettier',
//         ],
//     },

//     { files: ['/*.{js,mjs,cjs,ts}'] },
//     { languageOptions: { globals: globals.browser } },
//     pluginJs.configs.recommended,
//     ...tseslint.configs.recommended,
// ];
